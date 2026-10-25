"use client";

import { signOut } from "next-auth/react";

export function SignOutButton({ label }: { label: string }) {
  return (
    <button className="secondary" type="button" onClick={() => signOut({ callbackUrl: "/" })}>
      {label}
    </button>
  );
}
