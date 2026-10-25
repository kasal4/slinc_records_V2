import { t } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";

export function generateMetadata(): Metadata {
  return { title: t().withdrawalInfo.title };
}

export default function WithdrawalInfoPage() {
  const copy = t();
  return (
    <article className="legal">
      <h1>{copy.withdrawalInfo.title}</h1>
      <p>{copy.withdrawalInfo.p1}</p>
      <p>{copy.withdrawalInfo.p2}</p>
      <p>{copy.withdrawalInfo.p3}</p>
      <p>
        <Link className="button" href="/odstoupeni">
          {copy.withdrawalInfo.button}
        </Link>
      </p>
    </article>
  );
}
