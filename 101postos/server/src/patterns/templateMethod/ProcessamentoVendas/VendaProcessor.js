
const { gerarIdVenda, gerarNumeroCupom } = require("../utils/idGenerator");
const logger = require("../utils/logger");

class VendaProcessor {
  constructor() {
    if (this.constructor === VendaProcessor) {
      throw new Error("Classe abstrata não pode ser instanciada diretamente");
    }
  }

  async processarVenda(venda) {
    try {
      this.validarDados(venda);

      const vendaRegistrada = await this.registrarVenda(venda);

      await this.atualizarEstoque(vendaRegistrada);

      const vendaCalculada = this.calcularValores(vendaRegistrada);

      const cupomFiscal = await this.emitirCupomFiscal(vendaCalculada);

      const pagamento = await this.processarPagamento(vendaCalculada);

      this.finalizarVenda(vendaCalculada, pagamento, cupomFiscal);

      return {
        sucesso: true,
        venda: vendaCalculada,
        cupom: cupomFiscal,
        pagamento: pagamento,
      };
    } catch (error) {
      this.tratarErro(error);
      throw error;
    }
  }

  validarDados(venda) {
    if (!venda.itens || venda.itens.length === 0) {
      throw new Error("Venda deve conter pelo menos um item");
    }
    if (!venda.idEstabelecimento) {
      throw new Error("ID do estabelecimento é obrigatório");
    }
  }

  async registrarVenda(venda) {
    const vendaRegistro = {
      ...venda,
      id: gerarIdVenda(),
      dataHora: new Date(),
      status: "PROCESSANDO",
    };

    logger.info(`Venda registrada: ${vendaRegistro.id}`);
    return vendaRegistro;
  }

  async atualizarEstoque(_) {
    throw new Error("Método atualizarEstoque deve ser implementado");
  }

  calcularValores(venda) {
    let valorTotal = 0;

    venda.itens.forEach((item) => {
      item.valorTotal = item.quantidade * item.valorUnitario;
      valorTotal += item.valorTotal;
    });

    return {
      ...venda,
      valorTotal,
      valorDesconto: this.calcularDesconto(venda),
      valorImpostos: this.calcularImpostos(venda),
    };
  }

  calcularDesconto(_) {
    return 0;
  }

  calcularImpostos(venda) {
    return venda.valorTotal * 0.05;
  }

  async emitirCupomFiscal(venda) {
    const cupom = {
      numero: gerarNumeroCupom(),
      dataEmissao: new Date(),
      estabelecimento: venda.idEstabelecimento,
      itens: venda.itens,
      valorTotal: venda.valorTotal,
      impostos: venda.valorImpostos,
    };

    if (venda.cpfCnpjCliente) {
      cupom.cliente = venda.cpfCnpjCliente;
    }

    logger.info(`Cupom fiscal emitido: ${cupom.numero}`);
    return cupom;
  }

  async processarPagamento(venda) {
    const pagamento = {
      idVenda: venda.id,
      valor: venda.valorTotal,
      formaPagamento: venda.formaPagamento || "DINHEIRO",
      status: "APROVADO",
      dataHora: new Date(),
    };

    logger.info("Pagamento processado:", pagamento);
    return pagamento;
  }

  finalizarVenda(venda, _, __) {
    logger.info(`Venda ${venda.id} finalizada com sucesso`);
  }

  tratarErro(error) {
    logger.error("Erro no processamento da venda:", error.message);
  }
}

module.exports = VendaProcessor;