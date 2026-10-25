import { createProduct } from "@/app/actions";
import { formatCzk } from "@/lib/merchant";
import { auth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = { title: "Správa" };

export default async function AdminPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/prihlaseni");
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <section className="hero">
      <h1>Správa skladu</h1>
      <form action={createProduct} className="panel">
        <label>
          Název
          <input name="title" required />
        </label>
        <label>
          Interpret
          <input name="artist" required />
        </label>
        <label>
          Slug
          <input name="slug" required placeholder="night-shift-demo" />
        </label>
        <label>
          SKU
          <input name="sku" required />
        </label>
        <label>
          Rok
          <input name="year" type="number" />
        </label>
        <label>
          Label
          <input name="label" defaultValue="Slinč Records" />
        </label>
        <label>
          Cena v Kč
          <input name="priceCzk" type="number" step="0.01" required />
        </label>
        <label>
          Sklad
          <input name="stock" type="number" defaultValue={1} />
        </label>
        <label>
          Popis
          <textarea name="description" rows={4} required />
        </label>
        <button type="submit">Přidat kazetu</button>
      </form>
      <h2>Sklad</h2>
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Kazeta</th>
            <th>Cena</th>
            <th>Ks</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.sku}</td>
              <td>
                {product.artist} — {product.title}
              </td>
              <td>{formatCzk(product.priceHalere)}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Objednávky</h2>
      <table>
        <thead>
          <tr>
            <th>Číslo</th>
            <th>Stav</th>
            <th>Částka</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.number}</td>
              <td>{order.status}</td>
              <td>{formatCzk(order.totalHalere)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
