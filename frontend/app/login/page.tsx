"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();

  const nextPath = searchParams.get("next") ?? "/";

  useEffect(() => {
    if (!isPending && session) {
      router.replace(nextPath);
    }
  }, [session, isPending, router, nextPath]);

  async function signInGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}${nextPath}`,
    });
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Usá tu cuenta de Google para continuar.
        </p>
      </div>
      <button
        type="button"
        onClick={() => void signInGoogle()}
        className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
      >
        Continuar con Google
      </button>
      {isPending && (
        <p className="text-center text-sm text-zinc-500">Cargando sesión…</p>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <p className="p-8 text-center text-sm text-zinc-500">Cargando…</p>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
