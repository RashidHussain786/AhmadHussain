import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { readContent } from "@/lib/content/store";
import { AdminLoading, AdminPage } from "../../_components/AdminHeader";
import { CategoryEditor } from "../../_components/CategoryEditor";
import { emptyCategory } from "../../_components/empty-category";

export default function EditCategoryPage({ params }: PageProps<"/admin/category/[slug]">) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: PageProps<"/admin/category/[slug]">["params"] }) {
  await requireAdmin();
  const { slug } = await params;

  if (slug === "new") {
    return (
      <AdminPage title="New category">
        <CategoryEditor initial={emptyCategory()} isNew />
      </AdminPage>
    );
  }

  const { categories } = await readContent();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <AdminPage title={`${category.icon} ${category.name.en || category.name.hi}`}>
      {/* key: reset the form when switching to another category */}
      <CategoryEditor key={category.slug} initial={category} isNew={false} />
    </AdminPage>
  );
}
