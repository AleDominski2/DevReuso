
import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Posto = sequelize.define(
  "Posto",
  {
    id_posto: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },

    id_estabelecimento: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },

    cnpj: { 
      type: DataTypes.CHAR(14), 
      unique: true, 
      allowNull: true 
    },
    
  },
  { tableName: "Posto", timestamps: false }
);

async function populateFKsPosto(result) {
  if (!result) return;
  const populateOne = async (inst) => {
    if (inst.id_estabelecimento != null) {
      const { default: Estabelecimento } = await import("./Estabelecimento.js");
      inst.dataValues.estabelecimento = await Estabelecimento.findByPk(inst.id_estabelecimento);
    }
  };
  if (Array.isArray(result)) await Promise.all(result.map(r => populateOne(r))); else await populateOne(result);
}

Posto.addHook('afterCreate', async (instance) => { await populateFKsPosto(instance); });
Posto.addHook('afterFind', async (result) => { await populateFKsPosto(result); });
Posto.addHook('afterUpdate', async (instance) => { await populateFKsPosto(instance); });

export default Posto;


