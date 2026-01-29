import { useState } from "react";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { TodoItem } from "../components/TodoItem";
import { TodoForm } from "../components/TodoForm";
import {
  getTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
  type TodoWithMetadata,
} from "../server/functions";

export const Route = createFileRoute("/")({
  loader: async () => {
    const todos = await getTodos();
    return { todos };
  },
  component: HomePage,
});

function HomePage() {
  const { todos: initialTodos } = useLoaderData({ from: "/" });
  const [todos, setTodos] = useState<TodoWithMetadata[]>(initialTodos);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const handleSubmit = async (data: {
    title: string;
    description?: string;
  }) => {
    setIsSubmitting(true);
    try {
      const newTodo = await createTodo({ data });

      // Add the new todo to the top of the list
      setTodos((prev) => [newTodo, ...prev]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: number) => {
    // Prevent double-clicking
    if (togglingIds.has(id) || deletingIds.has(id)) return;

    setTogglingIds((prev) => new Set(prev).add(id));

    try {
      const updatedTodo = await toggleTodo({ data: { id } });

      // Update the todo in the list
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updatedTodo : t))
      );
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDelete = async (id: number) => {
    // Prevent double-clicking
    if (deletingIds.has(id) || togglingIds.has(id)) return;

    if (!confirm("Are you sure you want to delete this todo?")) return;

    setDeletingIds((prev) => new Set(prev).add(id));

    try {
      await deleteTodo({ data: { id } });

      // Remove the todo from the list
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Todo List
          </h1>
          <p className="text-gray-500">
            {activeTodos.length} active, {completedTodos.length} completed
          </p>
        </header>

        {/* Add Todo Form */}
        <div className="mb-8">
          <TodoForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>

        {/* Active Todos */}
        {activeTodos.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Active
            </h2>
            <div className="space-y-3">
              {activeTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  isToggling={togglingIds.has(todo.id)}
                  isDeleting={deletingIds.has(todo.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Completed Todos */}
        {completedTodos.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Completed
            </h2>
            <div className="space-y-3">
              {completedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  isToggling={togglingIds.has(todo.id)}
                  isDeleting={deletingIds.has(todo.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {todos.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-blue-100">
            <p className="text-gray-400 text-lg">No todos yet. Add one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
