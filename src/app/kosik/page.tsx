import { setCartQuantity } from "@/app/actions";
import { readCart } from "@/lib/cart";
import { getLocale, t } from "@/lib/i18n";
import { formatCzk, SHIPPING_HALERE } from "@/lib/merchant";
import { formatName } from "@/lib/product-format";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";

export function generateMetadata(): Metadata {
  return { title: t().cart.title };
}

export default async function CartPage() {
  const locale = getLocale();
  const copy = t();
  const cart = readCart();
  const products = await prisma.product.findMany({
    where: { id: { in: cart.map((line) => line.productId) } },
  });
  const rows = cart
    .map((line) => {
      const product = products.find((item) => item.id === line.productId);
      if (!product) return null;
      return { ...line, product };
    })
    .filter(Boolean);
  const subtotal = rows.reduce(
    (sum, row) => sum + row!.product.priceHalere * row!.quantity,
    0,
  );

  return (
    <section className="hero">
      <h1>{copy.cart.title}</h1>
      {rows.length === 0 ? (
        <p>{copy.cart.empty}</p>
      ) : (
        <>
          {rows.map((row) => (
            <article className="panel cart-line" key={row!.productId} style={{ marginBottom: 12 }}>
              {row!.product.image ? (
                <img src={row!.product.image} alt="" />
              ) : null}
              <div>
              <strong>
                {row!.product.artist} — {row!.product.title}
              </strong>
              <p className="muted">{formatName(row!.product.format, copy)}</p>
              <p>
                {row!.quantity} × {formatCzk(row!.product.priceHalere, locale)}
              </p>
              <form action={setCartQuantity.bind(null, row!.productId, 0)}>
                <button className="secondary" type="submit">
                  {copy.cart.remove}
                </button>
              </form>
              </div>
            </article>
          ))}
          <p>
            {copy.cart.goods}: {formatCzk(subtotal, locale)}
          </p>
          <p className="muted">
            {copy.cart.shippingNote} {formatCzk(SHIPPING_HALERE, locale)}.
          </p>
          <Link className="button" href="/objednavka">
            {copy.cart.checkout}
          </Link>
        </>
      )}
    </section>
  );
}
