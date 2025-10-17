// routes/proprietarioroutes.js
import express from "express";
import Proprietario from "../models/Proprietario.js";

const router = express.Router();

/* ------------------------------
   LOGIN
------------------------------ */
router.post("/login", async (req, res) => {
  console.log("POST /api/login body:", req.body);
  const { email, senha } = req.body ?? {};

  if (!email || !senha) {
    return res
      .status(400)
      .json({ error: "Por favor envie 'email' e 'senha' no body (JSON)." });
  }

  try {
    const user = await Proprietario.findOne({ where: { email } });
    console.log("Resultado findOne:", user && user.toJSON ? user.toJSON() : user);

    if (!user) return res.status(401).json({ error: "Email ou senha inválidos" });

    if (user.senha !== senha) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    const safeUser = { ...user.toJSON() };
    delete safeUser.senha;
    res.json({ message: "Login bem-sucedido!", user: safeUser });
  } catch (error) {
    console.error("Erro na rota /login:", error);
    return res.status(500).json({ error: "Erro interno no servidor", message: error.message });
  }
});

/* ------------------------------
   GET - listar todos
   GET /api/proprietarios
------------------------------ */
router.get("/proprietarios", async (req, res) => {
  try {
    const proprietarios = await Proprietario.findAll();
    res.json(proprietarios);
  } catch (error) {
    console.error("Erro ao buscar proprietarios:", error);
    res.status(500).json({ error: "Erro ao buscar proprietarios" });
  }
});

/* ------------------------------
   GET - buscar por ID
   GET /api/proprietarios/:id
------------------------------ */
router.get("/proprietarios/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const proprietario = await Proprietario.findByPk(id);
    if (!proprietario) {
      return res.status(404).json({ error: "Proprietario não encontrado" });
    }
    res.json(proprietario);
  } catch (error) {
    console.error("Erro ao buscar proprietario:", error);
    res.status(500).json({ error: "Erro ao buscar proprietario" });
  }
});

/* ------------------------------
   PUT - atualizar por ID
   PUT /api/proprietarios/:id
------------------------------ */
router.put("/proprietarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  try {
    const proprietario = await Proprietario.findByPk(id);
    if (!proprietario) {
      return res.status(404).json({ error: "Proprietario não encontrado" });
    }

    // Atualiza apenas os campos enviados
    if (nome) proprietario.nome = nome;
    if (email) proprietario.email = email;
    if (senha) proprietario.senha = senha;

    await proprietario.save();
    const safeUser = { ...proprietario.toJSON() };
    delete safeUser.senha;

    res.json({ message: "Proprietario atualizado com sucesso!", user: safeUser });
  } catch (error) {
    console.error("Erro ao atualizar proprietario:", error);
    res.status(500).json({ error: "Erro ao atualizar proprietario" });
  }
});

/* ------------------------------
   DELETE - remover por ID
   DELETE /api/proprietarios/:id
------------------------------ */
router.delete("/proprietarios/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const proprietario = await Proprietario.findByPk(id);
    if (!proprietario) {
      return res.status(404).json({ error: "Proprietario não encontrado" });
    }

    await proprietario.destroy();
    res.json({ message: "Proprietario removido com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover proprietario:", error);
    res.status(500).json({ error: "Erro ao remover proprietario" });
  }
});

export default router;
