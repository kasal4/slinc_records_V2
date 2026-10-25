import { cookies } from "next/headers";

export type CartLine = { productId: string; quantity: number };

const COOKIE = "slinc_cart";

export function readCart(): CartLine[] {
  const raw = cookies().get(COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartLine[];
    return parsed.filter((line) => line.productId && line.quantity > 0);
  } catch {
    return [];
  }
}

export function writeCart(lines: CartLine[]) {
  cookies().set(COOKIE, JSON.stringify(lines), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
    secure: process.env.NODE_ENV === "production",
  });
}
