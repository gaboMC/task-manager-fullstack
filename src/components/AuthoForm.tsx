import { useState, FormEvent } from "react";

type AuthFormProps = {
  onLoginSuccess: (token: string) => void;
};

type AuthMessage = {
  type: "error" | "success";
  message: string;
};

export function parseAuthMessage(authMessage: string): AuthMessage | null {
  if (!authMessage) {
    return null;
  }

  const [type, ...messageParts] = authMessage.split("|");

  return {
    type: type === "error" ? "error" : "success",
    message: messageParts.join("|") || authMessage,
  };
}

function AuthForm({ onLoginSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authMessage, setAuthMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthMessage("");

    const endpoint = isLogin ? "login" : "register";
    const bodyData = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const response = await fetch(`http://localhost:3000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Credenciales incorrectas");
      }

      if (isLogin) {
        setAuthMessage("success|¡Inicio de sesión exitoso! 🎉");
        onLoginSuccess(data.token);
      } else {
        setAuthMessage(
          "success|Usuario registrado con éxito. Ahora puedes iniciar sesión."
        );
        setIsLogin(true);
        setPassword("");
      }
    } catch (error: any) {
      setAuthMessage(`error|❌ ${error.message}`);
    }
  };

  const messageInfo = parseAuthMessage(authMessage);

  return (
    <div className="auth-box">
      <h2>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="task-input"
            required
          />
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="task-input"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="task-input"
          required
        />

        <button type="submit" className="auth-submit-btn">
          {isLogin ? "Ingresar" : "Registrarse"}
        </button>
      </form>

      {messageInfo && (
        <div
          className={`auth-message-container ${
            messageInfo.type === "error" ? "msg-error" : "msg-success"
          }`}
        >
          <p>{messageInfo.message}</p>
        </div>
      )}

      <p
        className="auth-toggle"
        onClick={() => {
          setIsLogin(!isLogin);
          setAuthMessage("");
        }}
      >
        {isLogin
          ? "¿No tienes cuenta? Regístrate aquí"
          : "¿Ya tienes cuenta? Inicia sesión"}
      </p>
    </div>
  );
}

export default AuthForm;
