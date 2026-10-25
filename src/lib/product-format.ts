import type { Messages } from "@/lib/messages";

const formats = ["lp", "mc", "shirt", "lathe"] as const;

export type ProductFormat = (typeof formats)[number];

export function isProductFormat(value: string): value is ProductFormat {
  return formats.includes(value as ProductFormat);
}

export function formatName(format: string, copy: Messages) {
  return isProductFormat(format) ? copy.catalog.formats[format] : format;
}

export function availableFirst<T extends { stock: number }>(
  items: T[],
  compare: (a: T, b: T) => number = () => 0,
) {
  return [...items].sort((a, b) => {
    const availability = Number(a.stock < 1) - Number(b.stock < 1);
    return availability || compare(a, b);
  });
}
