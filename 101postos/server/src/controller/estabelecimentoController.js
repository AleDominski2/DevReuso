// routes/estabelecimentoroutes.js
import Estabelecimento from "../models/estabelecimento.js";
import dotenv from "dotenv";

dotenv.config();

/* ------------------------------
   CREATE - novo estabelecimento
   POST /api/estabelecimentos
------------------------------ */
export async function create(req, res) {
  console.log("POST /api/estabelecimentos body:", req.body);
    console.log(req.body);
  const { id_proprietario, nome_fantasia, cnpj, endereco, telefone } = req.body ?? {};
    

  // validações básicas
  if (!id_proprietario || !nome_fantasia) {
    return res.status(400).json({
      error: "Campos obrigatórios: id_proprietario e nome_fantasia.",
    });
  }

//   validação simples de cnpj (somente tamanho) — ajuste conforme necessidade
  if (cnpj && String(cnpj).length !== 14) {
    return res.status(400).json({ error: "CNPJ deve conter 14 caracteres (somente números)." });
  }

  try {
    // Verifica se proprietario existe (import dinâmico para evitar possíveis ciclos)
    const { default: Proprietario } = await import("../models/proprietario.js");
    const proprietario = await Proprietario.findByPk(id_proprietario);
    if (!proprietario) {
      return res.status(400).json({ error: "Proprietario (id_proprietario) não encontrado." });
    }

    // Verifica se já existe um estabelecimento com mesmo CNPJ (se informado)
    if (cnpj) {
      const existingCnpj = await Estabelecimento.findOne({ where: { cnpj } });
      if (existingCnpj) {
        return res.status(400).json({ error: "CNPJ já está em uso por outro estabelecimento." });
      }
    }

    // Cria novo registro no banco
    const novo = await Estabelecimento.create({
      id_proprietario,
      nome_fantasia,
      cnpj: cnpj ?? null,
      endereco: endereco ?? null,
      telefone: telefone ?? null,
    });

    // Recarrega para acionar hooks (para popular FK) e garantir formato consistente
    const criado = await Estabelecimento.findByPk(novo.id_estabelecimento);

    res.status(201).json({
      message: "Estabelecimento criado com sucesso!",
      estabelecimento: criado,
    });
  } catch (error) {
    console.error("Erro ao criar estabelecimento:", error);
    // Tratamento para erro de unique constraint vindo do DB
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Violação de unicidade (provavelmente CNPJ duplicado)." });
    }
    res.status(500).json({ error: "Erro interno ao criar estabelecimento", message: error.message });
  }
}

/* ------------------------------
   GET - listar todos
   GET /api/estabelecimentos
------------------------------ */
export async function getAll(req, res) {
  try {
    const estabelecimentos = await Estabelecimento.findAll();
    res.json(estabelecimentos);
  } catch (error) {
    console.error("Erro ao buscar estabelecimentos:", error);
    res.status(500).json({ error: "Erro ao buscar estabelecimentos" });
  }
}

/* ------------------------------
   GET - buscar por ID
   GET /api/estabelecimentos/:id
------------------------------ */
export async function getById(req, res) {
  const { id } = req.params;

  try {
    const est = await Estabelecimento.findByPk(id);
    if (!est) {
      return res.status(404).json({ error: "Estabelecimento não encontrado" });
    }

    res.json(est);
  } catch (error) {
    console.error("Erro ao buscar estabelecimento:", error);
    res.status(500).json({ error: "Erro ao buscar estabelecimento" });
  }
}

/* ------------------------------
   PUT - atualizar por ID
   PUT /api/estabelecimentos/:id
------------------------------ */
export async function updateById(req, res) {
  const { id } = req.params;
  const { id_proprietario, nome_fantasia, cnpj, endereco, telefone } = req.body ?? {};

  try {
    const est = await Estabelecimento.findByPk(id);
    if (!est) {
      return res.status(404).json({ error: "Estabelecimento não encontrado" });
    }

    // Se mudar id_proprietario, verificar existência do proprietario
    if (id_proprietario && id_proprietario !== est.id_proprietario) {
      const { default: Proprietario } = await import("../models/proprietario.js");
      const proprietario = await Proprietario.findByPk(id_proprietario);
      if (!proprietario) {
        return res.status(400).json({ error: "Proprietario (id_proprietario) não encontrado." });
      }
      est.id_proprietario = id_proprietario;
    }

    if (nome_fantasia) est.nome_fantasia = nome_fantasia;
    if (typeof endereco !== "undefined") est.endereco = endereco;
    if (typeof telefone !== "undefined") est.telefone = telefone;

    // se forneceu cnpj, validar e garantir unicidade
    if (typeof cnpj !== "undefined") {
      if (cnpj && String(cnpj).length !== 14) {
        return res.status(400).json({ error: "CNPJ deve conter 14 caracteres (somente números)." });
      }
      if (cnpj && cnpj !== est.cnpj) {
        const existing = await Estabelecimento.findOne({ where: { cnpj } });
        if (existing) {
          return res.status(400).json({ error: "CNPJ já está em uso por outro estabelecimento." });
        }
      }
      est.cnpj = cnpj ?? null;
    }

    await est.save();

    // Recarregar para garantir hooks/populações
    const atualizado = await Estabelecimento.findByPk(id);

    res.json({ message: "Estabelecimento atualizado com sucesso!", estabelecimento: atualizado });
  } catch (error) {
    console.error("Erro ao atualizar estabelecimento:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Violação de unicidade (provavelmente CNPJ duplicado)." });
    }
    res.status(500).json({ error: "Erro ao atualizar estabelecimento" });
  }
}

/* ------------------------------
   DELETE - remover por ID
   DELETE /api/estabelecimentos/:id
------------------------------ */
export async function deleteById(req, res) {
  const { id } = req.params;

  try {
    const est = await Estabelecimento.findByPk(id);
    if (!est) {
      return res.status(404).json({ error: "Estabelecimento não encontrado" });
    }

    await est.destroy();
    res.json({ message: "Estabelecimento removido com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover estabelecimento:", error);
    res.status(500).json({ error: "Erro ao remover estabelecimento" });
  }
}
