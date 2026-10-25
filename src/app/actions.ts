"use server";

import { auth } from "@/lib/session";
import { audit } from "@/lib/audit";
import { readCart, writeCart } from "@/lib/cart";
import { isProductFormat } from "@/lib/product-format";
import { LOCALE_COOKIE, isLocale, type Locale } from "@/lib/i18n";
import {
  ACCOUNTING_RETENTION_YEARS,
  COD_SURCHARGE_HALERE,
  LEGAL_VERSIONS,
  SHIPPING_HALERE,
} from "@/lib/merchant";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ConsentType, PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

function visitorId() {
  const jar = cookies();
  let id = jar.get("slinc_vid")?.value;
  if (!id) {
    id = crypto.randomUUID();
    jar.set("slinc_vid", id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      secure: process.env.NODE_ENV === "production",
    });
  }
  return id;
}

export async function addToCart(productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, published: true, stock: { gt: 0 } },
  });
  if (!product) throw new Error("Kazeta není skladem.");
  const cart = readCart();
  const existing = cart.find((line) => line.productId === productId);
  const quantity = (existing?.quantity ?? 0) + 1;
  if (quantity > product.stock) throw new Error("Víc kusů nemáme.");
  const next = existing
    ? cart.map((line) =>
        line.productId === productId ? { ...line, quantity } : line,
      )
    : [...cart, { productId, quantity: 1 }];
  writeCart(next);
  revalidatePath("/kosik");
}

export async function setCartQuantity(productId: string, quantity: number) {
  const cart = readCart().filter((line) => line.productId !== productId);
  if (quantity > 0) cart.push({ productId, quantity });
  writeCart(cart);
  revalidatePath("/kosik");
}

const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(10).max(100),
  marketing: z.string().optional(),
});

export async function registerUser(formData: FormData) {
  const parsed = registerSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    marketing: formData.get("marketing"),
  });
  const email = parsed.email.toLowerCase().trim();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("Účet s tímto e-mailem už existuje.");
  const marketing = parsed.marketing === "on";
  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email,
      passwordHash: await bcrypt.hash(parsed.password, 12),
      marketingConsent: marketing,
      marketingConsentAt: marketing ? new Date() : null,
    },
  });
  await prisma.consentEvent.create({
    data: {
      userId: user.id,
      email,
      type: ConsentType.MARKETING,
      granted: marketing,
      source: "registrace",
      version: LEGAL_VERSIONS.privacy,
    },
  });
  redirect("/prihlaseni?registrovano=1");
}

const checkoutSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(120),
  phone: z.string().min(6).max(30),
  street: z.string().min(3).max(120),
  city: z.string().min(2).max(80),
  zip: z.string().min(3).max(12),
  paymentMethod: z.nativeEnum(PaymentMethod),
  note: z.string().max(500).optional(),
  terms: z.literal("on"),
  withdrawalInfo: z.literal("on"),
  marketing: z.string().optional(),
});

