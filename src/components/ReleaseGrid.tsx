import { t } from "@/lib/i18n";
import type { Messages } from "@/lib/messages";
import { latestReleases, releases } from "@/lib/releases";

export function releaseFormatLabel(
  format: (typeof releases)[number]["format"],
  copy: Messages["releasesPage"],
) {
  if (format === "lp-split") return copy.formatSplit;
  if (format === "cassette") return copy.formatCassette;
  if (format === "cassette-lathe") return copy.formatCassetteLathe;
  if (format === "seven") return copy.formatSeven;
  if (format === "lp-cassette") return copy.formatLpCassette;
  return copy.formatLp;
}

export function ReleaseGrid({ limit }: { limit?: number }) {
  const copy = t().releasesPage;
  const ordered = latestReleases(limit);

  return (
    <div className="releases">
      {ordered.map((release) => (
        <article className="release" key={release.slug} id={release.slug}>
          <img src={release.image} alt={`${release.artist} — ${release.title}`} />
          <div className="release-body">
            <p className="release-cat">{release.catalog}</p>
            <h2>
              {release.artist} — {release.title}
            </h2>
            <p className="release-meta">
              {releaseFormatLabel(release.format, copy)} · {"years" in release ? release.years : release.year}
              <br />
              {release.labels}
            </p>
            <iframe
              title={`${release.artist} — ${release.title}`}
              src={release.bandcamp}
              className="player"
              width="300"
              height="42"
            />
          </div>
        </article>
      ))}
    </div>
  );
}
