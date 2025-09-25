import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();


export const sequelize = new Sequelize(
process.env.DB_NAME || "nome_do_banco",
process.env.DB_USER || "usuario",
process.env.DB_PASS || "senha",
{
host: process.env.DB_HOST || "localhost",
dialect: "mysql",
logging: false,
}
);