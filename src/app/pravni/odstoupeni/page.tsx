import Link from "next/link";

export const metadata = { title: "Informace o odstoupení" };

export default function WithdrawalInfoPage() {
  return (
    <article className="legal">
      <h1>Informace o právu odstoupit od smlouvy</h1>
      <p>
        Jste-li spotřebitel, můžete od smlouvy uzavřené na dálku odstoupit do 14
        dnů od převzetí posledního kusu zboží, bez uvedení důvodu.
      </p>
      <p>
        Odstoupení zašlete e-mailem nebo přes tlačítko. Po odstoupení zboží zašlete
        bez zbytečného odkladu, nejpozději do 14 dnů.
      </p>
      <p>
        Přímé náklady na vrácení zboží nesete vy, pokud nebylo dohodnuto jinak.
        Výjimky (například zboží zhotovené na přání) se u běžných kazet z katalogu
        zpravidla neuplatní.
      </p>
      <p>
        <Link className="button" href="/odstoupeni">
          Odstoupit od smlouvy
        </Link>
      </p>
    </article>
  );
}
