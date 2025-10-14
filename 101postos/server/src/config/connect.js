const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "cadastro_simples",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Conectado ao MySQL com Sequelize!");
  } catch (error) {
    console.error("Erro ao conectar ao MySQL com Sequelize:", error);
  }
}

module.exports = connectDB;
