"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearFailures,
  endSession,
  isAdminConfigured,
  lockedMinutesLeft,
  passwordMatches,
  recordFailure,
  requireAdmin,
  startSession,
} from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/content";
import { deleteImage, readContent, saveImage, writeContent } from "@/lib/content/store";
import type { Category } from "@/lib/content/types";
import { InvalidInput, sanitizeCategory, sanitizeShop } from "@/lib/content/validate";

export type ActionResult = { ok: true; slug?: string; url?: string } | { ok: false; error: string };
export type LoginState = { error?: string };

// ---------------------------------------------------------------- login

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return { error: "Admin is not set up yet. Add ADMIN_PASSWORD and ADMIN_SECRET in the Vercel settings." };
  }
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const wait = lockedMinutesLeft(ip);
  if (wait) return { error: `Too many wrong attempts. Please try again in ${wait} minute${wait > 1 ? "s" : ""}.` };

  if (!passwordMatches(String(formData.get("password") ?? ""))) {
    recordFailure(ip);
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "Wrong password. Please try again." };
  }
  clearFailures(ip);
  await startSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------- helpers

/** Runs an admin change: checks login first, turns errors into friendly messages. */
async function adminAction(run: () => Promise<ActionResult>): Promise<ActionResult> {
  await requireAdmin(); // redirects to the login page when not logged in
  try {
    return await run();
  } catch (error) {
    if (error instanceof InvalidInput) return { ok: false, error: error.message };
    console.error(error);
    const message = error instanceof Error && error.message.startsWith("Storage") ? error.message : "";
    return { ok: false, error: message || "Could not save. Please check your internet and try again." };
  }
}

const photosOf = (c: Category) => [c.image.src, ...c.items.map((i) => i.photo)].filter(Boolean) as string[];

/** Deletes uploaded photos that are no longer used (project photos are never deleted). */
async function removeUnused(before: string[], after: string[]) {
  const keep = new Set(after);
  await Promise.all(before.filter((p) => !keep.has(p)).map((p) => deleteImage(p)));
}

// ---------------------------------------------------------------- categories

export async function saveCategory(originalSlug: string | null, data: unknown): Promise<ActionResult> {
  return adminAction(async () => {
    const content = await readContent();
    const old = originalSlug ? content.categories.find((c) => c.slug === originalSlug) : undefined;
    if (originalSlug && !old) return { ok: false, error: "This category no longer exists." };

    const otherSlugs = content.categories.filter((c) => c.slug !== originalSlug).map((c) => c.slug);
    const category = sanitizeCategory(data, otherSlugs, originalSlug ?? undefined);

    content.categories = old
      ? content.categories.map((c) => (c.slug === originalSlug ? category : c))
      : [...content.categories, category];
    await writeContent(content);
    if (old) await removeUnused(photosOf(old), photosOf(category));

    updateTag(CONTENT_TAG);
    return { ok: true, slug: category.slug };
  });
}

export async function deleteCategory(slug: string): Promise<ActionResult> {
  return adminAction(async () => {
    const content = await readContent();
    const old = content.categories.find((c) => c.slug === slug);
    if (!old) return { ok: true };
    content.categories = content.categories.filter((c) => c.slug !== slug);
    await writeContent(content);
    await removeUnused(photosOf(old), []);
    updateTag(CONTENT_TAG);
    return { ok: true };
  });
}

export async function moveCategory(slug: string, direction: -1 | 1): Promise<ActionResult> {
  return adminAction(async () => {
    const content = await readContent();
    const from = content.categories.findIndex((c) => c.slug === slug);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= content.categories.length) return { ok: true };
    const list = [...content.categories];
    [list[from], list[to]] = [list[to], list[from]];
    content.categories = list;
    await writeContent(content);
    updateTag(CONTENT_TAG);
    return { ok: true };
  });
}

// ---------------------------------------------------------------- shop

export async function saveShop(data: unknown): Promise<ActionResult> {
  return adminAction(async () => {
    const content = await readContent();
    content.shop = sanitizeShop(data);
    await writeContent(content);
    updateTag(CONTENT_TAG);
    return { ok: true };
  });
}

// ---------------------------------------------------------------- photos

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export async function uploadPhoto(formData: FormData): Promise<ActionResult> {
  return adminAction(async () => {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Please choose a photo." };
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
      return { ok: false, error: "Please choose a JPG, PNG or WebP photo." };
    if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "This photo is too large. Please choose a smaller one." };
    return { ok: true, url: await saveImage(file) };
  });
}
