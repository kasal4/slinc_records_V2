import { merchant } from "@/lib/merchant";

export const metadata = { title: "Reklamační řád" };

export default function ClaimsPage() {
  const shop = merchant();
  return (
    <article className="legal">
      <h1>Reklamační řád</h1>
      <p>
        Práva z vadného plnění se uplatňují na {shop.email}. U použité kazety je
        rozhodný stav popsaný u zboží. Zákonná práva spotřebitele nelze vyloučit.
      </p>
      <p>
        Reklamaci vyřídíme bez zbytečného odkladu, nejpozději ve lhůtě podle
        zákona. Zboží zašlete na adresu sídla s číslem objednávky.
      </p>
    </article>
  );
}
