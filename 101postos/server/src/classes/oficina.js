import { DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Oficina = sequelize.define(
  "Oficina",
  {
    id_oficina: { 
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
      unique: true, allowNull: true 
    },
  },
  { tableName: "Oficina", timestamps: false }
);

async function populateFKsOficina(result) {
  if (!result) return;
  const populateOne = async (inst) => {
    if (inst.id_estabelecimento != null) {
      const { default: Estabelecimento } = await import("./estabelecimento.js");
      inst.dataValues.estabelecimento = await Estabelecimento.findByPk(inst.id_estabelecimento);
    }
  };
  if (Array.isArray(result)) await Promise.all(result.map(r => populateOne(r))); else await populateOne(result);
}

Oficina.addHook('afterCreate', async (instance) => { await populateFKsOficina(instance); });
Oficina.addHook('afterFind', async (result) => { await populateFKsOficina(result); });
Oficina.addHook('afterUpdate', async (instance) => { await populateFKsOficina(instance); });

export default Oficina;

