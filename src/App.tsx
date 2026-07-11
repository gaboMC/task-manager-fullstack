import { useEffect, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";
import AuthForm from "./components/AuthoForm"; // Corregida la ruta de importación de la interfaz

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    if (!token) return;

    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3000/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      }
    };

    fetchTasks();
  }, [token]);

  const handleLoginSuccess = (userToken: string) => {
    localStorage.setItem("token", userToken); 
    setToken(userToken); 
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTasks([]); 
  };

  const addTask = async (text: string) => {
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }),
      });

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Error al crear tarea:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  const toggleTask = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
      });

      if (response.ok) {
        const updatedTask = await response.json();
        const updatedTasks = tasks.map((task) => 
          task.id === id ? updatedTask : task
        );
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="app-container">
      {/* RENDERIZADO CONDICIONAL MODULAR */}
      {!token ? (
        <AuthForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {/* 1. Primero colocamos el botón alineado a la derecha */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>

          {/* 2. El título de la app queda abajo del botón */}
          <Header />

          {/* 3. El resto del contenido del CRUD */}
          <TaskInput onAddTask={addTask} />

          <TaskList
            tasks={tasks}
            onDeleteTask={deleteTask}
            onToggleTask={toggleTask}
          />

          <Footer
            total={tasks.length}
            completed={completedTasks}
            pending={pendingTasks}
          />
        </>
      )}
    </div>
  );
}

export default App;
