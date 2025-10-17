import { DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Tanque = sequelize.define(
  "Tanque",
  {
    id_tanque: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },

    id_posto: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },

    id_combustivel: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },

    capacidade_total: { 
      type: DataTypes.DECIMAL(12, 2), 
      allowNull: false 
    },

    volume_atual: { 
      type: DataTypes.DECIMAL(12, 2), 
      allowNull: false 
    },
    
  },
  { tableName: "Tanque", timestamps: false }
);

async function populateFKsTanque(result) {
  if (!result) return;
  const populateOne = async (inst) => {
    if (inst.id_posto != null) {
      const { default: Posto } = await import("./posto.js");
      inst.dataValues.posto = await Posto.findByPk(inst.id_posto);
    }
    if (inst.id_combustivel != null) {
      const { default: Combustivel } = await import("./combustivel.js");
      inst.dataValues.combustivel = await Combustivel.findByPk(inst.id_combustivel);
    }
  };
  if (Array.isArray(result)) await Promise.all(result.map(r => populateOne(r))); else await populateOne(result);
}

Tanque.addHook('afterCreate', async (instance) => { await populateFKsTanque(instance); });
Tanque.addHook('afterFind', async (result) => { await populateFKsTanque(result); });
Tanque.addHook('afterUpdate', async (instance) => { await populateFKsTanque(instance); });

export default Tanque;

