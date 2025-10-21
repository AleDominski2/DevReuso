import express from "express";
import cors from "cors";
import { connectDB } from "./config/connect.js";
import proprietarioRoutes from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", proprietarioRoutes);

await connectDB();

app.listen(5000, () => {
  console.log("🚀 Servidor rodando na porta 5000");
});
