import { CONDITION_LABEL, formatCzk } from "@/lib/merchant";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <>
      <section className="hero">
        <p className="muted">kazety · malý náklad · stav uveden u každé pásky</p>
        <h1>Slinč Records</h1>
        <p>
          Obchod s kazetami. Ceny včetně DPH, doprava a 14denní odstoupení od
          smlouvy jsou vidět před odesláním objednávky.
        </p>
        <Link className="button" href="/katalog">
          Otevřít katalog
        </Link>
      </section>
      <section className="grid">
        {products.map((product) => (
          <article className="card" key={product.id}>
            <p className="muted">{product.artist}</p>
            <h2>
              <Link href={`/kazeta/${product.slug}`}>{product.title}</Link>
            </h2>
            <p>
              {product.year ?? "rok neuveden"} · {CONDITION_LABEL[product.condition]}
            </p>
            <p className="price">{formatCzk(product.priceHalere)}</p>
          </article>
        ))}
      </section>
    </>
  );
}
