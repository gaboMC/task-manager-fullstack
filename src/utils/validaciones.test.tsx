import { describe, it, expect } from "vitest";
import { parseAuthMessage } from "../components/AuthoForm";
import { countCompletedTasks } from "../components/TaskList";


describe("parseAuthMessage", () => {
  it("identifica un mensaje de error", () => {
    const authMessage = "error|Credenciales incorrectas";

    const resultado = parseAuthMessage(authMessage);

    expect(resultado).toEqual({
      type: "error",
      message: "Credenciales incorrectas",
    });
  });

  it("identifica un mensaje de éxito", () => {
    const authMessage = "success|Usuario registrado con éxito";

    const resultado = parseAuthMessage(authMessage);

    expect(resultado).toEqual({
      type: "success",
      message: "Usuario registrado con éxito",
    });
  });

  it("devuelve null cuando el mensaje está vacío", () => {
    const authMessage = "";

    const resultado = parseAuthMessage(authMessage);

    expect(resultado).toBeNull();
  });
});

describe("countCompletedTasks", () => {
  it("cuenta las tareas completadas", () => {
    const tasks = [
      {
        id: 1,
        text: "Estudiar",
        completed: true,
      },
      {
        id: 2,
        text: "Hacer ejercicio",
        completed: false,
      },
      {
        id: 3,
        text: "Leer",
        completed: true,
      },
    ];

    const resultado = countCompletedTasks(tasks);

    expect(resultado).toBe(2);
  });

  it("devuelve 0 cuando ninguna tarea está completada", () => {
    const tasks = [
      {
        id: 1,
        text: "Estudiar",
        completed: false,
      },
      {
        id: 2,
        text: "Leer",
        completed: false,
      },
    ];

    const resultado = countCompletedTasks(tasks);

    expect(resultado).toBe(0);
  });

  it("devuelve 0 cuando la lista está vacía", () => {
    const tasks: {
      id: number;
      text: string;
      completed: boolean;
    }[] = [];

    const resultado = countCompletedTasks(tasks);

    expect(resultado).toBe(0);
  });
});