import { getLocale, interpolate, t } from "@/lib/i18n";
import { formatCzk } from "@/lib/merchant";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/session";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderDonePage({
  params,
  searchParams,
}: {
  params: { number: string };
  searchParams: { t?: string };
}) {
  const locale = getLocale();
  const copy = t();
  const session = await auth();
  const order = await prisma.order.findUnique({
    where: { number: params.number },
    include: { items: true },
  });
  if (!order) notFound();
  const allowed =
    searchParams.t === order.accessToken ||
    session?.user.id === order.userId ||
    session?.user.role === "ADMIN";
  if (!allowed) notFound();

  return (
    <section className="hero">
      <div className="flash">
        {interpolate(copy.orderDone.accepted, { number: order.number })}
      </div>
      <h1>{copy.orderDone.thanks}</h1>
      <p>
        {copy.orderDone.total} {formatCzk(order.totalHalere, locale)}. {copy.orderDone.payment}:{" "}
        {order.paymentMethod === "COD" ? copy.orderDone.cod : copy.orderDone.bank}.
      </p>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.artist} — {item.title} ({item.quantity} {copy.orderDone.pieces})
          </li>
        ))}
      </ul>
      <p>{copy.orderDone.withdrawHint}</p>
      <Link className="button" href={`/odstoupeni?objednavka=${order.number}`}>
        {copy.orderDone.withdraw}
      </Link>
    </section>
  );
}
