import { del, get, put } from "@vercel/blob";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { SEED_CONTENT } from "./seed";
import type { Content } from "./types";

/**
 * Where content lives:
 * - Production (Vercel): Vercel Blob — data.json + uploaded photos (needs BLOB_READ_WRITE_TOKEN)
 * - Your computer:       .data/data.json + public/uploads/
 * If nothing has been saved yet, the starting data from seed.ts is used.
 */

const BLOB_DATA_PATH = "data.json";
const LOCAL_DATA_FILE = path.join(process.cwd(), ".data", "data.json");
const LOCAL_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const usingBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

function assertWritable() {
  if (!usingBlob() && process.env.VERCEL) {
    throw new Error(
      "Storage is not set up. In Vercel, create a Blob store and connect it to this project, then redeploy.",
    );
  }
}

export async function readContent(): Promise<Content> {
  if (usingBlob()) {
    const result = await get(BLOB_DATA_PATH, { access: "public", useCache: false });
    if (!result || result.statusCode !== 200) return structuredClone(SEED_CONTENT);
    return (await new Response(result.stream).json()) as Content;
  }
  try {
    return JSON.parse(await readFile(LOCAL_DATA_FILE, "utf8")) as Content;
  } catch {
    return structuredClone(SEED_CONTENT);
  }
}

export async function writeContent(content: Content): Promise<void> {
  assertWritable();
  const json = JSON.stringify(content, null, 2);
  if (usingBlob()) {
    await put(BLOB_DATA_PATH, json, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return;
  }
  await mkdir(path.dirname(LOCAL_DATA_FILE), { recursive: true });
  await writeFile(LOCAL_DATA_FILE, json, "utf8");
}

/** Saves an uploaded photo and returns its URL. */
export async function saveImage(file: File): Promise<string> {
  assertWritable();
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  if (usingBlob()) {
    const blob = await put(`uploads/${name}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });
    return blob.url;
  }
  await mkdir(LOCAL_UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_UPLOADS_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

/** Deletes an uploaded photo. Photos that ship with the project (/photos/…) are never deleted. */
export async function deleteImage(url: string | undefined): Promise<void> {
  if (!url) return;
  try {
    if (/^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(url) && usingBlob()) {
      await del(url);
    } else if (url.startsWith("/uploads/") && !process.env.VERCEL) {
      await unlink(path.join(LOCAL_UPLOADS_DIR, path.basename(url)));
    }
  } catch {
    // Already gone — nothing to do
  }
}
