import { placeOrder } from "@/app/actions";
import { readCart } from "@/lib/cart";
import { COD_SURCHARGE_HALERE, formatCzk, SHIPPING_HALERE } from "@/lib/merchant";
import { auth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = { title: "Objednávka" };

export default async function CheckoutPage() {
  const cart = readCart();
  if (cart.length === 0) redirect("/kosik");
  const session = await auth();
  const user = session?.user.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;
  const products = await prisma.product.findMany({
    where: { id: { in: cart.map((line) => line.productId) } },
  });
  const subtotal = cart.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId);
    return sum + (product?.priceHalere ?? 0) * line.quantity;
  }, 0);

  return (
    <section className="hero">
      <h1>Objednávka s povinností platby</h1>
      <p>
        Zboží {formatCzk(subtotal)}. Česká pošta / balík od {formatCzk(SHIPPING_HALERE)}.
        Dobírka + {formatCzk(COD_SURCHARGE_HALERE)}.
      </p>
      <form action={placeOrder} className="panel">
        <label>
          Jméno a příjmení
          <input name="name" required defaultValue={user?.name ?? ""} />
        </label>
        <label>
          E-mail
          <input
            name="email"
            type="email"
            required
            defaultValue={user?.email ?? session?.user.email ?? ""}
          />
        </label>
        <label>
          Telefon
          <input name="phone" required defaultValue={user?.phone ?? ""} />
        </label>
        <label>
          Ulice a č. p.
          <input name="street" required />
        </label>
        <label>
          Město
          <input name="city" required />
        </label>
        <label>
          PSČ
          <input name="zip" required />
        </label>
        <label>
          Platba
          <select name="paymentMethod" defaultValue="BANK_TRANSFER">
            <option value="BANK_TRANSFER">Převod na účet (zatím bez platební brány)</option>
            <option value="COD">Dobírka</option>
          </select>
        </label>
        <label>
          Poznámka
          <textarea name="note" rows={3} />
        </label>
        <label className="check">
          <input type="checkbox" name="terms" required />
          Četl(a) jsem a souhlasím s{" "}
          <a href="/pravni/obchodni-podminky">obchodními podmínkami</a>.
        </label>
        <label className="check">
          <input type="checkbox" name="withdrawalInfo" required />
          Byl(a) jsem informován(a) o právu odstoupit od smlouvy do 14 dnů.
        </label>
        <label className="check">
          <input type="checkbox" name="marketing" />
          Chci občas e-mail o nových kazetách (volitelné, lze kdykoli odvolat).
        </label>
        <button type="submit">Odeslat objednávku s povinností platby</button>
      </form>
    </section>
  );
}
