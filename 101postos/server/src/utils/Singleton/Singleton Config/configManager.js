// Classe que representa o gerenciador de configuração global
class ConfigManager {
  constructor() {
    // Se já existe uma instância criada, retorna ela (padrão Singleton)
    if (ConfigManager.instance) {
      return ConfigManager.instance;
    }

    // Objeto que vai armazenar todas as configurações
    this.configs = {
      estabelecimento: {}, // Ex: nome, endereço, CNPJ
      usuario: {},          // Ex: preferências do usuário, nome, email, telefone;
      sistema: {}          // Ex: parâmetros gerais do sistema
    };

    // Salva a instância criada
    ConfigManager.instance = this;
  }

  // Define (ou atualiza) uma configuração dentro de uma categoria
  setConfig(categoria, chave, valor) {
    if (!this.configs[categoria]) {
      this.configs[categoria] = {};
    }
    this.configs[categoria][chave] = valor;
  }

  // Recupera uma configuração específica
  getConfig(categoria, chave) {
    return this.configs[categoria] ? this.configs[categoria][chave] : undefined;
  }

  // Retorna todas as configs de uma categoria
  getCategoria(categoria) {
    return this.configs[categoria] || {};
  }

  // Retorna todas as configurações
  getAllConfigs() {
    return this.configs;
  }
}

// Cria a instância única
const instance = new ConfigManager();

// Congela para evitar mudanças diretas na instância
Object.freeze(instance);

// Exporta sempre a mesma instância
module.exports = instance;
