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

const router = express.Router();

router.post("/proprietarios", create);
router.post("/login", login);
router.get("/proprietarios", getAll);
router.get("/proprietarios/:id", getById);
router.put("/proprietarios/:id", updatebyId);
router.delete("/proprietarios/:id", deleteById);

export default router;
