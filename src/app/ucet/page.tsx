import { eraseMyAccount, setMarketingConsent } from "@/app/actions";
import { SignOutButton } from "@/components/SignOutButton";
import { getLocale, t } from "@/lib/i18n";
import { formatCzk } from "@/lib/merchant";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/session";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export function generateMetadata(): Metadata {
  return { title: t().account.title };
}

export default async function AccountPage() {
  const locale = getLocale();
  const copy = t();
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
      <SignOutButton label={copy.account.signOut} />
      <h2>{copy.account.orders}</h2>
      {user.orders.length === 0 ? (
        <p>{copy.account.noOrders}</p>
      ) : (
        <ul>
          {user.orders.map((order) => (
            <li key={order.id}>
              {order.number} · {formatCzk(order.totalHalere, locale)} · {order.status}
            </li>
          ))}
        </ul>
      )}
      <h2>{copy.account.personal}</h2>
      <p>
        {copy.account.marketingLabel}:{" "}
        {user.marketingConsent ? copy.account.marketingOn : copy.account.marketingOff}.
      </p>
      <form action={setMarketingConsent.bind(null, !user.marketingConsent)}>
        <button className="secondary" type="submit">
          {user.marketingConsent ? copy.account.revokeMarketing : copy.account.allowMarketing}
        </button>
      </form>
      <p>
        <a className="button secondary" href="/api/gdpr/export">
          {copy.account.export}
        </a>
      </p>
      <form action={eraseMyAccount}>
        <button className="secondary" type="submit">
          {copy.account.erase}
        </button>
      </form>
      <p className="muted">{copy.account.eraseHint}</p>
      <p>
        <Link href="/odstoupeni">{copy.account.withdraw}</Link>
      </p>
    </section>
  );
}
