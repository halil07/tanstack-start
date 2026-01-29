import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { eq, desc } from "drizzle-orm";
import { createDb, todos } from "../db";

// Types for responses
export type TodoWithMetadata = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
};

// Fetch all todos
export const getTodos = createServerFn({ method: "GET" }).handler(
  async (): Promise<TodoWithMetadata[]> => {
    const db = createDb(env.DB);

    const results = await db
      .select({
        id: todos.id,
        title: todos.title,
        description: todos.description,
        completed: todos.completed,
        createdAt: todos.createdAt,
      })
      .from(todos)
      .orderBy(desc(todos.createdAt));

    return results;
  }
);

// Input type for createTodo
type CreateTodoInput = {
  title: string;
  description?: string;
};

// Create a new todo
export const createTodo = createServerFn({ method: "POST" })
  .inputValidator((data: CreateTodoInput) => {
    if (!data.title?.trim()) {
      throw new Error("Title is required");
    }
    return {
      title: data.title.trim(),
      description: data.description?.trim() || null,
    };
  })
  .handler(async ({ data }) => {
    const db = createDb(env.DB);

    const [newTodo] = await db
      .insert(todos)
      .values({
        title: data.title,
        description: data.description,
      })
      .returning();

    return newTodo;
  });

// Input type for toggleTodo
type ToggleTodoInput = {
  id: number;
};

// Toggle todo completed status
export const toggleTodo = createServerFn({ method: "POST" })
  .inputValidator((data: ToggleTodoInput) => {
    if (!data.id) {
      throw new Error("Todo ID is required");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const db = createDb(env.DB);

    // First get the current todo
    const [currentTodo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, data.id))
      .limit(1);

    if (!currentTodo) {
      throw new Error("Todo not found");
    }

    // Toggle the completed status
    const [updatedTodo] = await db
      .update(todos)
      .set({ completed: !currentTodo.completed })
      .where(eq(todos.id, data.id))
      .returning();

    return updatedTodo;
  });

// Input type for deleteTodo
type DeleteTodoInput = {
  id: number;
};

// Delete a todo
export const deleteTodo = createServerFn({ method: "POST" })
  .inputValidator((data: DeleteTodoInput) => {
    if (!data.id) {
      throw new Error("Todo ID is required");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const db = createDb(env.DB);

    await db.delete(todos).where(eq(todos.id, data.id));

    return { success: true };
  });
