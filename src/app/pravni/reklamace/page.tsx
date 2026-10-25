import { interpolate, t } from "@/lib/i18n";
import { merchant } from "@/lib/merchant";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: t().claims.title };
}

export default function ClaimsPage() {
  const shop = merchant();
  const copy = t();
  return (
    <article className="legal">
      <h1>{copy.claims.title}</h1>
      <p>{interpolate(copy.claims.lead, { email: shop.email })}</p>
      <p>{copy.claims.process}</p>
    </article>
  );
}
