import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { readContent } from "@/lib/content/store";
import { AdminLoading, AdminPage } from "./_components/AdminHeader";
import { CategoryList } from "./_components/CategoryList";

export default function AdminHome() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  await requireAdmin();
  const { categories } = await readContent();
  return (
    <AdminPage title="Festival categories">
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Tap a category to edit its items and photos. Use ↑ ↓ to change the order on the website.
        </p>
        <Link
          href="/admin/category/new"
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
        >
          + New category
        </Link>
      </div>
      <CategoryList categories={categories} />
    </AdminPage>
  );
}
