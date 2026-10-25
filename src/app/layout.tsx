import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { getLocale, t } from "@/lib/i18n";
import { merchant } from "@/lib/merchant";
import type { Metadata } from "next";
import "./globals.css";

export function generateMetadata(): Metadata {
  const shop = merchant();
  return {
    title: {
      default: shop.name,
      template: `%s · ${shop.name}`,
    },
    description: t().meta.description,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  return (
    <html lang={locale}>
      <body>
        <Providers>
          <Header />
          <main className="wrap">{children}</main>
          <Footer />
          <CookieBanner copy={t().cookieBanner} />
        </Providers>
      </body>
    </html>
  );
}
