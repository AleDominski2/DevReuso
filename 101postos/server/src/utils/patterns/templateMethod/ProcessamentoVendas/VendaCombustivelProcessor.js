const VendaProcessor = require("../VendaProcessor");
const logger = require("../utils/logger");

class VendaCombustivelProcessor extends VendaProcessor {
  validarDados(venda) {
    super.validarDados(venda);

    venda.itens.forEach((item) => {
      if (!item.idBomba) {
        throw new Error("ID da bomba é obrigatório para venda de combustível");
      }
      if (!item.litros || item.litros <= 0) {
        throw new Error("Quantidade de litros deve ser maior que zero");
      }
    });
  }

  async atualizarEstoque(venda) {
    for (const item of venda.itens) {
      await this.atualizarTanque(item.idTanque, item.litros);
      await this.registrarMovimentacaoBomba(item.idBomba, item.litros);
    }
    logger.info("Estoque de combustível atualizado");
  }

  async atualizarTanque(idTanque, litros) {
    logger.info(`Tanque ${idTanque}: -${litros} litros`);

    const nivelAtual = await this.consultarNivelTanque(idTanque);
    if (nivelAtual - litros < 1000) {
      this.gerarAlertaEstoqueBaixo(idTanque);
    }
  }

  async registrarMovimentacaoBomba(idBomba, litros) {
    logger.info(`Bomba ${idBomba}: registrado ${litros} litros`);
  }

  async consultarNivelTanque(_) {
    return 5000;
  }

  gerarAlertaEstoqueBaixo(idTanque) {
    logger.warn(`⚠️ ALERTA: Tanque ${idTanque} com estoque baixo!`);
  }

  calcularImpostos(venda) {
    return venda.valorTotal * 0.27;
  }

  finalizarVenda(venda, pagamento, cupom) {
    super.finalizarVenda(venda, pagamento, cupom);

    if (venda.valorTotal > 1000) {
      this.reportarANP(venda);
    }
  }

  reportarANP(_) {
    logger.info("Venda reportada à ANP");
  }
}

module.exports = VendaCombustivelProcessor;
