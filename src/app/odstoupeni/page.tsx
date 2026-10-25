import { confirmWithdrawal } from "@/app/actions";
import { t } from "@/lib/i18n";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: t().withdrawal.title };
}

export default function WithdrawalPage({
  searchParams,
}: {
  searchParams: { objednavka?: string };
}) {
  const copy = t();
  return (
    <section className="hero">
      <h1>{copy.withdrawal.title}</h1>
      <p>{copy.withdrawal.lead}</p>
      <form action={confirmWithdrawal} className="panel">
        <label>
          {copy.withdrawal.orderNumber}
          <input
            name="orderNumber"
            required
            defaultValue={searchParams.objednavka ?? ""}
          />
        </label>
        <label>
          {copy.withdrawal.email}
          <input name="email" type="email" required />
        </label>
        <label>
          {copy.withdrawal.reason}
          <textarea name="reason" rows={3} />
        </label>
        <label className="check">
          <input type="checkbox" name="confirm" required />
          {copy.withdrawal.confirm}
        </label>
        <button type="submit">{copy.withdrawal.submit}</button>
      </form>
    </section>
  );
}
