import { registerUser } from "@/app/actions";
import { t } from "@/lib/i18n";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: t().register.title };
}

export default function RegisterPage() {
  const copy = t();
  return (
    <section className="hero">
      <h1>{copy.register.title}</h1>
      <p className="muted">{copy.register.hint}</p>
      <form action={registerUser} className="panel">
        <label>
          {copy.register.name}
          <input name="name" required minLength={2} />
        </label>
        <label>
          {copy.register.email}
          <input name="email" type="email" required />
        </label>
        <label>
          {copy.register.password}
          <input name="password" type="password" required minLength={10} />
        </label>
        <label className="check">
          <input type="checkbox" name="marketing" />
          {copy.register.marketing}
        </label>
        <button type="submit">{copy.register.submit}</button>
      </form>
    </section>
  );
}
