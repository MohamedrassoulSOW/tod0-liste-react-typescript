import TodoItem from "./TodoItem";

import { useEffect, useState } from "react";

type Priority = "Urgente" | "Moyenne" | "Basse";

type Todo = {
  id: number;
  text: string;
  priority: Priority;
};

function App() {
  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Moyenne");

  // Récupérer les tâches sauvegardées depuis le localStorage
  const savedTodos = localStorage.getItem("todos");
  // Si des tâches sont sauvegardées, les parser depuis JSON, sinon initialiser avec un tableau vide
  const initialTodos: Todo[] = savedTodos ? JSON.parse(savedTodos) : [];
  // Initialiser l'état des tâches avec les tâches sauvegardées ou un tableau vide
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const [filter, setFilter] = useState<Priority | "Tous">("Tous");

  useEffect(() => {
    // Sauvegarder les tâches dans le localStorage à chaque mise à jour de l'état des tâches
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    if (input.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      priority: priority,
    };

    // Sauvegarder les tâches dans le localStorage
    const newTodos = [newTodo, ...todos];
    setTodos(newTodos);
    setInput("");
    setPriority("Moyenne");

    console.log("Nouvelle tâche ajoutée :", newTodo);
    setInput("");
  }

  let filteredTodos: Todo[];
  if (filter === "Tous") {
    filteredTodos = todos;
  } else {
    filteredTodos = todos.filter((todo) => todo.priority === filter);
  }

  function deleteTodo(id: number) {
    setTodos(todos.filter((todo) => todo.id !== id));
    console.log("Tâche supprimée avec l'ID :", id);
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Ajouter une tâche ..."
            className="input input-bordered w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <select
            className="select select-bordered w-1/4"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option disabled selected></option>
            <option>Urgente</option>
            <option>Moyenne</option>
            <option>Basse</option>
          </select>
          <button className="btn btn-primary" onClick={addTodo}>
            Ajouter
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between bg-base-100 p-4 rounded-lg">
            <div className="flex flex-col">
              {filteredTodos.map((todo) => (
                <span key={todo.id}>{todo.text}</span>
              ))}
            </div>
            <button
              className={`btn btn-soft ${filter === "Tous" ? "primary" : "secondary"}`}
              onClick={() => setFilter("Tous")}
            >
              Tous
            </button>
          </div>
        </div>
        {filteredTodos.length > 0 ? (
          <ul className="divide-y divide-gray-200 flex flex-col gap-2">
            {filteredTodos.map((todo) => (
              <li>
                <TodoItem key={todo.id} todo={todo} onDelete={deleteTodo} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex justify-center items-center h-32">
            <span className="text-gray-500">Aucune tâche à afficher</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
