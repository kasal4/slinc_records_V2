import { t } from "@/lib/i18n";
import { merchant } from "@/lib/merchant";
import Link from "next/link";

export function Footer() {
  const shop = merchant();
  const copy = t().footer;
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <nav className="footer-links">
          <Link href="/pravni/obchodni-podminky">{copy.terms}</Link>
          <Link href="/pravni/osobni-udaje">{copy.privacy}</Link>
          <Link href="/pravni/cookies">{copy.cookies}</Link>
          <Link href="/pravni/reklamace">{copy.claims}</Link>
          <Link href="/pravni/odstoupeni">{copy.withdraw}</Link>
          <Link href="/kontakt">{copy.contact}</Link>
        </nav>
        <p>
          {shop.legalName}, {shop.legalForm}, {copy.ico} {shop.ico}, {shop.street}, {shop.zip}{" "}
          {shop.city}
        </p>
        <p>
          {copy.supervisory}: {shop.supervisory}. {copy.disclaimer}
        </p>
      </div>
    </footer>
  );
}
