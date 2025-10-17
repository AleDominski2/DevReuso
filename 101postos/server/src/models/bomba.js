import { DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Bomba = sequelize.define(
  "Bomba",
  {
    id_bomba: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },

    id_posto: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },

    identificacao: { 
      type: DataTypes.STRING(30), 
      allowNull: true 
    }
    ,
    num_bocas: { 
      type: DataTypes.INTEGER, 
      allowNull: false },
  },
  
  { tableName: "Bomba", timestamps: false }
);

async function populateFKsBomba(result) {
  if (!result) return;
  const populateOne = async (inst) => {
    if (inst.id_posto != null) {
      const { default: Posto } = await import("./posto.js");
      inst.dataValues.posto = await Posto.findByPk(inst.id_posto);
    }
  };
  if (Array.isArray(result)) await Promise.all(result.map(r => populateOne(r))); else await populateOne(result);
}

Bomba.addHook('afterCreate', async (instance) => { await populateFKsBomba(instance); });
Bomba.addHook('afterFind', async (result) => { await populateFKsBomba(result); });
Bomba.addHook('afterUpdate', async (instance) => { await populateFKsBomba(instance); });

export default Bomba;
