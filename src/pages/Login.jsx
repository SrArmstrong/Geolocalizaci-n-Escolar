// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [Attempts ,setAttempts] = useState(0);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      //const response = await fetch("http://localhost:3000/auth/login", {
      const response = await fetch("https://mapaback.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, token }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        navigate("/admin");
      } else {
        setAttempts((prev) => prev + 1);
        setError(data.error || "Credenciales incorrectas");

        setAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 3) {
            navigate("/");
        }
        return newAttempts;
        });
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error interno del servidor");
    }
  };

  return (
    <div>
      <h2>Login Admin</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <input
          type="text"
          placeholder="Código TOTP"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        /><br />
        <button type="submit">Ingresar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
