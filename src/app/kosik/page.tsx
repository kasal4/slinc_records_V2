import { setCartQuantity } from "@/app/actions";
import { readCart } from "@/lib/cart";
import { formatCzk, SHIPPING_HALERE } from "@/lib/merchant";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Košík" };

export default async function CartPage() {
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
      <h1>Košík</h1>
      {rows.length === 0 ? (
        <p>Košík je prázdný.</p>
      ) : (
        <>
          {rows.map((row) => (
            <article className="panel" key={row!.productId} style={{ marginBottom: 12 }}>
              <strong>
                {row!.product.artist} — {row!.product.title}
              </strong>
              <p>
                {row!.quantity} × {formatCzk(row!.product.priceHalere)}
              </p>
              <form action={setCartQuantity.bind(null, row!.productId, 0)}>
                <button className="secondary" type="submit">
                  Odebrat
                </button>
              </form>
            </article>
          ))}
          <p>Zboží: {formatCzk(subtotal)}</p>
          <p className="muted">Doprava se dopočítá v objednávce od {formatCzk(SHIPPING_HALERE)}.</p>
          <Link className="button" href="/objednavka">
            K objednávce
          </Link>
        </>
      )}
    </section>
  );
}
