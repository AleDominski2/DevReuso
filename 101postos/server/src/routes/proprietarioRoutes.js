// routes/proprietarioroutes.js
import express from "express";
import { 
  create,
  login, 
  getAll, 
  getById, 
  updatebyId, 
  deleteById
} from "../controller/proprietarioController.js";
import { authenticateToken } from "../auth/authMiddleware.js";

const router = express.Router();

router.post("/proprietarios", create);
router.post("/login", login);
router.get("/proprietarios",authenticateToken, getAll);
router.get("/proprietarios/:id",authenticateToken, getById);
router.put("/proprietarios/:id",authenticateToken, updatebyId);
router.delete("/proprietarios/:id",authenticateToken, deleteById);

export default router;
