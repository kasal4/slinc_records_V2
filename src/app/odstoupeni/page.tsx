import { confirmWithdrawal } from "@/app/actions";

export const metadata = { title: "Odstoupení od smlouvy" };

export default function WithdrawalPage({
  searchParams,
}: {
  searchParams: { objednavka?: string };
}) {
  return (
    <section className="hero">
      <h1>Odstoupit od smlouvy</h1>
      <p>
        U spotřebitelské smlouvy uzavřené na dálku můžete odstoupit do 14 dnů od
        převzetí zboží. Odesláním druhého kroku se odstoupení stává závazným.
      </p>
      <form action={confirmWithdrawal} className="panel">
        <label>
          Číslo objednávky
          <input
            name="orderNumber"
            required
            defaultValue={searchParams.objednavka ?? ""}
          />
        </label>
        <label>
          E-mail z objednávky
          <input name="email" type="email" required />
        </label>
        <label>
          Důvod (nepovinné)
          <textarea name="reason" rows={3} />
        </label>
        <label className="check">
          <input type="checkbox" name="confirm" required />
          Potvrzuji odstoupení od smlouvy
        </label>
        <button type="submit">Potvrdit odstoupení od smlouvy</button>
      </form>
    </section>
  );
}
