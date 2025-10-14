import { DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Estabelecimento = sequelize.define(
  "Estabelecimento",
  {
    id_estabelecimento: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },

    id_proprietario: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },

    nome_fantasia: { 
      type: DataTypes.STRING(100), 
      allowNull: false 
    },

    cnpj: { 
      type: DataTypes.CHAR(14), 
      unique: true, 
      allowNull: true 
    },

    endereco: { 
      type: DataTypes.STRING(255), 
      allowNull: true 
    },

    telefone: { 
      type: DataTypes.STRING(20), 
      allowNull: true 
    },

  },
  { tableName: "Estabelecimento", timestamps: false }
);

async function populateFKsEstabelecimento(result) {
  if (!result) return;
  const populateOne = async (inst) => {
    if (inst.id_proprietario != null) {
      // dynamic import to avoid circular deps
      const { default: Proprietario } = await import("./proprietario.js");
      inst.dataValues.proprietario = await Proprietario.findByPk(inst.id_proprietario);
    }
  };

  if (Array.isArray(result)) {
    await Promise.all(result.map(r => populateOne(r)));
  } else {
    await populateOne(result);
  }
}

Estabelecimento.addHook('afterCreate', async (instance) => { await populateFKsEstabelecimento(instance); });
Estabelecimento.addHook('afterFind', async (result) => { await populateFKsEstabelecimento(result); });
Estabelecimento.addHook('afterUpdate', async (instance) => { await populateFKsEstabelecimento(instance); });

export default Estabelecimento;

