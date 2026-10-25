import { merchant } from "@/lib/merchant";
import Link from "next/link";

export function Footer() {
  const shop = merchant();
  return (
    <footer className="site-footer">
      <div className="wrap" style={{ display: "grid", gap: 12 }}>
        <strong>{shop.name}</strong>
        <span>
          {shop.legalForm}, IČO {shop.ico}, {shop.street}, {shop.zip} {shop.city}
        </span>
        <nav className="nav-links">
          <Link href="/pravni/obchodni-podminky">Obchodní podmínky</Link>
          <Link href="/pravni/osobni-udaje">Osobní údaje</Link>
          <Link href="/pravni/cookies">Cookies</Link>
          <Link href="/pravni/reklamace">Reklamace</Link>
          <Link href="/pravni/odstoupeni">Odstoupení od smlouvy</Link>
          <Link href="/kontakt">Kontakt</Link>
        </nav>
        <p>
          Dozorový orgán: {shop.supervisory}. Texty právních stránek jsou provozní
          šablona, ne právní posudek.
        </p>
      </div>
    </footer>
  );
}
