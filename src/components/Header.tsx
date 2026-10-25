import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { t } from "@/lib/i18n";
import { merchant } from "@/lib/merchant";
import { auth } from "@/lib/session";
import Link from "next/link";

export async function Header() {
  const session = await auth();
  const shop = merchant();
  const nav = t().nav;
  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link href="/" className="brand">
          {shop.name}
        </Link>
        <div className="nav-end">
          <nav className="tabs" aria-label={nav.tabsLabel}>
            <Link href={session?.user ? "/ucet" : "/prihlaseni"}>{nav.auth}</Link>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
