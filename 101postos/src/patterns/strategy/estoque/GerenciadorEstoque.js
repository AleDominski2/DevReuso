/**
 * Context - Classe que usa as estratégias de estoque
 */
class GerenciadorEstoque {
  constructor(strategy) {
    this.strategy = strategy;
  }

  definirEstrategia(strategy) {
    this.strategy = strategy;
  }

  calcularEstoque(dados) {
    return this.strategy.calcularEstoque(dados);
  }

  verificarDisponibilidade(dados, quantidade) {
    return this.strategy.verificarDisponibilidade(dados, quantidade);
  }

  atualizarEstoque(dados, quantidade, operacao) {
    return this.strategy.atualizarEstoque(dados, quantidade, operacao);
  }
}

module.exports = GerenciadorEstoque;
