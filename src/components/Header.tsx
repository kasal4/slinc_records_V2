import { auth } from "@/lib/session";
import { merchant } from "@/lib/merchant";
import Link from "next/link";

export async function Header() {
  const session = await auth();
  const shop = merchant();
  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link href="/" className="brand">
          {shop.name}
        </Link>
        <nav className="nav-links">
          <Link href="/katalog">Katalog</Link>
          <Link href="/kosik">Košík</Link>
          <Link href="/odstoupeni">Odstoupit od smlouvy</Link>
          {session?.user ? (
            <>
              <Link href="/ucet">Účet</Link>
              {session.user.role === "ADMIN" ? <Link href="/admin">Správa</Link> : null}
            </>
          ) : (
            <Link href="/prihlaseni">Přihlášení</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
