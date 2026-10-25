import { t } from "@/lib/i18n";
import { merchant } from "@/lib/merchant";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: t().privacy.title };
}

export default function PrivacyPage() {
  const shop = merchant();
  const copy = t();
  return (
    <article className="legal">
      <h1>{copy.privacy.title}</h1>
      <p>{copy.privacy.intro}</p>
      <h2>{copy.privacy.controller}</h2>
      <p>
        {shop.legalName} ({shop.name}), {shop.street}, {shop.zip} {shop.city}, {shop.email}.
      </p>
      <h2>{copy.privacy.purposes}</h2>
      <ul>
        <li>{copy.privacy.purposeContract}</li>
        <li>{copy.privacy.purposeAccount}</li>
        <li>{copy.privacy.purposeMarketing}</li>
        <li>{copy.privacy.purposeCookies}</li>
      </ul>
      <h2>{copy.privacy.data}</h2>
      <p>{copy.privacy.dataText}</p>
      <h2>{copy.privacy.recipients}</h2>
      <p>{copy.privacy.recipientsText}</p>
      <h2>{copy.privacy.retention}</h2>
      <p>{copy.privacy.retentionText}</p>
      <h2>{copy.privacy.rights}</h2>
      <p>{copy.privacy.rightsText}</p>
    </article>
  );
}
