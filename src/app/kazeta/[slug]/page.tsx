import { addToCart } from "@/app/actions";
import { getLocale, t } from "@/lib/i18n";
import { formatCzk, SHIPPING_HALERE } from "@/lib/merchant";
import { formatName } from "@/lib/product-format";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const locale = getLocale();
  const copy = t();
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product || !product.published) notFound();

  return (
    <section className={product.stock < 1 ? "hero product sold-out" : "hero product"}>
      {product.image ? (
        <img src={product.image} alt={`${product.artist} — ${product.title}`} />
      ) : null}
      <div>
      <p className="muted">{product.artist}</p>
      <h1>{product.title}</h1>
      <p>
        {formatName(product.format, copy)} · {product.year ?? copy.product.yearUnknown}
        {product.label ? ` · ${product.label}` : ""}
      </p>
      <p>{product.description}</p>
      <p className="price">
        {formatCzk(product.priceHalere, locale)} {copy.product.vatIncluded}
      </p>
      <p className="muted">
        {copy.product.shippingFrom} {formatCzk(SHIPPING_HALERE, locale)}. {copy.product.withdrawInfo}
      </p>
      <form action={addToCart.bind(null, product.id)}>
        <button type="submit" disabled={product.stock < 1}>
          {product.stock < 1 ? copy.product.soldOut : copy.product.addToCart}
        </button>
      </form>
      </div>
    </section>
  );
}
