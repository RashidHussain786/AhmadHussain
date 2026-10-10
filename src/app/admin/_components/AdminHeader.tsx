import Link from "next/link";
import { logout } from "../actions";
import { Logo } from "@/components/Logo";

/** Top bar for logged-in admin pages. */
export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <Logo size={30} />
          <span className="hidden font-extrabold text-ink sm:inline">Admin</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold">
          <Link href="/admin" className="rounded-lg px-2.5 py-2 text-body hover:bg-soft hover:text-brand-700">
            Categories
          </Link>
          <Link href="/admin/shop" className="rounded-lg px-2.5 py-2 text-body hover:bg-soft hover:text-brand-700">
            Shop<span className="hidden sm:inline"> details</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="hidden rounded-lg px-2.5 py-2 text-body hover:bg-soft hover:text-brand-700 sm:block"
          >
            View website ↗
          </a>
          <form action={logout}>
            <button type="submit" className="rounded-lg px-2.5 py-2 text-muted hover:bg-soft hover:text-ink">
              Logout
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}

/** Page wrapper with a title. */
export function AdminPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-5xl px-4 pt-6 pb-32">
        <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
        {children}
      </main>
    </>
  );
}

/** Shown while an admin page loads. */
export function AdminLoading() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <div className="flex items-center gap-3 text-muted">
        <span className="size-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        Loading…
      </div>
    </div>
  );
}
