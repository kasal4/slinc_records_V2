import { placeOrder } from "@/app/actions";
import { readCart } from "@/lib/cart";
import { getLocale, t } from "@/lib/i18n";
import { COD_SURCHARGE_HALERE, formatCzk, SHIPPING_HALERE } from "@/lib/merchant";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/session";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export function generateMetadata(): Metadata {
  return { title: t().checkout.title };
}

export default async function CheckoutPage() {
  const locale = getLocale();
  const copy = t();
  const cart = readCart();
  if (cart.length === 0) redirect("/kosik");
  const session = await auth();
  const user = session?.user.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;
  const products = await prisma.product.findMany({
    where: { id: { in: cart.map((line) => line.productId) } },
  });
  const subtotal = cart.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId);
    return sum + (product?.priceHalere ?? 0) * line.quantity;
  }, 0);

  return (
    <section className="hero">
      <h1>{copy.checkout.title}</h1>
      <p>
        {copy.checkout.goods} {formatCzk(subtotal, locale)}. {copy.checkout.shipping}{" "}
        {formatCzk(SHIPPING_HALERE, locale)}. {copy.checkout.cod}{" "}
        {formatCzk(COD_SURCHARGE_HALERE, locale)}.
      </p>
      <form action={placeOrder} className="panel">
        <label>
          {copy.checkout.name}
          <input name="name" required defaultValue={user?.name ?? ""} />
        </label>
        <label>
          {copy.checkout.email}
          <input
            name="email"
            type="email"
            required
            defaultValue={user?.email ?? session?.user.email ?? ""}
          />
        </label>
        <label>
          {copy.checkout.phone}
          <input name="phone" required defaultValue={user?.phone ?? ""} />
        </label>
        <label>
          {copy.checkout.street}
          <input name="street" required />
        </label>
        <label>
          {copy.checkout.city}
          <input name="city" required />
        </label>
        <label>
          {copy.checkout.zip}
          <input name="zip" required />
        </label>
        <label>
          {copy.checkout.payment}
          <select name="paymentMethod" defaultValue="BANK_TRANSFER">
            <option value="BANK_TRANSFER">{copy.checkout.bankTransfer}</option>
            <option value="COD">{copy.checkout.cashOnDelivery}</option>
          </select>
        </label>
        <label>
          {copy.checkout.note}
          <textarea name="note" rows={3} />
        </label>
        <label className="check">
          <input type="checkbox" name="terms" required />
          {copy.checkout.termsPrefix}{" "}
          <a href="/pravni/obchodni-podminky">{copy.checkout.termsLink}</a>.
        </label>
        <label className="check">
          <input type="checkbox" name="withdrawalInfo" required />
          {copy.checkout.withdrawal}
        </label>
        <label className="check">
          <input type="checkbox" name="marketing" />
          {copy.checkout.marketing}
        </label>
        <button type="submit">{copy.checkout.submit}</button>
      </form>
    </section>
  );
}
