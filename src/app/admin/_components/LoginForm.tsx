"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";
import { Spinner, inputClass } from "./ui";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={formAction} className="mt-6 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">Password</span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className={inputClass}
        />
      </label>
      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {pending && <Spinner />}
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
