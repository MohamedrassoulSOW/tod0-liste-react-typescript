import { Trash, CircleAlert, Clock, Circle } from "lucide-react";

type Priority = "Urgente" | "Moyenne" | "Basse";

type Todo = {
  id: number;
  text: string;
  priority: Priority;
};

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
};

const TodoItem = ({ todo, onDelete }: Props) => {
  // Configuration du badge selon la priorité
  const priorityConfig = {
    Urgente: {
      badge: "badge-error",
      icon: <CircleAlert className="w-3 h-3" />,
    },
    Moyenne: {
      badge: "badge-warning",
      icon: <Clock className="w-3 h-3" />,
    },
    Basse: {
      badge: "badge-success",
      icon: <Circle className="w-3 h-3" />,
    },
  };

  const config = priorityConfig[todo.priority];

  return (
    <li>
      <div className="flex items-center gap-4 p-4 bg-base-100 border border-base-300 rounded-xl shadow-sm hover:shadow-md transition-all">
        {/* Checkbox + texte à gauche */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-sm"
          />

          <span className="font-semibold truncate">{todo.text}</span>
        </div>

        {/* Badge + bouton à droite */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Badge de priorité */}
          <span className={`badge badge-sm badge-soft gap-1 ${config.badge}`}>
            {config.icon}
            {todo.priority}
          </span>

          {/* Bouton supprimer */}
          <button
            type="button"
            className="btn btn-sm btn-square btn-error btn-soft"
            onClick={() => onDelete(todo.id)}
            aria-label={`Supprimer la tâche ${todo.text}`}
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  );
};

export default TodoItem;
