import { CONDITION_LABEL, formatCzk } from "@/lib/merchant";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Katalog" };

export default async function CatalogPage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { artist: "asc" },
  });

  return (
    <section className="hero">
      <h1>Katalog kazet</h1>
      <div className="grid">
        {products.map((product) => (
          <article className="card" key={product.id}>
            <p className="muted">{product.sku}</p>
            <h2>
              <Link href={`/kazeta/${product.slug}`}>
                {product.artist} — {product.title}
              </Link>
            </h2>
            <p>
              Stav: {CONDITION_LABEL[product.condition]} · skladem {product.stock} ks
            </p>
            <p className="price">{formatCzk(product.priceHalere)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
