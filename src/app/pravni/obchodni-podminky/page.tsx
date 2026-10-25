import { merchant } from "@/lib/merchant";

export const metadata = { title: "Obchodní podmínky" };

export default function TermsPage() {
  const shop = merchant();
  return (
    <article className="legal">
      <h1>Obchodní podmínky</h1>
      <p>
        Šablona podle distančního prodeje. Před spuštěním ji musí zkontrolovat
        právník a doplnit vaše identifikační údaje.
      </p>
      <h2>Prodávající</h2>
      <p>
        {shop.name}, {shop.legalForm}, IČO {shop.ico}, sídlo {shop.street},{" "}
        {shop.zip} {shop.city}, e-mail {shop.email}, telefon {shop.phone}.
      </p>
      <h2>Zboží a ceny</h2>
      <p>
        Předmětem prodeje jsou audiokazety. Ceny jsou v CZK a včetně DPH, pokud
        jste plátce. Stav použité kazety je uveden u inzerátu.
      </p>
      <h2>Objednávka a smlouva</h2>
      <p>
        Návrh smlouvy odesíláte tlačítkem „Odeslat objednávku s povinností platby“.
        Smlouva vzniká potvrzením objednávky.
      </p>
      <h2>Doprava a platba</h2>
      <p>
        Dodání v ČR. Platba převodem nebo na dobírku. Platební údaje karty obchod
        neukládá.
      </p>
      <h2>Odstoupení</h2>
      <p>
        Spotřebitel může odstoupit do 14 dnů od převzetí. Formulář a tlačítko jsou
        na stránce Odstoupení od smlouvy.
      </p>
      <h2>Práva z vad</h2>
      <p>Reklamace se řídí reklamačním řádem a občanským zákoníkem.</p>
      <h2>Mimosoudní řešení sporů</h2>
      <p>
        Česká obchodní inspekce, <a href="https://www.coi.cz">coi.cz</a>. Platforma
        ODR už pro nové spory neběží; spotřebitel se obrací na ČOI.
      </p>
    </article>
  );
}
