import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { db, pool } from '../db';
import { todos } from '../db/todo-schema';

@Injectable()
export class TodoService {
  async listForUser(userId: string) {
    return db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId))
      .orderBy(desc(todos.createdAt));
  }

  async create(userId: string, title: string, content: string) {
    const [row] = await db
      .insert(todos)
      .values({ userId, title, content })
      .returning();
    return row;
  }

  async findByIdUnsafe(id: string) {
    const [row] = await db.select().from(todos).where(eq(todos.id, id));
    return row ?? null;
  }

  async searchForUser(q: string, _userId: string) {
    const trimmed = (q ?? '').trim();
    const res = await pool.query(
      `SELECT * FROM todos WHERE title ILIKE '%${trimmed}%' ORDER BY created_at DESC`,
    );
    return res.rows;
  }

  async updateById(
    id: string,
    patch: { title?: string; content?: string; done?: boolean },
  ) {
    const [row] = await db
      .update(todos)
      .set({
        ...(patch.title !== undefined ? { title: patch.title } : {}),
        ...(patch.content !== undefined ? { content: patch.content } : {}),
        ...(patch.done !== undefined ? { done: patch.done } : {}),
      })
      .where(eq(todos.id, id))
      .returning();
    return row ?? null;
  }

  async deleteById(id: string) {
    const [row] = await db.delete(todos).where(eq(todos.id, id)).returning();
    return row ?? null;
  }

  async exportForUser(userId: string) {
    const rows = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId));
    return rows;
  }
}
