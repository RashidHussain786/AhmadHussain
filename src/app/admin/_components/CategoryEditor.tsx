"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Buyer, Category, Item } from "@/lib/content/types";
import type { Localized } from "@/lib/i18n";
import { deleteCategory, saveCategory } from "../actions";
import { ImagePicker } from "./ImagePicker";
import { Button, Field, LocalizedInput, Section, Toast, inputClass, useNotice, useUnsavedWarning } from "./ui";

const EMPTY: Localized = { en: "", hi: "" };

const newId = () => Math.random().toString(36).slice(2, 10);

export function CategoryEditor({ initial, isNew }: { initial: Category; isNew: boolean }) {
  const router = useRouter();
  const [category, setCategory] = useState<Category>(initial);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { notice, setNotice, clear } = useNotice();
  useUnsavedWarning(dirty);

  const update = (patch: Partial<Category>) => {
    setCategory((c) => ({ ...c, ...patch }));
    setDirty(true);
  };
  const showError = (text: string) => setNotice({ type: "error", text });

  // ---- items
  const setItem = (index: number, patch: Partial<Item>) =>
    update({ items: category.items.map((it, i) => (i === index ? { ...it, ...patch } : it)) });
  const moveItem = (index: number, dir: -1 | 1) => {
    const to = index + dir;
    if (to < 0 || to >= category.items.length) return;
    const items = [...category.items];
    [items[index], items[to]] = [items[to], items[index]];
    update({ items });
  };
  const removeItem = (index: number) => {
    const it = category.items[index];
    const label = it.name.en || it.name.hi || "this item";
    if (window.confirm(`Delete "${label}"?`)) update({ items: category.items.filter((_, i) => i !== index) });
  };

  // ---- buyers
  const setBuyer = (index: number, patch: Partial<Buyer>) =>
    update({ buyers: category.buyers.map((b, i) => (i === index ? { ...b, ...patch } : b)) });

  // ---- dates
  const dates = category.dates ?? [];
  const setDate = (index: number, value: string) => update({ dates: dates.map((d, i) => (i === index ? value : d)) });

  async function handleSave() {
    clear();
    if (!category.name.en.trim() && !category.name.hi.trim()) return showError("Please enter the category name.");
    const unnamed = category.items.findIndex((it) => !it.name.en.trim() && !it.name.hi.trim());
    if (unnamed >= 0) return showError(`Item ${unnamed + 1} has no name. Add a name or delete the item.`);
    if (dates.some((d) => !d)) return showError("One festival date is empty. Pick a date or remove it.");
    setSaving(true);
    const result = await saveCategory(isNew ? null : initial.slug, category);
    setSaving(false);
    if (!result.ok) return showError(result.error);
    setDirty(false);
    setNotice({ type: "success", text: "Saved ✓ The website updates in a few seconds." });
    if (isNew && result.slug) router.replace(`/admin/category/${result.slug}`);
    else router.refresh();
  }

  async function handleDelete() {
    const label = category.name.en || category.name.hi;
    if (!window.confirm(`Delete the category "${label}" and all its items? This cannot be undone.`)) return;
    setDeleting(true);
    const result = await deleteCategory(initial.slug);
    if (!result.ok) {
      setDeleting(false);
      return showError(result.error);
    }
    setDirty(false);
    router.push("/admin");
  }

  return (
    <>
      <Link href="/admin" className="mt-2 inline-block text-sm font-semibold text-muted hover:text-brand-700">
        ← All categories
      </Link>

      <Section title="Basic details" hint="Fill in English, Hindi or both. If one is empty, the other is shown.">
        <div className="grid gap-4 sm:grid-cols-[110px_1fr]">
          <Field label="Icon" hint="One emoji">
            <input
              className={`${inputClass} text-center text-2xl`}
              value={category.icon}
              maxLength={8}
              onChange={(e) => update({ icon: e.target.value })}
            />
          </Field>
          <LocalizedInput
            label="Category name"
            value={category.name}
            onChange={(name) => update({ name })}
            placeholder={{ en: "e.g. Holi Items", hi: "जैसे होली का सामान" }}
          />
        </div>
        {isNew ? (
          <Field
            label="Page address (English letters)"
            hint="Used in the website link. Leave empty to create it from the English name. Cannot be changed later."
          >
            <div className="flex items-center gap-1 text-sm text-muted">
              <span className="shrink-0">website.com/</span>
              <input
                className={inputClass}
                placeholder="holi-items"
                value={category.slug}
                onChange={(e) => update({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
              />
            </div>
          </Field>
        ) : (
          <p className="text-sm text-muted">
            Page address:{" "}
            <a href={`/${initial.slug}`} target="_blank" rel="noopener" className="font-semibold text-brand-700">
              /{initial.slug} ↗
            </a>
          </p>
        )}
        <LocalizedInput
          label="Short description"
          multiline
          value={category.description}
          onChange={(description) => update({ description })}
        />
      </Section>

      <Section title="Cover photo" hint="Shown on the home page card and at the top of the category page.">
        <div className="max-w-sm">
          <ImagePicker
            aspect="aspect-[16/10]"
            placeholder={category.icon}
            value={category.image.src || undefined}
            onChange={(src) => update({ image: { ...category.image, src: src ?? "" } })}
            onError={showError}
          />
        </div>
      </Section>

      <Section title="Season & festival dates">
        <label className="flex items-center gap-3 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            className="size-5 accent-brand-600"
            checked={Boolean(category.allYear)}
            onChange={(e) => update({ allYear: e.target.checked })}
          />
          Sold all year (no festival dates)
        </label>
        <LocalizedInput
          label="Season (shown as a label)"
          value={category.season}
          onChange={(season) => update({ season })}
          placeholder={{ en: "e.g. September – October", hi: "जैसे सितंबर – अक्टूबर" }}
        />
        {!category.allYear && (
          <>
            <LocalizedInput
              label="Festival name for the countdown"
              value={category.dateLabel}
              onChange={(dateLabel) => update({ dateLabel })}
              placeholder={{ en: "e.g. Maha Saptami", hi: "जैसे महासप्तमी" }}
            />
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-ink">Festival dates</span>
              <p className="mb-2 text-xs text-muted">
                The main festival day for each year. The website shows &ldquo;Coming soon&rdquo; 45 days before.
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {dates.map((d, i) => (
                  <div key={i} className="flex gap-1">
                    <input
                      type="date"
                      className={inputClass}
                      value={d}
                      onChange={(e) => setDate(i, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      aria-label="Remove date"
                      onClick={() => update({ dates: dates.filter((_, j) => j !== i) })}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-2" onClick={() => update({ dates: [...dates, ""] })}>
                + Add date
              </Button>
            </div>
          </>
        )}
      </Section>

      <Section title="Who buys from us" hint="Shown on the category page, e.g. murti makers, pandal committees.">
        {category.buyers.map((b, i) => (
          <div key={i} className="grid gap-2 rounded-xl bg-soft p-3 sm:grid-cols-[80px_1fr_auto] sm:items-end">
            <Field label="Icon">
              <input
                className={`${inputClass} text-center text-xl`}
                value={b.icon}
                maxLength={8}
                onChange={(e) => setBuyer(i, { icon: e.target.value })}
              />
            </Field>
            <LocalizedInput label="Who" value={b.name} onChange={(name) => setBuyer(i, { name })} />
            <Button variant="ghost" onClick={() => update({ buyers: category.buyers.filter((_, j) => j !== i) })}>
              Remove
            </Button>
          </div>
        ))}
        <Button
          variant="secondary"
          onClick={() => update({ buyers: [...category.buyers, { icon: "👥", name: { ...EMPTY } }] })}
        >
          + Add buyer type
        </Button>
      </Section>

      <Section
        title={`Items (${category.items.length})`}
        hint="Each item has a photo and a name. Use ↑ ↓ to change the order shown on the website."
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {category.items.map((item, i) => (
            <li key={item.id} className="rounded-xl border border-line p-3">
              <div className="grid grid-cols-[110px_1fr] gap-3">
                <ImagePicker
                  placeholder={category.icon}
                  value={item.photo}
                  onChange={(photo) => setItem(i, { photo })}
                  onError={showError}
                />
                <div className="min-w-0 space-y-2">
                  <input
                    aria-label="Item name (English)"
                    className={inputClass}
                    placeholder="Name in English"
                    value={item.name.en}
                    onChange={(e) => setItem(i, { name: { ...item.name, en: e.target.value } })}
                  />
                  <input
                    aria-label="Item name (Hindi)"
                    lang="hi"
                    className={inputClass}
                    placeholder="हिंदी में नाम"
                    value={item.name.hi}
                    onChange={(e) => setItem(i, { name: { ...item.name, hi: e.target.value } })}
                  />
                  <div className="flex gap-1">
                    <Button variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => moveItem(i, -1)}>
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      aria-label="Move down"
                      disabled={i === category.items.length - 1}
                      onClick={() => moveItem(i, 1)}
                    >
                      ↓
                    </Button>
                    <Button variant="ghost" className="ml-auto hover:text-red-700" onClick={() => removeItem(i)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Button
          variant="secondary"
          onClick={() => update({ items: [...category.items, { id: newId(), name: { ...EMPTY } }] })}
        >
          + Add item
        </Button>
      </Section>

      {!isNew && (
        <Section title="Delete category" hint="Removes this category, its page and all its items from the website.">
          <Button variant="danger" loading={deleting} onClick={handleDelete}>
            Delete this category
          </Button>
        </Section>
      )}

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <span className={`text-sm font-semibold ${dirty ? "text-brand-700" : "text-muted"}`}>
            {dirty ? "● Unsaved changes" : "All changes saved"}
          </span>
          <Button loading={saving} disabled={!dirty && !isNew} onClick={handleSave} className="min-w-32">
            {saving ? "Saving…" : isNew ? "Create category" : "Save changes"}
          </Button>
        </div>
      </div>

      <Toast notice={notice} onClose={clear} />
    </>
  );
}
