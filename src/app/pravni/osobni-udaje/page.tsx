import { merchant } from "@/lib/merchant";

export const metadata = { title: "Osobní údaje" };

export default function PrivacyPage() {
  const shop = merchant();
  return (
    <article className="legal">
      <h1>Zásady zpracování osobních údajů</h1>
      <p>
        Informace podle čl. 13 a 14 GDPR. Toto je provozní šablona, ne právní
        posudek.
      </p>
      <h2>Správce</h2>
      <p>
        {shop.name}, {shop.street}, {shop.zip} {shop.city}, {shop.email}.
      </p>
      <h2>Účely a základy</h2>
      <ul>
        <li>plnění smlouvy a účetnictví (čl. 6 odst. 1 písm. b a c GDPR)</li>
        <li>provoz účtu a košíku (smlouva / oprávněný zájem)</li>
        <li>marketing jen se souhlasem (čl. 6 odst. 1 písm. a)</li>
        <li>analytické a marketingové cookies jen se souhlasem</li>
      </ul>
      <h2>Jaké údaje</h2>
      <p>
        Jméno, e-mail, telefon, adresa, obsah objednávky, souhlasy, stav skladu
        objednávek. Čísla karet se neukládají.
      </p>
      <h2>Příjemci</h2>
      <p>
        Dopravce, účetní, případně platební brána a hosting. S každým musí být
        smlouva o zpracování.
      </p>
      <h2>Lhůty</h2>
      <p>
        Účet do výmazu. Marketing do odvolání souhlasu. Objednávky 10 let kvůli
        daňové evidenci, potom anonymizace.
      </p>
      <h2>Práva</h2>
      <p>
        Přístup, oprava, omezení, námitka, přenositelnost, odvolání souhlasu a
        stížnost u ÚOOÚ. Export a anonymizace účtu jsou v sekci Účet.
      </p>
    </article>
  );
}
