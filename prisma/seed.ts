import { CassetteCondition, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@slinc-records.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "zmen-heslo";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Správce obchodu",
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: Role.ADMIN,
    },
  });

  const demoSlugs = ["night-shift-demo", "suterén-live", "přívoz-ep"];
  await prisma.orderItem.updateMany({
    where: { product: { slug: { in: demoSlugs } } },
    data: { productId: null },
  });
  await prisma.product.deleteMany({ where: { slug: { in: demoSlugs } } });

  const cassettes = [
    {
      slug: "remdik-potkany-patria-do-diery",
      sku: "SLC012",
      title: "Potkany Patria Do Diery",
      artist: "Remdik",
      year: 2026,
      label: "Šlinc Records",
      format: "mc",
      condition: CassetteCondition.NEW,
      image: "/products/remdik.jpg",
      description: "Kazeta, náklad 150 ks.",
      priceHalere: 19500,
      stock: 150,
    },
    {
      slug: "tschechen-sweine",
      sku: "SLC010",
      title: "Tschechen Sweine",
      artist: "Pakosteň / Otras / Bahratal / Chevallier Skrog",
      year: 2026,
      label: "Šlinc Records",
      format: "mc",
      condition: CassetteCondition.NEW,
      image: "/products/tschechen.jpg",
      description: "Kazeta.",
      priceHalere: 24300,
      stock: 10,
    },
    {
      slug: "otras-pakosten-split",
      sku: "SLC007",
      title: "split",
      artist: "Otras / Pakosteň",
      year: 2022,
      label: "Šlinc Records",
      format: "mc",
      condition: CassetteCondition.NEW,
      image: "/products/otras.jpg",
      description: "Kazeta, dvě barevné varianty.",
      priceHalere: 17000,
      stock: 41,
    },
    {
      slug: "spevy-smutnych-lotrov-kazeta",
      sku: "SLC011-CS",
      title: "Spevy smutných Lotrov",
      artist: "Pakosteň",
      year: 2026,
      label: "Šlinc Records",
      format: "mc",
      condition: CassetteCondition.NEW,
      image: "/products/spevy-cs.jpg",
      description: "Bílá kazeta, náklad 300 ks.",
      priceHalere: 19500,
      stock: 194,
    },
    {
      slug: "spevy-smutnych-lotrov-lp",
      sku: "SLC011-LP",
      title: "Spevy smutných Lotrov",
      artist: "Pakosteň",
      year: 2026,
      label: "Šlinc Records",
      format: "lp",
      condition: CassetteCondition.NEW,
      image: "/products/spevy-lp.jpg",
      description: "Černý vinyl, náklad 300 ks.",
      priceHalere: 48700,
      stock: 189,
    },
    {
      slug: "zivy-bic-kazeta",
      sku: "SLC004",
      title: "Živý Bič",
      artist: "Pakosteň",
      year: 2021,
      label: "Šlinc Records",
      format: "mc",
      condition: CassetteCondition.NEW,
      image: "/products/zivy-bic-cs.jpg",
      description: "Kazeta.",
      priceHalere: 12200,
      stock: 0,
    },
    {
      slug: "zivy-bic-lathe",
      sku: "SLC005",
      title: "Živý Bič",
      artist: "Pakosteň",
      year: 2022,
      label: "Šlinc Records",
      format: "lathe",
      condition: CassetteCondition.NEW,
      image: "/products/zivy-bic-lathe.jpg",
      description: "10\" lathe cut.",
      priceHalere: 34100,
      stock: 0,
    },
    {
      slug: "hydrauliter-lp",
      sku: "SLC001",
      title: "Hydrauliter",
      artist: "Hydrauliter",
      year: 2019,
      label: "Šlinc Records",
      format: "lp",
      condition: CassetteCondition.NEW,
      image: "/products/hydra-lp.jpg",
      description: "Černý vinyl.",
      priceHalere: 29200,
      stock: 10,
    },
    {
      slug: "hydrauliter-kazeta",
      sku: "SLC001-CS",
      title: "Hydrauliter",
      artist: "Hydrauliter",
      year: 2019,
      label: "Šlinc Records",
      format: "mc",
      condition: CassetteCondition.NEW,
      image: "/products/hydra-cs.jpg",
      description: "Černá kazeta.",
      priceHalere: 14600,
      stock: 0,
    },
    {
      slug: "hydrauliter-tricko",
      sku: "HYDRA-TS",
      title: "Hydrauliter",
      artist: "Hydrauliter",
      year: 2019,
      label: "Šlinc Records",
      format: "shirt",
      condition: CassetteCondition.NEW,
      image: "/products/hydra-ts.jpg",
      description: "Černé tričko s logem kapely.",
      priceHalere: 29200,
      stock: 0,
    },
  ];

  for (const item of cassettes) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }

  const legal = [
    {
      slug: "vop",
      version: "2026-10-25",
      title: "Obchodní podmínky",
      body: "Šablona obchodních podmínek. Před ostrým provozem ji musí schválit právník a doplnit totožnost prodávajícího.",
    },
    {
      slug: "gdpr",
      version: "2026-10-25",
      title: "Zásady zpracování osobních údajů",
      body: "Šablona informace podle čl. 13 a 14 GDPR. Doplňte správce, zpracovatele, lhůty a kontakty.",
    },
    {
      slug: "reklamace",
      version: "2026-10-25",
      title: "Reklamační řád",
      body: "Šablona reklamačního řádu pro zboží, včetně práv z vadného plnění.",
    },
  ];

  for (const doc of legal) {
    await prisma.legalDocument.upsert({
      where: { slug: doc.slug },
      update: doc,
      create: doc,
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
