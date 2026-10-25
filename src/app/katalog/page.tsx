import { getLocale, t } from "@/lib/i18n";
import { formatCzk } from "@/lib/merchant";
import { availableFirst, formatName } from "@/lib/product-format";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";

export function generateMetadata(): Metadata {
  return { title: t().catalog.title };
}

export default async function CatalogPage() {
  const locale = getLocale();
  const copy = t();
  const products = availableFirst(
    await prisma.product.findMany({ where: { published: true } }),
    (a, b) => a.artist.localeCompare(b.artist, "cs"),
  );

  return (
    <section className="hero">
      <h1>{copy.catalog.title}</h1>
      <div className="grid">
        {products.map((product) => (
          <article className={product.stock < 1 ? "card sold-out" : "card"} key={product.id}>
            {product.image ? (
              <Link href={`/kazeta/${product.slug}`}>
                <img src={product.image} alt={`${product.artist} — ${product.title}`} />
              </Link>
            ) : null}
            <p className="muted">{formatName(product.format, copy)}</p>
            <h2>
              <Link href={`/kazeta/${product.slug}`}>
                {product.artist} — {product.title}
              </Link>
            </h2>
            <p>{product.stock < 1 ? copy.catalog.soldOut : copy.catalog.inStock}</p>
            <p className="price">{formatCzk(product.priceHalere, locale)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