export async function placeOrder(formData: FormData) {
  const parsed = checkoutSchema.parse({
    email: formData.get("email"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    street: formData.get("street"),
    city: formData.get("city"),
    zip: formData.get("zip"),
    paymentMethod: formData.get("paymentMethod"),
    note: String(formData.get("note") ?? ""),
    terms: formData.get("terms"),
    withdrawalInfo: formData.get("withdrawalInfo"),
    marketing: formData.get("marketing"),
  });
  const session = await auth();
  const cart = readCart();
  if (cart.length === 0) throw new Error("Košík je prázdný.");

  const products = await prisma.product.findMany({
    where: { id: { in: cart.map((line) => line.productId) }, published: true },
  });
  const lines = cart.map((line) => {
    const product = products.find((item) => item.id === line.productId);
    if (!product || product.stock < line.quantity) {
      throw new Error("Některá kazeta už není dostupná.");
    }
    return { product, quantity: line.quantity };
  });

  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.priceHalere * line.quantity,
    0,
  );
  const shipping =
    SHIPPING_HALERE +
    (parsed.paymentMethod === PaymentMethod.COD ? COD_SURCHARGE_HALERE : 0);
  const vat = Math.round(
    lines.reduce((sum, line) => {
      const net = line.product.priceHalere * line.quantity;
      return sum + (net * line.product.vatRateBps) / (10000 + line.product.vatRateBps);
    }, 0) + (shipping * 2100) / 12100,
  );
  const total = subtotal + shipping;
  const year = new Date().getFullYear();
  const count = await prisma.order.count();
  const number = `SR-${year}-${String(count + 1).padStart(5, "0")}`;
  const now = new Date();
  const retentionUntil = new Date(now);
  retentionUntil.setFullYear(now.getFullYear() + ACCOUNTING_RETENTION_YEARS);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        number,
        accessToken: crypto.randomUUID(),
        userId: session?.user.id,
        email: parsed.email.toLowerCase().trim(),
        paymentMethod: parsed.paymentMethod,
        billingName: parsed.name,
        billingStreet: parsed.street,
        billingCity: parsed.city,
        billingZip: parsed.zip,
        shippingName: parsed.name,
        shippingStreet: parsed.street,
        shippingCity: parsed.city,
        shippingZip: parsed.zip,
        phone: parsed.phone,
        note: parsed.note || null,
        subtotalHalere: subtotal,
        shippingHalere: shipping,
        vatHalere: vat,
        totalHalere: total,
        termsVersion: LEGAL_VERSIONS.terms,
        privacyVersion: LEGAL_VERSIONS.privacy,
        termsAcceptedAt: now,
        withdrawalInfoAt: now,
        retentionUntil,
        items: {
          create: lines.map((line) => ({
            productId: line.product.id,
            title: line.product.title,
            artist: line.product.artist,
            sku: line.product.sku,
            quantity: line.quantity,
            unitHalere: line.product.priceHalere,
            vatRateBps: line.product.vatRateBps,
          })),
        },
      },
    });
    for (const line of lines) {
      await tx.product.update({
        where: { id: line.product.id },
        data: { stock: { decrement: line.quantity } },
      });
    }
    await tx.consentEvent.createMany({
      data: [
        {
          userId: session?.user.id,
          email: parsed.email,
          type: ConsentType.TERMS,
          granted: true,
          source: "pokladna",
          version: LEGAL_VERSIONS.terms,
        },
        {
          userId: session?.user.id,
          email: parsed.email,
          type: ConsentType.PRIVACY_NOTICE,
          granted: true,
          source: "pokladna",
          version: LEGAL_VERSIONS.privacy,
        },
        {
          userId: session?.user.id,
          email: parsed.email,
          type: ConsentType.MARKETING,
          granted: parsed.marketing === "on",
          source: "pokladna",
          version: LEGAL_VERSIONS.privacy,
        },
      ],
    });
    if (session?.user.id && parsed.marketing === "on") {
      await tx.user.update({
        where: { id: session.user.id },
        data: { marketingConsent: true, marketingConsentAt: now },
      });
    }
    return created;
  });

  writeCart([]);
  await audit({
    actorUserId: session?.user.id,
    action: "order.create",
    entity: "Order",
    entityId: order.id,
  });
  redirect(`/objednavka/${order.number}?t=${order.accessToken}`);
}

export async function saveCookiePreferences(formData: FormData) {
  const analytics = formData.get("analytics") === "on";
  const marketing = formData.get("marketing") === "on";
  const id = visitorId();
  await prisma.cookiePreference.upsert({
    where: { visitorId: id },
    update: { analytics, marketing },
    create: { visitorId: id, analytics, marketing },
  });
  cookies().set(
    "slinc_cookie_choice",
    JSON.stringify({ analytics, marketing, at: Date.now() }),
    {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
    },
  );
  revalidatePath("/");
}

export async function exportMyData() {
  const session = await auth();
  if (!session?.user.id) redirect("/prihlaseni");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { orders: { include: { items: true } }, consents: true },
  });
  if (!user) throw new Error("Účet nenalezen.");
  const payload = {
    exportedAt: new Date().toISOString(),
    person: {
      email: user.email,
      name: user.name,
      phone: user.phone,
      marketingConsent: user.marketingConsent,
    },
    orders: user.orders,
    consents: user.consents,
  };
  await prisma.dataRequest.create({
    data: {
      userId: user.id,
      type: "EXPORT",
      status: "COMPLETED",
      payload,
      completedAt: new Date(),
    },
  });
  await audit({
    actorUserId: user.id,
    action: "gdpr.export",
    entity: "User",
    entityId: user.id,
  });
  return payload;
}

