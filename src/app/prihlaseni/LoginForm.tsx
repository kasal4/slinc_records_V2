"use client";

import type { Messages } from "@/lib/messages";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm({ copy }: { copy: Messages["login"] }) {
  const params = useSearchParams();
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: data.get("email"),
      password: data.get("password"),
      redirect: false,
      callbackUrl: "/ucet",
    });
    if (result?.error) setError(copy.invalid);
    else window.location.href = result?.url ?? "/ucet";
  }

  return (
    <section className="hero">
      <h1>{copy.title}</h1>
      {params.get("registrovano") ? <p className="flash">{copy.registered}</p> : null}
      <form onSubmit={onSubmit} className="panel">
        <label>
          {copy.email}
          <input name="email" type="email" required />
        </label>
        <label>
          {copy.password}
          <input name="password" type="password" required />
        </label>
        {error ? <p>{error}</p> : null}
        <button type="submit">{copy.submit}</button>
      </form>
      <p>
        <Link href="/registrace">{copy.noAccount}</Link>
      </p>
    </section>
  );
}
