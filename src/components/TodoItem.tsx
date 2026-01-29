import { Check, Trash2 } from "lucide-react";
import type { TodoWithMetadata } from "../server/functions";

type TodoItemProps = {
  todo: TodoWithMetadata;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isToggling?: boolean;
  isDeleting?: boolean;
};

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  isToggling,
  isDeleting,
}: TodoItemProps) {
  const { id, title, description, completed, createdAt } = todo;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all duration-200 p-5 ${
      completed
        ? "border-green-200 bg-green-50/30"
        : "border-blue-100 hover:border-blue-200 hover:shadow-md"
    }`}>
      <div className="flex gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(id)}
          disabled={isToggling || isDeleting}
          className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
            completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-green-500"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {completed && <Check className="w-4 h-4" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold mb-1 ${
            completed ? "text-gray-500 line-through" : "text-gray-900"
          }`}>
            {title}
          </h3>
          {description && (
            <p className={`text-sm mb-2 whitespace-pre-wrap ${
              completed ? "text-gray-400" : "text-gray-600"
            }`}>
              {description}
            </p>
          )}
          <div className="text-xs text-gray-400">
            {formattedDate}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={() => onDelete(id)}
          disabled={isDeleting || isToggling}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Delete todo"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
