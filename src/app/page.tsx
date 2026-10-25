import { releaseFormatLabel } from "@/components/ReleaseGrid";
import { RotatingTile, type HomeSlide } from "@/components/RotatingTile";
import { getLocale, t } from "@/lib/i18n";
import { formatCzk, merchant } from "@/lib/merchant";
import { formatName } from "@/lib/product-format";
import { prisma } from "@/lib/prisma";
import { latestReleases } from "@/lib/releases";
import Link from "next/link";

export default async function HomePage() {
  const shop = merchant();
  const locale = getLocale();
  const copy = t();
  const products = await prisma.product.findMany({
    where: { published: true, stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  const releaseSlides: HomeSlide[] = latestReleases(3).map((release) => ({
    href: `/releasy#${release.slug}`,
    image: release.image,
    alt: `${release.artist} — ${release.title}`,
    kicker: releaseFormatLabel(release.format, copy.releasesPage),
    title: `${release.artist} — ${release.title}`,
    detail: "years" in release ? release.years : String(release.year),
  }));
  const productSlides: HomeSlide[] = products.map((product) => ({
    href: `/kazeta/${product.slug}`,
    image: product.image,
    alt: `${product.artist} — ${product.title}`,
    kicker: formatName(product.format, copy),
    title: `${product.artist} — ${product.title}`,
    price: formatCzk(product.priceHalere, locale),
  }));

  return (
    <>
      <section className="hero">
        <div className="mark">
          <h1 className="logo-title">
            <img src="/logo.jpg" alt={shop.name} width={1000} height={490} />
          </h1>
          <p className="roles">
            <Link href="/releasy">label</Link>
            <span className="role-line" aria-hidden="true" />
            <Link href="/katalog">distro</Link>
            <span className="role-line" aria-hidden="true" />
            <span>booking</span>
          </p>
        </div>
      </section>
      <section className="home-cols">
        <div>
          <h2>
            <Link href="/releasy">{copy.home.latestReleases}</Link>
          </h2>
          <RotatingTile slides={releaseSlides} />
        </div>
        <div>
          <h2>
            <Link href="/katalog">{copy.home.shopNews}</Link>
          </h2>
          <RotatingTile slides={productSlides} />
        </div>
      </section>
    </>
  );
}
