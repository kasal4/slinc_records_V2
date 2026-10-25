import { ReleaseGrid } from "@/components/ReleaseGrid";
import { t } from "@/lib/i18n";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: t().releasesPage.title };
}

export default function ReleasesPage() {
  const copy = t().releasesPage;

  return (
    <section className="hero">
      <h1>{copy.title}</h1>
      <p className="muted">{copy.lead}</p>
      <ReleaseGrid />
    </section>
  );
}
