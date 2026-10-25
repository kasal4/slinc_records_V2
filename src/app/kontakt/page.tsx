import { merchant } from "@/lib/merchant";

export const metadata = { title: "Kontakt" };

export default function ContactPage() {
  const shop = merchant();
  return (
    <article className="legal">
      <h1>Kontakt</h1>
      <p>{shop.name}</p>
      <p>
        {shop.legalForm}, IČO {shop.ico}, {shop.dic}
      </p>
      <p>
        {shop.street}, {shop.zip} {shop.city}, {shop.country}
      </p>
      <p>
        E-mail: {shop.email}
        <br />
        Telefon: {shop.phone}
      </p>
      <p>Dozorový orgán: {shop.supervisory}</p>
    </article>
  );
}
