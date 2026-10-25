"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button className="secondary" type="button" onClick={() => signOut({ callbackUrl: "/" })}>
      Odhlásit
    </button>
  );
}
