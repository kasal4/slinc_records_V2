import { createProduct } from "@/app/actions";
import { getLocale, t } from "@/lib/i18n";
import { formatCzk } from "@/lib/merchant";
import { formatName } from "@/lib/product-format";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/session";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export function generateMetadata(): Metadata {
  return { title: t().admin.title };
}

export default async function AdminPage() {
  const locale = getLocale();
  const copy = t();
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/prihlaseni");
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <section className="hero">
      <h1>{copy.admin.title}</h1>
      <form action={createProduct} className="panel">
        <label>
          {copy.admin.name}
          <input name="title" required />
        </label>
        <label>
          {copy.admin.artist}
          <input name="artist" required />
        </label>
        <label>
          {copy.admin.slug}
          <input name="slug" required placeholder="night-shift-demo" />
        </label>
        <label>
          {copy.admin.format}
          <select name="format" defaultValue="mc">
            <option value="lp">{copy.catalog.formats.lp}</option>
            <option value="mc">{copy.catalog.formats.mc}</option>
            <option value="shirt">{copy.catalog.formats.shirt}</option>
            <option value="lathe">{copy.catalog.formats.lathe}</option>
          </select>
        </label>
        <label>
          {copy.admin.year}
          <input name="year" type="number" />
        </label>
        <label>
          {copy.admin.label}
          <input name="label" defaultValue="Šlinc Records" />
        </label>
        <label>
          {copy.admin.price}
          <input name="priceCzk" type="number" step="0.01" required />
        </label>
        <label>
          {copy.admin.stock}
          <input name="stock" type="number" defaultValue={1} />
        </label>
        <label>
          {copy.admin.description}
          <textarea name="description" rows={4} required />
        </label>
        <button type="submit">{copy.admin.add}</button>
      </form>
      <h2>{copy.admin.inventory}</h2>
      <table>
        <thead>
          <tr>
            <th>{copy.admin.format}</th>
            <th>{copy.admin.cassette}</th>
            <th>{copy.admin.priceCol}</th>
            <th>{copy.admin.qty}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{formatName(product.format, copy)}</td>
              <td>
                {product.artist} — {product.title}
              </td>
              <td>{formatCzk(product.priceHalere, locale)}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>{copy.admin.orders}</h2>
      <table>
        <thead>
          <tr>
            <th>{copy.admin.number}</th>
            <th>{copy.admin.status}</th>
            <th>{copy.admin.amount}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.number}</td>
              <td>{order.status}</td>
              <td>{formatCzk(order.totalHalere, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
