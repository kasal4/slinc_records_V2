import { registerUser } from "@/app/actions";

export const metadata = { title: "Registrace" };

export default function RegisterPage() {
  return (
    <section className="hero">
      <h1>Registrace</h1>
      <p className="muted">
        Heslo alespoň 10 znaků. Marketingový souhlas je oddělený od založení účtu.
      </p>
      <form action={registerUser} className="panel">
        <label>
          Jméno
          <input name="name" required minLength={2} />
        </label>
        <label>
          E-mail
          <input name="email" type="email" required />
        </label>
        <label>
          Heslo
          <input name="password" type="password" required minLength={10} />
        </label>
        <label className="check">
          <input type="checkbox" name="marketing" />
          Chci novinky o kazetách e-mailem
        </label>
        <button type="submit">Založit účet</button>
      </form>
    </section>
  );
}
