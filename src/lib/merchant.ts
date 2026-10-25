export const LEGAL_VERSIONS = {
  terms: "2026-10-25",
  privacy: "2026-10-25",
  cookies: "2026-10-25",
};

export const ACCOUNTING_RETENTION_YEARS = 10;

export function merchant() {
  return {
    name: process.env.MERCHANT_NAME ?? "Šlinc Records",
    legalName: process.env.MERCHANT_LEGAL_NAME ?? "Jan Kasal",
    legalForm: process.env.MERCHANT_LEGAL_FORM ?? "OSVČ",
    ico: process.env.MERCHANT_ICO || "doplňte IČO",
    dic: process.env.MERCHANT_DIC || "není plátce DPH / doplňte DIČ",
    street: process.env.MERCHANT_STREET || "doplňte ulici",
    city: process.env.MERCHANT_CITY || "doplňte město",
    zip: process.env.MERCHANT_ZIP || "doplňte PSČ",
    country: process.env.MERCHANT_COUNTRY ?? "Česká republika",
    email: process.env.MERCHANT_EMAIL ?? "obchod@slinc-records.local",
    phone: process.env.MERCHANT_PHONE || "doplňte telefon",
    supervisory:
      process.env.MERCHANT_SUPERVISORY ??
      "Česká obchodní inspekce, Štěpánská 567/15, 120 00 Praha 2",
  };
}

export function formatCzk(halere: number, locale: "cs" | "en" = "cs") {
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "cs-CZ", {
    style: "currency",
    currency: "CZK",
  }).format(halere / 100);
}

export const SHIPPING_HALERE = 8900;
export const COD_SURCHARGE_HALERE = 3900;
