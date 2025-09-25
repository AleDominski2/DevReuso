import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Conveniencia = sequelize.define(
  "Conveniencia",
  {
    id_conveniencia: { 
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
      unique: true, allowNull: true },
  },
  { tableName: "Conveniencia", timestamps: false }
);

async function populateFKsConveniencia(result) {
  if (!result) return;
  const populateOne = async (inst) => {
    if (inst.id_estabelecimento != null) {
      const { default: Estabelecimento } = await import("./Estabelecimento.js");
      inst.dataValues.estabelecimento = await Estabelecimento.findByPk(inst.id_estabelecimento);
    }
  };
  if (Array.isArray(result)) await Promise.all(result.map(r => populateOne(r))); else await populateOne(result);
}

Conveniencia.addHook('afterCreate', async (instance) => { await populateFKsConveniencia(instance); });
Conveniencia.addHook('afterFind', async (result) => { await populateFKsConveniencia(result); });
Conveniencia.addHook('afterUpdate', async (instance) => { await populateFKsConveniencia(instance); });

export default Conveniencia;
