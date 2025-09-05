import { useState } from "react";
import logo from "../../assets/logo.png";
import "./Login.css";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login enviado:", form);
    // Aqui você faria a chamada à API
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Logo do posto" className="login-logo" />
        <h1>Bem-vindo(a)</h1>
        <p className="subtitle">Acesse sua conta para continuar</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="exemplo@posto.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>

        <a href="#" className="forgot-password">
          Esqueceu sua senha?
        </a>
      </div>
    </div>
  );
}
