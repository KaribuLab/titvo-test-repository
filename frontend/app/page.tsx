"use client";

import { authClient } from "@/lib/auth-client";
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  patchTodo,
  type Todo,
} from "@/lib/todos-api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const list = await fetchTodos();
      setTodos(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const t = await createTodo(title.trim(), content);
      setTodos((prev) => [t, ...prev]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function toggleDone(t: Todo) {
    try {
      const updated = await patchTodo(t.id, { done: !t.done });
      setTodos((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } catch {
      setError("No se pudo actualizar");
    }
  }

  async function remove(t: Todo) {
    try {
      await deleteTodo(t.id);
      setTodos((prev) => prev.filter((x) => x.id !== t.id));
    } catch {
      setError("No se pudo eliminar");
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-zinc-600">Cargando…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 px-4">
        <p className="text-zinc-700">Necesitás iniciar sesión para ver tus tareas.</p>
        <Link
          href="/login"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Ir al login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-zinc-50 px-4 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Mis tareas</h1>
          <p className="text-sm text-zinc-600">
            Hola, {session.user.name ?? session.user.email}
          </p>
        </div>
        <button
          type="button"
          className="text-sm text-zinc-600 underline hover:text-zinc-900"
          onClick={() => void authClient.signOut()}
        >
          Cerrar sesión
        </button>
      </header>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mb-10 space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div>
          <label className="block text-xs font-medium text-zinc-600">Título</label>
          <input
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Comprar leche"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600">Nota</label>
          <textarea
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            placeholder="Detalle opcional"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Guardando…" : "Agregar"}
        </button>
      </form>

      <ul className="space-y-3">
        {todos.map((t) => (
          <li
            key={t.id}
            className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div
                  className="font-medium text-zinc-900"
                  dangerouslySetInnerHTML={{ __html: t.title }}
                />
                {t.content ? (
                  <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-600">
                    {t.content}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  className="text-xs text-zinc-500 underline"
                  onClick={() => void toggleDone(t)}
                >
                  {t.done ? "Desmarcar" : "Hecho"}
                </button>
                <button
                  type="button"
                  className="text-xs text-red-600 underline"
                  onClick={() => void remove(t)}
                >
                  Borrar
                </button>
              </div>
            </div>
            {t.done && (
              <span className="text-xs font-medium text-emerald-600">Completada</span>
            )}
          </li>
        ))}
      </ul>

      {!loading && todos.length === 0 && (
        <p className="text-center text-sm text-zinc-500">No hay tareas todavía.</p>
      )}
    </div>
  );
}
