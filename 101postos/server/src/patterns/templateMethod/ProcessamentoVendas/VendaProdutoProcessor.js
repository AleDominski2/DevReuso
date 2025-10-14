const VendaProcessor = require("./VendaProcessor");
const logger = require("../utils/logger");

class VendaProdutoProcessor extends VendaProcessor {
  validarDados(venda) {
    super.validarDados(venda);

    venda.itens.forEach((item) => {
      if (!item.idProduto) {
        throw new Error("ID do produto é obrigatório");
      }
      if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
        throw new Error("Quantidade deve ser um número inteiro positivo");
      }
    });
  }

  async atualizarEstoque(venda) {
    for (const item of venda.itens) {
      const estoqueAtual = await this.consultarEstoque(item.idProduto);

      if (estoqueAtual < item.quantidade) {
        throw new Error(
          `Estoque insuficiente para produto ${item.idProduto}`
        );
      }

      await this.decrementarEstoque(item.idProduto, item.quantidade);

      await this.registrarMovimentacao({
        idProduto: item.idProduto,
        tipo: "SAIDA",
        quantidade: item.quantidade,
        idVenda: venda.id,
      });
    }

    logger.info("Estoque de produtos atualizado");
  }

  async consultarEstoque(_) {
    return 100;
  }

  async decrementarEstoque(idProduto, quantidade) {
    logger.info(`Produto ${idProduto}: -${quantidade} unidades`);

    const estoqueRestante = (await this.consultarEstoque(idProduto)) - quantidade;
    if (estoqueRestante <= 10) {
      this.gerarPedidoReposicao(idProduto);
    }
  }

  async registrarMovimentacao(movimentacao) {
    logger.info("Movimentação registrada:", movimentacao);
  }

  gerarPedidoReposicao(idProduto) {
    logger.info(`📦 Pedido de reposição gerado para produto ${idProduto}`);
  }

  calcularDesconto(venda) {
    let desconto = 0;

    venda.itens.forEach((item) => {
      if (item.quantidade >= 10) {
        desconto += item.valorTotal * 0.1;
      } else if (item.quantidade >= 5) {
        desconto += item.valorTotal * 0.05;
      }
    });

    if (venda.cpfCnpjCliente) {
      desconto += venda.valorTotal * 0.02;
    }

    return desconto;
  }

  calcularImpostos(venda) {
    return venda.valorTotal * 0.18;
  }
}

module.exports = VendaProdutoProcessor;