import { formatCzk } from "@/lib/merchant";
import { auth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderDonePage({
  params,
  searchParams,
}: {
  params: { number: string };
  searchParams: { t?: string };
}) {
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
      <div className="flash">Objednávka {order.number} je přijatá.</div>
      <h1>Děkujeme</h1>
      <p>
        Celkem {formatCzk(order.totalHalere)}. Platba:{" "}
        {order.paymentMethod === "COD" ? "dobírka" : "převod na účet"}.
      </p>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.artist} — {item.title} ({item.quantity} ks)
          </li>
        ))}
      </ul>
      <p>
        Od smlouvy můžete odstoupit do 14 dnů. K potvrzení budete potřebovat číslo
        objednávky a e-mail.
      </p>
      <Link className="button" href={`/odstoupeni?objednavka=${order.number}`}>
        Odstoupit od smlouvy
      </Link>
    </section>
  );
}
