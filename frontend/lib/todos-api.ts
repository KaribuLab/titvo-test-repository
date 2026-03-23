const base = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type Todo = {
  id: string;
  userId: string;
  title: string;
  content: string;
  done: boolean;
  createdAt: string;
};

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(`${base()}/todos`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudieron cargar las tareas");
  return res.json();
}

export async function createTodo(title: string, content: string): Promise<Todo> {
  const res = await fetch(`${base()}/todos`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error("No se pudo crear la tarea");
  return res.json();
}

export async function patchTodo(
  id: string,
  patch: Partial<Pick<Todo, "title" | "content" | "done">>,
): Promise<Todo> {
  const res = await fetch(`${base()}/todos/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("No se pudo actualizar");
  return res.json();
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${base()}/todos/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudo eliminar");
}
