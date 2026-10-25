"use client";

import { saveCookiePreferences } from "@/app/actions";
import type { Messages } from "@/lib/messages";
import { useEffect, useState } from "react";

export function CookieBanner({ copy }: { copy: Messages["cookieBanner"] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!document.cookie.includes("slinc_cookie_choice="));
  }, []);

  if (!open) return null;

  return (
    <div className="banner" role="dialog" aria-labelledby="cookie-title">
      <h2 id="cookie-title">{copy.title}</h2>
      <p>{copy.text}</p>
      <form
        action={async (data) => {
          await saveCookiePreferences(data);
          setOpen(false);
        }}
      >
        <label className="check">
          <input type="checkbox" name="analytics" />
          {copy.analytics}
        </label>
        <label className="check">
          <input type="checkbox" name="marketing" />
          {copy.marketing}
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="submit">{copy.save}</button>
          <button
            type="submit"
            className="secondary"
            formAction={async () => {
              const data = new FormData();
              await saveCookiePreferences(data);
              setOpen(false);
            }}
          >
            {copy.necessary}
          </button>
        </div>
      </form>
    </div>
  );
}
