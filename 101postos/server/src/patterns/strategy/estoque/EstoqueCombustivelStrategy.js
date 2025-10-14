const EstoqueStrategy = require("/EstoqueStrategy");

class EstoqueCombustivelStrategy extends EstoqueStrategy {
  calcularEstoque(dados) {
    const { tanques } = dados;

    const volumeTotal = tanques.reduce((total, tanque) => {
      return total + tanque.volumeAtual;
    }, 0);

    const margemSeguranca = volumeTotal * 0.05;
    const volumeDisponivel = volumeTotal - margemSeguranca;

    return {
      total: volumeTotal,
      disponivel: Math.max(0, volumeDisponivel),
      unidade: "L",
      margemSeguranca: margemSeguranca,
    };
  }

  verificarDisponibilidade(dados, quantidadeSolicitada) {
    const estoque = this.calcularEstoque(dados);
    return {
      temEstoque: estoque.disponivel >= quantidadeSolicitada,
      disponivel: estoque.disponivel,
      solicitado: quantidadeSolicitada,
      unidade: "L",
    };
  }

  atualizarEstoque(dados, quantidade, operacao) {
    const { tanques } = dados;

    if (operacao === "ENTRADA") {
      const tanque = tanques.reduce((melhor, atual) => {
        const espacoMelhor = melhor.capacidadeTotal - melhor.volumeAtual;
        const espacoAtual = atual.capacidadeTotal - atual.volumeAtual;
        return espacoAtual > espacoMelhor ? atual : melhor;
      });

      const espacoDisponivel = tanque.capacidadeTotal - tanque.volumeAtual;
      const quantidadeAdicionar = Math.min(quantidade, espacoDisponivel);
      tanque.volumeAtual += quantidadeAdicionar;

      return {
        sucesso: true,
        processado: quantidadeAdicionar,
        restante: quantidade - quantidadeAdicionar,
      };
    }

    if (operacao === "SAIDA") {
      const tanque = tanques.reduce((melhor, atual) => {
        return atual.volumeAtual > melhor.volumeAtual ? atual : melhor;
      });

      if (tanque.volumeAtual >= quantidade) {
        tanque.volumeAtual -= quantidade;
        return {
          sucesso: true,
          processado: quantidade,
          restante: 0,
        };
      }

      return {
        sucesso: false,
        mensagem: "Volume insuficiente no tanque",
      };
    }
  }
}

module.exports = EstoqueCombustivelStrategy;
