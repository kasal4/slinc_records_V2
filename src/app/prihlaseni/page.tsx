"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
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
    if (result?.error) setError("Neplatný e-mail nebo heslo.");
    else window.location.href = result?.url ?? "/ucet";
  }

  return (
    <section className="hero">
      <h1>Přihlášení</h1>
      {params.get("registrovano") ? (
        <p className="flash">Účet je založený, teď se přihlaste.</p>
      ) : null}
      <form onSubmit={onSubmit} className="panel">
        <label>
          E-mail
          <input name="email" type="email" required />
        </label>
        <label>
          Heslo
          <input name="password" type="password" required />
        </label>
        {error ? <p>{error}</p> : null}
        <button type="submit">Přihlásit</button>
      </form>
      <p>
        <Link href="/registrace">Nemám účet</Link>
      </p>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
