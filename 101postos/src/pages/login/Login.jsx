import { useState } from "react";
import logo from "../../assets/logo.png";
import styles from "./Login.module.css";

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
    <div className={styles["login-container"]}>
      <div className={styles["login-card"]}>
        <img src={logo} alt="Logo do posto" className={styles["login-logo"]} />
        <h1>Bem-vindo(a)</h1>
        <p className="subtitle">Acesse sua conta para continuar</p>

        <form onSubmit={handleSubmit} className={styles["login-form"]}>
          <div className={styles["form-group"]}>
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

          <div className={styles["form-group"]}>
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

          <button type="submit" className={styles["login-button"]}>
            Entrar
          </button>
        </form>

        <a href="#" className={styles["forgot-password"]}>
          Esqueceu sua senha?
        </a>
      </div>
    </div>
  );
}
