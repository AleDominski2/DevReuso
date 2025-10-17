import { DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Lavajato = sequelize.define(
  "Lavajato",
  {
    id_lavajato: { 
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
  { tableName: "Lavajato", timestamps: false }
);

async function populateFKsLavajato(result) {
  if (!result) return;
  const populateOne = async (inst) => {
    if (inst.id_estabelecimento != null) {
      const { default: Estabelecimento } = await import("./estabelecimento.js");
      inst.dataValues.estabelecimento = await Estabelecimento.findByPk(inst.id_estabelecimento);
    }
  };
  if (Array.isArray(result)) await Promise.all(result.map(r => populateOne(r))); else await populateOne(result);
}

Lavajato.addHook('afterCreate', async (instance) => { await populateFKsLavajato(instance); });
Lavajato.addHook('afterFind', async (result) => { await populateFKsLavajato(result); });
Lavajato.addHook('afterUpdate', async (instance) => { await populateFKsLavajato(instance); });

export default Lavajato;

