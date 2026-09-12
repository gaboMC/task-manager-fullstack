import request from "supertest";
import { describe, it, expect } from "vitest";
// Cambiamos el require por import y ajustamos la ruta ya que ahora está dentro del backend
import app from "../index"; 

describe("API de tareas", () => {
  it("rechaza una tarea con título vacío", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ text: "   " });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Task text is required");
  });

  it("crea una tarea nueva", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ text: "Escribir informe" });11

    expect(res.status).toBe(201);
    expect(res.body.text).toBe("Escribir informe");
    expect(res.body.completed).toBe(false);
  });
});
