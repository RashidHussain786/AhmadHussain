"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Shop } from "@/lib/content/types";
import { saveShop } from "../actions";
import { Button, Field, LocalizedInput, Section, Toast, inputClass, useNotice, useUnsavedWarning } from "./ui";

export function ShopEditor({ initial }: { initial: Shop }) {
  const router = useRouter();
  const [shop, setShop] = useState<Shop>(initial);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const { notice, setNotice, clear } = useNotice();
  useUnsavedWarning(dirty);

  const update = (patch: Partial<Shop>) => {
    setShop((s) => ({ ...s, ...patch }));
    setDirty(true);
  };

  async function handleSave() {
    setSaving(true);
    clear();
    const result = await saveShop(shop);
    setSaving(false);
    if (!result.ok) return setNotice({ type: "error", text: result.error });
    setDirty(false);
    setNotice({ type: "success", text: "Saved ✓ The website updates in a few seconds." });
    router.refresh();
  }

  return (
    <>
      <Section title="Shop name">
        <LocalizedInput label="Name" value={shop.name} onChange={(name) => update({ name })} />
        <LocalizedInput label="Tagline" value={shop.tagline} onChange={(tagline) => update({ tagline })} />
      </Section>

      <Section title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone (shown on the website)" hint="e.g. +91 88776 99552">
            <input className={inputClass} value={shop.phone} onChange={(e) => update({ phone: e.target.value })} />
          </Field>
          <Field label="WhatsApp number" hint="Digits only, with country code: 918877699552">
            <input
              className={inputClass}
              inputMode="numeric"
              value={shop.whatsapp}
              onChange={(e) => update({ whatsapp: e.target.value.replace(/\D/g, "") })}
            />
          </Field>
        </div>
      </Section>

      <Section title="Address & timing">
        <LocalizedInput label="Address" multiline value={shop.address} onChange={(address) => update({ address })} />
        <LocalizedInput label="Opening hours" value={shop.hours} onChange={(hours) => update({ hours })} />
        <Field
          label="Google Maps search"
          hint="What the map and 'Get directions' search for. Use the shop name once it is on Google Maps."
        >
          <input className={inputClass} value={shop.mapQuery} onChange={(e) => update({ mapQuery: e.target.value })} />
        </Field>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <span className={`text-sm font-semibold ${dirty ? "text-brand-700" : "text-muted"}`}>
            {dirty ? "● Unsaved changes" : "All changes saved"}
          </span>
          <Button loading={saving} disabled={!dirty} onClick={handleSave} className="min-w-32">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      <Toast notice={notice} onClose={clear} />
    </>
  );
}
