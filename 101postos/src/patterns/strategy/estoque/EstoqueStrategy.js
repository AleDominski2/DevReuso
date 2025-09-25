
class EstoqueStrategy {
  calcularEstoque(dados) {
    throw new Error("Método deve ser implementado pelas classes filhas");
  }

  verificarDisponibilidade(dados, quantidade) {
    throw new Error("Método deve ser implementado pelas classes filhas");
  }

  atualizarEstoque(dados, quantidade, operacao) {
    throw new Error("Método deve ser implementado pelas classes filhas");
  }
}

module.exports = EstoqueStrategy;
