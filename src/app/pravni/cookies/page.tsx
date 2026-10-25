export const metadata = { title: "Cookies" };

export default function CookiesPage() {
  return (
    <article className="legal">
      <h1>Cookies</h1>
      <p>
        Nezbytné cookies (košík, relace, volba souhlasu) nepotřebují souhlas.
        Analytika a marketing jen po opt-in. Odmítnutí je stejně dostupné jako
        souhlas a neblokuje prohlížení katalogu.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Účel</th>
            <th>Základ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>slinc_cart</td>
            <td>obsah košíku</td>
            <td>nezbytné</td>
          </tr>
          <tr>
            <td>slinc_vid</td>
            <td>uložení volby cookies</td>
            <td>nezbytné</td>
          </tr>
          <tr>
            <td>next-auth.*</td>
            <td>přihlášení</td>
            <td>nezbytné</td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
