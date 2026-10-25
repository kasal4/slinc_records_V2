import { interpolate, t } from "@/lib/i18n";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: t().withdrawalDone.title };
}

export default function WithdrawalDonePage({
  searchParams,
}: {
  searchParams: { objednavka?: string };
}) {
  const copy = t();
  return (
    <section className="hero">
      <div className="flash">
        {interpolate(copy.withdrawalDone.accepted, {
          number: searchParams.objednavka ?? "",
        })}
      </div>
      <p>{copy.withdrawalDone.next}</p>
    </section>
  );
}
