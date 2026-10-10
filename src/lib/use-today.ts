"use client";

import { useSyncExternalStore } from "react";
import { todayISO } from "./season";

const subscribe = () => () => {};

/**
 * Today's date ("YYYY-MM-DD") from the visitor's device.
 * Returns null during server rendering, so festival countdowns are always
 * calculated fresh in the browser — never frozen at build time.
 */
export function useToday(): string | null {
  return useSyncExternalStore(subscribe, () => todayISO(), () => null);
}
