import type { Category } from "@/data/categories";

/** Show a festival this many days before it. */
export const DAYS_BEFORE = 45;
/** Keep showing it this many days after the main date (e.g. Durga Puja runs till Dashami). */
export const DAYS_AFTER = 3;

const DAY = 86_400_000;

/** "YYYY-MM-DD" -> whole days since epoch (timezone safe). */
const dayNumber = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / DAY);
};

/** Today's date in the visitor's own timezone, as "YYYY-MM-DD". */
export function todayISO(now = new Date()) {
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}

export type Upcoming = { date: string; daysLeft: number };

/** Next festival date that hasn't finished yet. */
export function nextFestival(category: Category, today: string): Upcoming | null {
  const t = dayNumber(today);
  for (const date of category.dates ?? []) {
    const daysLeft = dayNumber(date) - t;
    if (daysLeft >= -DAYS_AFTER) return { date, daysLeft };
  }
  return null;
}

/** Festival is close enough to show under "Coming soon". */
export function inSeason(category: Category, today: string): Upcoming | null {
  const next = nextFestival(category, today);
  return next && next.daysLeft <= DAYS_BEFORE ? next : null;
}
