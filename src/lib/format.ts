export function formatINR(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function discountPercent(
  price: number | string | null | undefined,
  mrp: number | string | null | undefined,
) {
  const p = Number(price ?? 0);
  const m = Number(mrp ?? 0);
  if (!m || m <= p) return 0;
  return Math.round(((m - p) / m) * 100);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
