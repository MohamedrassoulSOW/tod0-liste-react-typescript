import { Construction } from "lucide-react";
import TodoItem from "./TodoItem";

import { useEffect, useState } from "react";

type Priority = "Urgente" | "Moyenne" | "Basse";

type Todo = {
  id: number;
  text: string;
  priority: Priority;
};

function App() {
  // --------------------------------------------------
  // ÉTATS
  // --------------------------------------------------

  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Moyenne");

  // Récupérer les tâches depuis localStorage
  const savedTodos = localStorage.getItem("todos");

  const initialTodos: Todo[] = savedTodos ? JSON.parse(savedTodos) : [];

  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  // Filtre actuel
  const [filter, setFilter] = useState<Priority | "Tous">("Tous");

  // Tâches sélectionnées
  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());

  // --------------------------------------------------
  // LOCAL STORAGE
  // --------------------------------------------------

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // --------------------------------------------------
  // AJOUTER UNE TÂCHE
  // --------------------------------------------------

  function addTodo() {
    if (input.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority,
    };

    setTodos([newTodo, ...todos]);

    setInput("");
    setPriority("Moyenne");
  }

  // --------------------------------------------------
  // SUPPRIMER UNE TÂCHE
  // --------------------------------------------------

  function deleteTodo(id: number) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  }

  // --------------------------------------------------
  // SÉLECTIONNER / DÉSÉLECTIONNER UNE TÂCHE
  // --------------------------------------------------

  function toggleSelectTodo(id: number) {
    const newSelectedTodos = new Set(selectedTodos);

    if (newSelectedTodos.has(id)) {
      newSelectedTodos.delete(id);
    } else {
      newSelectedTodos.add(id);
    }

    setSelectedTodos(newSelectedTodos);
  }

  // --------------------------------------------------
  // SUPPRIMER LES TÂCHES SÉLECTIONNÉES
  // --------------------------------------------------

  function finishSelected() {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => !selectedTodos.has(todo.id)),
    );

    setSelectedTodos(new Set());
  }

  // --------------------------------------------------
  // FILTRAGE
  // --------------------------------------------------

  const filteredTodos =
    filter === "Tous"
      ? todos
      : todos.filter((todo) => todo.priority === filter);

  // Compteurs
  const urgentCount = todos.filter(
    (todo) => todo.priority === "Urgente",
  ).length;

  const mediumCount = todos.filter(
    (todo) => todo.priority === "Moyenne",
  ).length;

  const lowCount = todos.filter((todo) => todo.priority === "Basse").length;

  const totalCount = todos.length;

  // --------------------------------------------------
  // JSX
  // --------------------------------------------------

  return (
    /*
      p-4 sur mobile
      max-w-5xl permet de ne pas avoir une application
      trop large sur les grands écrans
    */
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 bg-base-300 p-4 sm:p-5 rounded-2xl">
        {/* ==========================================
            FORMULAIRE
            ========================================== */}

        {/*
          Mobile :
          flex-col → éléments les uns sous les autres

          Desktop :
          sm:flex-row → éléments sur une ligne
        */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Input */}
          <input
            type="text"
            placeholder="Ajouter une tâche..."
            className="input input-bordered w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {/* Priorité */}
          <select
            className="select select-bordered w-full sm:w-40"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>

          {/* Ajouter */}
          <button
            className="btn btn-primary w-full sm:w-auto"
            onClick={addTodo}
          >
            Ajouter
          </button>
        </div>

        {/* ==========================================
            FILTRES
            ========================================== */}

        <div className="bg-base-100 p-3 sm:p-4 rounded-lg">
          {/*
            flex-wrap permet aux boutons de passer
            automatiquement à la ligne si nécessaire.
          */}
          <div className="flex flex-wrap gap-2">
            <button
              className={`btn btn-sm sm:btn-md btn-primary btn-soft ${
                filter === "Tous" ? "btn-active" : ""
              }`}
              onClick={() => setFilter("Tous")}
            >
              Tous ({totalCount})
            </button>

            <button
              className={`btn btn-sm sm:btn-md btn-accent btn-soft ${
                filter === "Urgente" ? "btn-active" : ""
              }`}
              onClick={() => setFilter("Urgente")}
            >
              Urgente ({urgentCount})
            </button>

            <button
              className={`btn btn-sm sm:btn-md btn-info btn-soft ${
                filter === "Moyenne" ? "btn-active" : ""
              }`}
              onClick={() => setFilter("Moyenne")}
            >
              Moyenne ({mediumCount})
            </button>

            <button
              className={`btn btn-sm sm:btn-md btn-success btn-soft ${
                filter === "Basse" ? "btn-active" : ""
              }`}
              onClick={() => setFilter("Basse")}
            >
              Basse ({lowCount})
            </button>

            {/* 
              ml-auto fonctionne sur desktop.
              Sur mobile, le bouton passe simplement
              à la ligne grâce à flex-wrap.
            */}
            <button
              className={`btn btn-sm sm:btn-md btn-error sm:ml-auto ${
                selectedTodos.size > 0 ? "btn-active" : ""
              }`}
              onClick={finishSelected}
              disabled={selectedTodos.size === 0}
            >
              Finir la sélection ({selectedTodos.size})
            </button>
          </div>
        </div>

        {/* ==========================================
            LISTE DES TÂCHES
            ========================================== */}

        {filteredTodos.length > 0 ? (
          <ul className="flex flex-col gap-2 w-full">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isSelected={selectedTodos.has(todo.id)}
                onToggleSelect={toggleSelectTodo}
                onDelete={deleteTodo}
              />
            ))}
          </ul>
        ) : (
          /* ==========================================
             AUCUNE TÂCHE
             ========================================== */

          <div className="flex flex-col justify-center items-center p-8 sm:p-12">
            <Construction
              strokeWidth={1}
              className="w-24 h-24 sm:w-40 sm:h-40 text-primary"
            />

            <p className="text-gray-500 mt-4 text-center">
              Aucune tâche à afficher
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
