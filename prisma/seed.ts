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

  const cassettes = [
    {
      slug: "night-shift-demo",
      sku: "SR-001",
      title: "Night Shift Demo",
      artist: "Tape Room",
      year: 2024,
      label: "Slinč Records",
      condition: CassetteCondition.NEW,
      description:
        "Limitovaná kazeta, chrome páska, ručně číslovaný obal. Originální nahrávka, ne digital-only press.",
      priceHalere: 34900,
      stock: 12,
    },
    {
      slug: "suterén-live",
      sku: "SR-002",
      title: "Suterén Live",
      artist: "Kovová Rosa",
      year: 1998,
      label: "Soukromý press",
      condition: CassetteCondition.VERY_GOOD,
      description:
        "Koncertní nahrávka, obal s drobným ohybem, páska přetočená a poslechnutá. Prodáváno jako použité zboží se stavem uvedeným u inzerátu.",
      priceHalere: 18900,
      stock: 1,
    },
    {
      slug: "přívoz-ep",
      sku: "SR-003",
      title: "Přívoz EP",
      artist: "Hranice Pole",
      year: 2022,
      label: "Slinč Records",
      condition: CassetteCondition.LIKE_NEW,
      description:
        "Čtyři skladby, recyklovaný j-card, ferro páska. Zbylý výtisk z prvního nákladu.",
      priceHalere: 27900,
      stock: 7,
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
