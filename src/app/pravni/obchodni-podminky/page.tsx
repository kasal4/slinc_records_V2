import { t } from "@/lib/i18n";
import { merchant } from "@/lib/merchant";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: t().terms.title };
}

export default function TermsPage() {
  const shop = merchant();
  const copy = t();
  return (
    <article className="legal">
      <h1>{copy.terms.title}</h1>
      <p>{copy.terms.intro}</p>
      <h2>{copy.terms.seller}</h2>
      <p>
        {shop.legalName} ({shop.name}), {shop.legalForm}, {copy.terms.ico} {shop.ico},{" "}
        {copy.terms.dic} {shop.dic}, {copy.terms.seat} {shop.street}, {shop.zip} {shop.city},{" "}
        {copy.terms.email} {shop.email}, {copy.terms.phone} {shop.phone}.
      </p>
      <h2>{copy.terms.goods}</h2>
      <p>{copy.terms.goodsText}</p>
      <h2>{copy.terms.contract}</h2>
      <p>{copy.terms.contractText}</p>
      <h2>{copy.terms.shipping}</h2>
      <p>{copy.terms.shippingText}</p>
      <h2>{copy.terms.withdraw}</h2>
      <p>{copy.terms.withdrawText}</p>
      <h2>{copy.terms.defects}</h2>
      <p>{copy.terms.defectsText}</p>
      <h2>{copy.terms.disputes}</h2>
      <p>
        {copy.terms.disputesLead} <a href="https://www.coi.cz">coi.cz</a>. {copy.terms.disputesRest}
      </p>
    </article>
  );
}
