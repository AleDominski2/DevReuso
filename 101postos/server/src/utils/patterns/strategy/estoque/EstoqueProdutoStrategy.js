const EstoqueStrategy = require("/EstoqueStrategy");

class EstoqueProdutoStrategy extends EstoqueStrategy {
  calcularEstoque(dados) {
    const { produtos } = dados;

    const quantidadeTotal = produtos.reduce((total, produto) => {
      return total + produto.quantidade;
    }, 0);

    return {
      total: quantidadeTotal,
      disponivel: quantidadeTotal,
      unidade: "UN",
      produtos: produtos.length,
    };
  }

  verificarDisponibilidade(dados, quantidadeSolicitada) {
    const { produtos, idProduto } = dados;
    const produto = produtos.find((p) => p.id === idProduto);

    if (!produto) {
      return {
        temEstoque: false,
        disponivel: 0,
        solicitado: quantidadeSolicitada,
        mensagem: "Produto não encontrado",
      };
    }

    return {
      temEstoque: produto.quantidade >= quantidadeSolicitada,
      disponivel: produto.quantidade,
      solicitado: quantidadeSolicitada,
      unidade: produto.unidade || "UN",
    };
  }

  atualizarEstoque(dados, quantidade, operacao) {
    const { produtos, idProduto } = dados;
    const produto = produtos.find((p) => p.id === idProduto);

    if (!produto) {
      return {
        sucesso: false,
        mensagem: "Produto não encontrado",
      };
    }

    if (operacao === "ENTRADA") {
      produto.quantidade += quantidade;
      return {
        sucesso: true,
        quantidadeFinal: produto.quantidade,
      };
    }

    if (operacao === "SAIDA") {
      if (produto.quantidade >= quantidade) {
        produto.quantidade -= quantidade;
        return {
          sucesso: true,
          quantidadeFinal: produto.quantidade,
        };
      }

      return {
        sucesso: false,
        mensagem: "Quantidade insuficiente em estoque",
      };
    }
  }
}

module.exports = EstoqueProdutoStrategy;