export async function eraseMyAccount() {
  const session = await auth();
  if (!session?.user.id) redirect("/prihlaseni");
  const now = new Date();
  const token = crypto.randomUUID();
  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        email: `anonymized+${token}@erased.local`,
        name: "Anonymizovaný zákazník",
        phone: null,
        passwordHash: await bcrypt.hash(crypto.randomUUID(), 12),
        marketingConsent: false,
        marketingConsentAt: null,
        anonymizedAt: now,
      },
    }),
    prisma.dataRequest.create({
      data: {
        userId: session.user.id,
        type: "ERASURE",
        status: "COMPLETED",
        note: "Účet anonymizován. Účetní údaje objednávek zůstávají do konce zákonné lhůty.",
        completedAt: now,
      },
    }),
  ]);
  await audit({
    actorUserId: session.user.id,
    action: "gdpr.erasure",
    entity: "User",
    entityId: session.user.id,
  });
  redirect("/");
}

export async function setMarketingConsent(granted: boolean) {
  const session = await auth();
  if (!session?.user.id) redirect("/prihlaseni");
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      marketingConsent: granted,
      marketingConsentAt: granted ? new Date() : null,
    },
  });
  await prisma.consentEvent.create({
    data: {
      userId: session.user.id,
      email: session.user.email,
      type: ConsentType.MARKETING,
      granted,
      source: "ucet",
      version: LEGAL_VERSIONS.privacy,
    },
  });
  revalidatePath("/ucet");
}

const withdrawalSchema = z.object({
  orderNumber: z.string().min(3),
  email: z.string().email(),
  reason: z.string().max(500).optional(),
  confirm: z.literal("on"),
});

export async function confirmWithdrawal(formData: FormData) {
  const parsed = withdrawalSchema.parse({
    orderNumber: formData.get("orderNumber"),
    email: formData.get("email"),
    reason: String(formData.get("reason") ?? ""),
    confirm: formData.get("confirm"),
  });
  const order = await prisma.order.findFirst({
    where: {
      number: parsed.orderNumber,
      email: parsed.email.toLowerCase().trim(),
    },
  });
  if (!order) throw new Error("Objednávka nebyla nalezena.");
  const deadline = new Date(order.createdAt);
  deadline.setDate(deadline.getDate() + 14);
  if (new Date() > deadline) {
    throw new Error("Lhůta 14 dnů k odstoupení už uplynula.");
  }
  await prisma.withdrawal.upsert({
    where: { orderId: order.id },
    update: {
      status: "CONFIRMED",
      reason: parsed.reason || null,
      confirmedAt: new Date(),
      deadlineAt: deadline,
    },
    create: {
      orderId: order.id,
      status: "CONFIRMED",
      reason: parsed.reason || null,
      confirmedAt: new Date(),
      deadlineAt: deadline,
    },
  });
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "WITHDRAWN" },
  });
  await audit({
    action: "order.withdrawal",
    entity: "Order",
    entityId: order.id,
  });
  redirect(`/odstoupeni/potvrzeni?objednavka=${order.number}`);
}

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") throw new Error("Jen správa obchodu.");
  const title = String(formData.get("title") ?? "");
  const artist = String(formData.get("artist") ?? "");
  const slug = String(formData.get("slug") ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-");
  const formatValue = String(formData.get("format") ?? "mc");
  await prisma.product.create({
    data: {
      title,
      artist,
      slug,
      sku: slug,
      format: isProductFormat(formatValue) ? formatValue : "mc",
      year: Number(formData.get("year")) || null,
      label: String(formData.get("label") ?? "Šlinc Records"),
      condition: "NEW",
      description: String(formData.get("description") ?? ""),
      priceHalere: Math.round(Number(formData.get("priceCzk")) * 100),
      stock: Number(formData.get("stock") ?? 0),
    },
  });
  revalidatePath("/admin");
  revalidatePath("/katalog");
}

export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return;
  cookies().set(LOCALE_COOKIE, locale, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath("/", "layout");
}
