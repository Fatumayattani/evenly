export function formatMoney(minor: number, compact = false): string {
  const amount = minor / 100;
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "short" }).format(new Date(date));
}

export function daysUntil(date: string): number {
  const now = new Date("2026-07-10T00:00:00+03:00");
  const target = new Date(`${date}T00:00:00+03:00`);
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86_400_000));
}

export function shortAddress(value: string): string {
  if (value.length < 12) return value;
  return `${value.slice(0, 5)}…${value.slice(-4)}`;
}
