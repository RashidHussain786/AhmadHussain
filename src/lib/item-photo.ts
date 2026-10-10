import { existsSync } from "node:fs";
import path from "node:path";
import type { Item } from "@/data/categories";

const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const ITEMS_DIR = path.join(process.cwd(), "public", "photos", "items");

/**
 * Photo for an item: public/photos/items/<id>.jpg (or .jpeg/.png/.webp).
 * Returns null when there is no file → the page shows a placeholder.
 */
export function itemPhoto(item: Item): string | null {
  for (const ext of EXTENSIONS) {
    if (existsSync(path.join(ITEMS_DIR, `${item.id}.${ext}`))) return `/photos/items/${item.id}.${ext}`;
  }
  return null;
}
