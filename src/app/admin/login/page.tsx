import { Logo } from "@/components/Logo";
import { LoginForm } from "../_components/LoginForm";

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <Logo size={44} />
        <h1 className="mt-4 text-2xl font-extrabold">Admin login</h1>
        <p className="mt-1 text-sm text-muted">Enter the shop admin password.</p>
        <LoginForm />
      </div>
    </main>
  );
}
