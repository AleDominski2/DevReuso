import express from "express";
import proprietarioRoutes from "./proprietarioRoutes.js";

const router = express.Router();

// Monta todas as rotas principais
router.use("", proprietarioRoutes);


export default  router;