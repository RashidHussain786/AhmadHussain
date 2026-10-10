import type { Category } from "@/lib/content/types";

/** Starting values for the "New category" form. */
export function emptyCategory(): Category {
  const empty = () => ({ en: "", hi: "" });
  return {
    slug: "",
    icon: "🛍️",
    name: empty(),
    description: empty(),
    season: empty(),
    buyers: [],
    image: { src: "", alt: empty() },
    items: [],
  };
}
