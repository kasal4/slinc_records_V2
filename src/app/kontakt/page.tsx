import { getLocale, t } from "@/lib/i18n";
import { merchant } from "@/lib/merchant";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: t().contact.title };
}

export default function ContactPage() {
  const locale = getLocale();
  const shop = merchant();
  const copy = t();
  const country =
    locale === "en" && shop.country === "Česká republika" ? "Czech Republic" : shop.country;
  return (
    <article className="legal">
      <h1>{copy.contact.title}</h1>
      <p>
        {shop.legalName}
        <br />
        {shop.name}
      </p>
      <p>
        {shop.legalForm}, {copy.contact.ico} {shop.ico}, {copy.contact.dic} {shop.dic}
      </p>
      <p>
        {shop.street}, {shop.zip} {shop.city}, {country}
      </p>
      <p>
        {copy.contact.email}: {shop.email}
        <br />
        {copy.contact.phone}: {shop.phone}
      </p>
      <p>
        {copy.contact.supervisory}: {shop.supervisory}
      </p>
    </article>
  );
}
