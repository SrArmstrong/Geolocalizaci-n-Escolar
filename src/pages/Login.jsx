
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

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
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setError(data.error || "Credenciales incorrectas");

        if (newAttempts >= 3) {
          setTimeout(() => {
            navigate("/");
          }, 2000); 
        }
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error interno del servidor");
    } finally {
    
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className={`login-card ${isLoading ? 'login-loading' : ''}`}>
        <div className="login-header">
          <h2 className="login-title">Login</h2>
          <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field-group">
            <label className="login-label">Correo electrónico</label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="login-input"
            />
          </div>
          
          <div className="login-field-group">
            <label className="login-label">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="login-input"
            />
          </div>
          
          <div className="login-field-group">
            <label className="login-label">Código TOTP</label>
            <input
              type="text"
              placeholder="123456"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              disabled={isLoading}
              className="login-input"
              maxLength={6}
              pattern="[0-9]{6}"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

        {error && <div className="login-error">{error}</div>}
      </div>
    </div>
  );
}

export default Login;