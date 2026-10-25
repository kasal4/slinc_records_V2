import { eraseMyAccount, setMarketingConsent } from "@/app/actions";
import { SignOutButton } from "@/components/SignOutButton";
import { formatCzk } from "@/lib/merchant";
import { auth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = { title: "Účet" };

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user.id) redirect("/prihlaseni");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { orders: { orderBy: { createdAt: "desc" }, take: 20 } },
  });
  if (!user || user.anonymizedAt) redirect("/prihlaseni");

  return (
    <section className="hero">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <SignOutButton />
      <h2>Objednávky</h2>
      {user.orders.length === 0 ? (
        <p>Zatím žádné.</p>
      ) : (
        <ul>
          {user.orders.map((order) => (
            <li key={order.id}>
              {order.number} · {formatCzk(order.totalHalere)} · {order.status}
            </li>
          ))}
        </ul>
      )}
      <h2>Osobní údaje</h2>
      <p>
        Marketingové e-maily: {user.marketingConsent ? "zapnuté" : "vypnuté"}.
      </p>
      <form action={setMarketingConsent.bind(null, !user.marketingConsent)}>
        <button className="secondary" type="submit">
          {user.marketingConsent ? "Odvolat marketing" : "Povolit marketing"}
        </button>
      </form>
      <p>
        <a className="button secondary" href="/api/gdpr/export">
          Stáhnout export údajů
        </a>
      </p>
      <form action={eraseMyAccount}>
        <button className="secondary" type="submit">
          Anonymizovat účet
        </button>
      </form>
      <p className="muted">
        Objednávky zůstanou v účetnictví do konce zákonné lhůty. Přihlašovací údaje
        a marketing se smažou.
      </p>
      <p>
        <Link href="/odstoupeni">Odstoupit od smlouvy</Link>
      </p>
    </section>
  );
}
