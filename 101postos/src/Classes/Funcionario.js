import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Funcionario = sequelize.define(
  "Funcionario",
  {
    id_funcionario: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },

    id_estabelecimento: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
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
    
    cargo: { 
      type: DataTypes.STRING(50),
       allowNull: false 
      },
      
  },
  { tableName: "Funcionario", timestamps: false }
);

async function populateFKsFuncionario(result) {
  if (!result) return;
  const populateOne = async (inst) => {
    if (inst.id_estabelecimento != null) {
      const { default: Estabelecimento } = await import("./Estabelecimento.js");
      inst.dataValues.estabelecimento = await Estabelecimento.findByPk(inst.id_estabelecimento);
    }
  };
  if (Array.isArray(result)) await Promise.all(result.map(r => populateOne(r))); else await populateOne(result);
}

Funcionario.addHook('afterCreate', async (instance) => { await populateFKsFuncionario(instance); });
Funcionario.addHook('afterFind', async (result) => { await populateFKsFuncionario(result); });
Funcionario.addHook('afterUpdate', async (instance) => { await populateFKsFuncionario(instance); });

export default Funcionario;
