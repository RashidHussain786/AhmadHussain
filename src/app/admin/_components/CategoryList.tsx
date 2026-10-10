"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/lib/content/types";
import { deleteCategory, moveCategory } from "../actions";
import { Button, Toast, useNotice } from "./ui";

/** Dashboard list: edit, reorder and delete categories. */
export function CategoryList({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const { notice, setNotice, clear } = useNotice();

  async function run(key: string, action: () => Promise<{ ok: boolean; error?: string }>, done?: string) {
    setBusy(key);
    clear();
    const result = await action();
    setBusy(null);
    if (!result.ok) return setNotice({ type: "error", text: result.error ?? "Something went wrong." });
    if (done) setNotice({ type: "success", text: done });
    router.refresh();
  }

  return (
    <>
      <ul className="mt-6 space-y-3">
        {categories.map((c, i) => {
          const label = c.name.en || c.name.hi;
          return (
            <li key={c.slug} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
              <Link href={`/admin/category/${c.slug}`} className="flex min-w-0 flex-1 items-center gap-3">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-soft">
                  {c.image.src && <Image src={c.image.src} alt="" fill sizes="64px" className="object-cover" />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-bold text-ink">
                    {c.icon} {label}
                  </span>
                  <span className="block truncate text-sm text-muted">
                    {c.name.hi && c.name.en ? `${c.name.hi} · ` : ""}
                    {c.items.length} items
                  </span>
                </span>
              </Link>
              <div className="flex shrink-0 items-center">
                <Button
                  variant="ghost"
                  aria-label={`Move ${label} up`}
                  disabled={i === 0 || busy !== null}
                  loading={busy === `${c.slug}-up`}
                  onClick={() => run(`${c.slug}-up`, () => moveCategory(c.slug, -1))}
                >
                  {busy === `${c.slug}-up` ? "" : "↑"}
                </Button>
                <Button
                  variant="ghost"
                  aria-label={`Move ${label} down`}
                  disabled={i === categories.length - 1 || busy !== null}
                  loading={busy === `${c.slug}-down`}
                  onClick={() => run(`${c.slug}-down`, () => moveCategory(c.slug, 1))}
                >
                  {busy === `${c.slug}-down` ? "" : "↓"}
                </Button>
                <Link
                  href={`/admin/category/${c.slug}`}
                  className="hidden rounded-lg border border-line px-3 py-2 text-sm font-bold text-ink hover:border-brand-200 hover:text-brand-700 sm:block"
                >
                  Edit
                </Link>
                <Button
                  variant="ghost"
                  className="hover:text-red-700"
                  aria-label={`Delete ${label}`}
                  disabled={busy !== null}
                  loading={busy === `${c.slug}-del`}
                  onClick={() => {
                    if (window.confirm(`Delete the category "${label}" and all its items? This cannot be undone.`))
                      run(`${c.slug}-del`, () => deleteCategory(c.slug), "Category deleted ✓");
                  }}
                >
                  {busy === `${c.slug}-del` ? "" : "🗑"}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
      <Toast notice={notice} onClose={clear} />
    </>
  );
}
