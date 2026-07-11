const cors = require("cors");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// PRISMA CHANGE: Import Prisma Client
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = 3000;

// PRISMA CHANGE: Create the connection to PostgreSQL through Prisma
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

// This array is still here because POST, PUT, and DELETE are not connected to Prisma yet.
// PRISMA CHANGE: GET /tasks will no longer use this array.
let tasks: Task[] = [
  { id: 1, text: "Estudiar Node.js", completed: false },
  { id: 2, text: "Crear servidor Express", completed: true },
  { id: 3, text: "Probar rutas del backend", completed: false },
];

app.get("/", (req: any, res: any) => {
  res.send("Backend is working!");
});

// JWT: This is a basic login route.
// JWT: For now, we are using fixed credentials only for practice.
// AUTH: Login now checks real users from PostgreSQL.
// AUTH: bcrypt.compare checks the typed password against the saved hash.
app.post("/login", async (req: any, res: any) => {
  const { email, password } = req.body || {};

  // 1. Validaciones de entrada
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  // 2. Buscar usuario en la Base de Datos
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // 3. Verificar si la contraseña es correcta
  const passwordIsValid = await bcrypt.compare(password, user.password);

  if (!passwordIsValid) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // 4. Generar Token JWT
  const token = jwt.sign(
    { id: user.id, email: user.email }, 
    "secret_key", 
    { expiresIn: "1h" }
  );

  // 5. Respuesta exitosa
  res.json({
    message: "Login successful",
    token: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});


// AUTH: Protected route. Requires a valid JWT token.
app.get("/profile", (req: any, res: any) => {
  const authHeader = req.headers.authorization;

  // 1. Verificar si existe el encabezado de autorización
  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  // 2. Extraer el token del formato "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    // 3. Validar y decodificar el token JWT
    const decoded = jwt.verify(token, "secret_key");

    // 4. Respuesta con los datos del usuario decodificados
    res.json({
      message: "Protected profile data",
      user: decoded,
    });
  } catch (error) {
    // 5. Manejo de error si el token expiró o es falso
    res.status(401).json({
      message: "Invalid token",
    });
  }
});


// AUTH: Register creates a real user in PostgreSQL.
// AUTH: The password is hashed before saving it.
app.post("/register", async (req: any, res: any) => {
  const { name, email, password } = req.body || {};

  // 1. Validaciones de entrada
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required",
    });
  }

  // 2. Verificación de existencia del usuario
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  // 3. Encriptación de contraseña y creación en Base de Datos
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
  });

  // 4. Respuesta exitosa
  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
  });
});


// PRISMA CHANGE: GET /tasks now reads from PostgreSQL instead of the array
app.get("/tasks", async (req: any, res: any) => {
  const tasksFromDatabase = await prisma.task.findMany();
  res.json(tasksFromDatabase);
});

// NEW CHANGE: POST /tasks now saves the new task in PostgreSQL using Prisma.
app.post("/tasks", async (req: any, res: any) => {
  const { text } = req.body || {};

  if (!text || text.trim() === "") {
    return res.status(400).json({
      message: "Task text is required",
    });
  }

  const newTask = await prisma.task.create({
    data: {
      text: text,
      completed: false,
    },
  });

  res.status(201).json(newTask);
});

// PRISMA CHANGE: PUT /tasks/:id now updates a task in PostgreSQL using Prisma.
app.put("/tasks/:id", async (req: any, res: any) => {
  const id = Number(req.params.id);

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      completed: !task.completed,
    },
  });

  res.json(updatedTask);
});

// PRISMA CHANGE: DELETE /tasks/:id now removes a task from PostgreSQL using Prisma.
app.delete("/tasks/:id", async (req: any, res: any) => {
  const id = Number(req.params.id);

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  await prisma.task.delete({
    where: { id },
  });

  res.json({
    message: "Task deleted successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});