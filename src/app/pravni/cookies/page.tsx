import { t } from "@/lib/i18n";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: t().cookies.title };
}

export default function CookiesPage() {
  const copy = t();
  return (
    <article className="legal">
      <h1>{copy.cookies.title}</h1>
      <p>{copy.cookies.lead}</p>
      <table>
        <thead>
          <tr>
            <th>{copy.cookies.cookie}</th>
            <th>{copy.cookies.purpose}</th>
            <th>{copy.cookies.basis}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>slinc_cart</td>
            <td>{copy.cookies.cart}</td>
            <td>{copy.cookies.necessary}</td>
          </tr>
          <tr>
            <td>slinc_vid</td>
            <td>{copy.cookies.choice}</td>
            <td>{copy.cookies.necessary}</td>
          </tr>
          <tr>
            <td>slinc_locale</td>
            <td>{copy.cookies.locale}</td>
            <td>{copy.cookies.necessary}</td>
          </tr>
          <tr>
            <td>next-auth.*</td>
            <td>{copy.cookies.session}</td>
            <td>{copy.cookies.necessary}</td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
