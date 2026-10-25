import { addToCart } from "@/app/actions";
import { CONDITION_LABEL, formatCzk, SHIPPING_HALERE } from "@/lib/merchant";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product || !product.published) notFound();

  return (
    <section className="hero">
      <p className="muted">{product.artist}</p>
      <h1>{product.title}</h1>
      <p>
        {product.year ?? "rok neuveden"} · {product.label} · stav{" "}
        {CONDITION_LABEL[product.condition]}
      </p>
      <p>{product.description}</p>
      <p className="price">{formatCzk(product.priceHalere)} včetně DPH</p>
      <p className="muted">
        Doprava od {formatCzk(SHIPPING_HALERE)}. Právo odstoupit od smlouvy do 14
        dnů od převzetí.
      </p>
      <form action={addToCart.bind(null, product.id)}>
        <button type="submit" disabled={product.stock < 1}>
          {product.stock < 1 ? "Vyprodáno" : "Do košíku"}
        </button>
      </form>
    </section>
  );
}
