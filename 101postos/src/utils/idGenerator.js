// Funções utilitárias para gerar IDs únicos

function gerarIdVenda() {
  return `VND-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function gerarNumeroCupom() {
  return `CF-${Date.now()}`;
}

module.exports = { gerarIdVenda, gerarNumeroCupom };
