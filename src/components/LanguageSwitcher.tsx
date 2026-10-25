import { setLocale } from "@/app/actions";
import { getLocale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const locale = getLocale();
  return (
    <div className="lang-switch" role="group" aria-label={locale === "en" ? "Language" : "Jazyk"}>
      <form action={setLocale.bind(null, "cs")}>
        <button type="submit" aria-pressed={locale === "cs"}>
          CS
        </button>
      </form>
      <form action={setLocale.bind(null, "en")}>
        <button type="submit" aria-pressed={locale === "en"}>
          EN
        </button>
      </form>
    </div>
  );
}
