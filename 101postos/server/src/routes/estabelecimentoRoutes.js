// routes/estabelecimentoroutes.js
import express from "express";
import {
  create,
  getAll,
  getById,
  updateById,
  deleteById
} from "../controller/estabelecimentoController.js";
import { authenticateToken } from "../auth/authMiddleware.js";

const router = express.Router();

router.post("/estabelecimentos",authenticateToken, create);
router.get("/estabelecimentos", authenticateToken, getAll);
router.get("/estabelecimentos/:id", authenticateToken, getById);
router.put("/estabelecimentos/:id", authenticateToken, updateById);
router.delete("/estabelecimentos/:id", authenticateToken, deleteById);

export default router;
