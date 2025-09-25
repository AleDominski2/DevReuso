import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Proprietario = sequelize.define(
  "Proprietario",
  {
    id_proprietario: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },

    nome: { 
      type: DataTypes.STRING(100), 
      allowNull: false 
    },

    email: { 
      type: DataTypes.STRING(50), 
      allowNull: false, 
      unique: true 
    },

    senha: { 
      type: DataTypes.STRING(255), 
      allowNull: false 
    },

  },
  { tableName: "Proprietario", timestamps: false }
);

export default Proprietario;

