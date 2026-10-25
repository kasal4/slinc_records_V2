"use client";

import { saveCookiePreferences } from "@/app/actions";
import { useEffect, useState } from "react";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!document.cookie.includes("slinc_cookie_choice="));
  }, []);

  if (!open) return null;

  return (
    <div className="banner" role="dialog" aria-labelledby="cookie-title">
      <h2 id="cookie-title">Cookies</h2>
      <p>
        Nezbytné cookies (košík, přihlášení, volba souhlasu) používáme vždy.
        Analytiku a marketing zapneme jen po vašem souhlasu.
      </p>
      <form
        action={async (data) => {
          await saveCookiePreferences(data);
          setOpen(false);
        }}
      >
        <label className="check">
          <input type="checkbox" name="analytics" />
          Analytické cookies
        </label>
        <label className="check">
          <input type="checkbox" name="marketing" />
          Marketingové cookies
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="submit">Uložit volbu</button>
          <button
            type="submit"
            className="secondary"
            formAction={async () => {
              const data = new FormData();
              await saveCookiePreferences(data);
              setOpen(false);
            }}
          >
            Jen nezbytné
          </button>
        </div>
      </form>
    </div>
  );
}
