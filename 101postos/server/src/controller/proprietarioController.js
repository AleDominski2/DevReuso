// routes/proprietarioroutes.js
import Proprietario from "../models/Proprietario.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

/* ------------------------------
   CREATE - novo proprietario
   POST /api/proprietarios
------------------------------ */
export async function create(req, res) {
  console.log("POST /api/proprietarios body:", req.body);
  const { nome, email, senha } = req.body ?? {};

  // validações básicas
  if (!nome || !email || !senha) {
    return res.status(400).json({
      error: "Campos obrigatórios: nome, email e senha.",
    });
  }

  try {
    // Verifica se já existe um usuário com o mesmo email
    const existing = await Proprietario.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email já está em uso." });
    }

    // Cria novo registro no banco
    const novoProprietario = await Proprietario.create({ nome, email, senha });

    // Remove o campo senha do retorno
    const safeUser = { ...novoProprietario.toJSON() };
    delete safeUser.senha;

    res.status(201).json({
      message: "Proprietário criado com sucesso!",
      user: safeUser,
    });
  } catch (error) {
    console.error("Erro ao criar proprietário:", error);
    res
      .status(500)
      .json({ error: "Erro interno ao criar proprietário", message: error.message });
  }
};


/* ------------------------------
   LOGIN
------------------------------ */
const SECRET_KEY = process.env.JWT_SECRET; // Chave secreta para assinar o token

console.log("SECRET_KEY:", SECRET_KEY);
export async function login(req, res) {
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

    // Gerar token JWT
    const token = jwt.sign(
      { id: safeUser.id_proprietario, email: safeUser.email }, // payload
      SECRET_KEY, // chave secreta
      { expiresIn: '1h' } // expira em 1 hora
    );

    // Enviar token junto com a resposta
    res.json({
      message: "Login bem-sucedido!",
      user: safeUser,
      token: token
    });

  } catch (error) {
    console.error("Erro na rota /login:", error);
    return res.status(500).json({ error: "Erro interno no servidor", message: error.message });
  }
};

/* ------------------------------
   GET - listar todos
   GET /api/proprietarios
------------------------------ */
export async function getAll(req, res) {
  try {
    const proprietarios = await Proprietario.findAll();
    res.json(proprietarios);
  } catch (error) {
    console.error("Erro ao buscar proprietarios:", error);
    res.status(500).json({ error: "Erro ao buscar proprietarios" });
  }
};

/* ------------------------------
   GET - buscar por ID
   GET /api/proprietarios/:id
------------------------------ */
export async function getById(req, res) {
  const { id } = req.params;

  try {
    const proprietario = await Proprietario.findByPk(id);
    if (!proprietario) {
      return res.status(404).json({ error: "Proprietario não encontrado" });
    }
    
    res.json({
      id: proprietario.id_proprietario,
      nome: proprietario.nome,
      email: proprietario.email
    });
  } catch (error) {
    console.error("Erro ao buscar proprietario:", error);
    res.status(500).json({ error: "Erro ao buscar proprietario" });
  }
};

/* ------------------------------
   PUT - atualizar por ID
   PUT /api/proprietarios/:id
------------------------------ */
export async function updatebyId(req, res) {
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
};

/* ------------------------------
   DELETE - remover por ID
   DELETE /api/proprietarios/:id
------------------------------ */
export async function deleteById(req, res) {
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
};

