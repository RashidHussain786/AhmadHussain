import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { readContent } from "@/lib/content/store";
import { AdminLoading, AdminPage } from "../_components/AdminHeader";
import { ShopEditor } from "../_components/ShopEditor";

export default function ShopPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <ShopForm />
    </Suspense>
  );
}

async function ShopForm() {
  await requireAdmin();
  const { shop } = await readContent();
  return (
    <AdminPage title="Shop details">
      <ShopEditor initial={shop} />
    </AdminPage>
  );
}
