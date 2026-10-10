import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

/**
 * Admin login with one shared password.
 * - ADMIN_PASSWORD: the password (set in Vercel → Settings → Environment Variables)
 * - ADMIN_SECRET:   a long random string used to sign the login cookie
 * Neither is ever sent to the browser or stored in the code.
 */

const COOKIE = "admin_session";
const SESSION_DAYS = 30;
const MAX_FAILURES = 5;
const LOCK_MINUTES = 15;

const sha256 = (value: string) => createHash("sha256").update(value).digest();

const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("hex");

const safeEqual = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b);

export const isAdminConfigured = () => Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SECRET);

export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(sha256(input), sha256(expected));
}

function verifySession(value: string | undefined): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!value || !secret) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(Buffer.from(signature), Buffer.from(sign(`admin.${expires}`, secret)));
}

export async function startSession(): Promise<void> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET is not set");
  const expires = Date.now() + SESSION_DAYS * 86_400_000;
  (await cookies()).set(COOKIE, `${expires}.${sign(`admin.${expires}`, secret)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_DAYS * 86_400,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

export async function isLoggedIn(): Promise<boolean> {
  await connection(); // always checked per request, never prerendered
  return verifySession((await cookies()).get(COOKIE)?.value);
}

/** Use at the top of every admin page and admin action. */
export async function requireAdmin(): Promise<void> {
  if (!(await isLoggedIn())) redirect("/admin/login");
}

// --- Too many wrong passwords → wait before trying again (per server instance) ---
const failures = new Map<string, { count: number; lockedUntil: number }>();

export function lockedMinutesLeft(key: string): number {
  const entry = failures.get(key);
  if (!entry || entry.lockedUntil < Date.now()) return 0;
  return Math.ceil((entry.lockedUntil - Date.now()) / 60_000);
}

export function recordFailure(key: string): void {
  const entry = failures.get(key) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_FAILURES) {
    entry.count = 0;
    entry.lockedUntil = Date.now() + LOCK_MINUTES * 60_000;
  }
  failures.set(key, entry);
}

export const clearFailures = (key: string) => failures.delete(key);
