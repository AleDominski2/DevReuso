import { DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";


const Combustivel = sequelize.define(
"Combustivel",
{
id_combustivel: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
tipo: { type: DataTypes.STRING(50), allowNull: false },
preco_venda: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
unidade_medida: { type: DataTypes.STRING(10), allowNull: false, defaultValue: "L" },
},
{ tableName: "Combustivel", timestamps: false }
);


export default Combustivel;