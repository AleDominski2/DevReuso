/**
 * Classe abstrata que define o Template Method para processamento de vendas
 * Define o fluxo comum: registro → atualização de estoque → emissão de cupom → pagamento
 */
class VendaProcessor {
  constructor() {
    if (this.constructor === VendaProcessor) {
      throw new Error("Classe abstrata não pode ser instanciada diretamente");
    }
  }

  /**
   * Template Method - Define o algoritmo de processamento de venda
   * @param {Object} venda - Dados da venda
   * @returns {Object} Resultado do processamento
   */
  async processarVenda(venda) {
    try {
      // 1. Validar dados da venda
      this.validarDados(venda);
      
      // 2. Registrar venda no sistema
      const vendaRegistrada = await this.registrarVenda(venda);
      
      // 3. Atualizar estoque (hook method - implementação específica)
      await this.atualizarEstoque(vendaRegistrada);
      
      // 4. Calcular impostos e descontos
      const vendaCalculada = this.calcularValores(vendaRegistrada);
      
      // 5. Emitir cupom fiscal
      const cupomFiscal = await this.emitirCupomFiscal(vendaCalculada);
      
      // 6. Processar pagamento
      const pagamento = await this.processarPagamento(vendaCalculada);
      
      // 7. Finalizar venda (hook method opcional)
      this.finalizarVenda(vendaCalculada, pagamento, cupomFiscal);
      
      return {
        sucesso: true,
        venda: vendaCalculada,
        cupom: cupomFiscal,
        pagamento: pagamento
      };
    } catch (error) {
      this.tratarErro(error);
      throw error;
    }
  }

  /**
   * Validação básica dos dados - pode ser sobrescrita
   */
  validarDados(venda) {
    if (!venda.itens || venda.itens.length === 0) {
      throw new Error("Venda deve conter pelo menos um item");
    }
    if (!venda.idEstabelecimento) {
      throw new Error("ID do estabelecimento é obrigatório");
    }
  }

  /**
   * Registro comum da venda
   */
  async registrarVenda(venda) {
    const vendaRegistro = {
      ...venda,
      id: this.gerarIdVenda(),
      dataHora: new Date(),
      status: 'PROCESSANDO'
    };
    
    // Simula gravação no banco
    console.log("Venda registrada:", vendaRegistro.id);
    return vendaRegistro;
  }

  /**
   * Hook Method - Deve ser implementado pelas subclasses
   * @abstract
   */
  async atualizarEstoque(venda) {
    throw new Error("Método atualizarEstoque deve ser implementado");
  }

  /**
   * Cálculo de valores comuns
   */
  calcularValores(venda) {
    let valorTotal = 0;
    
    venda.itens.forEach(item => {
      item.valorTotal = item.quantidade * item.valorUnitario;
      valorTotal += item.valorTotal;
    });
    
    return {
      ...venda,
      valorTotal,
      valorDesconto: this.calcularDesconto(venda),
      valorImpostos: this.calcularImpostos(venda)
    };
  }

  /**
   * Hook Method - Pode ser sobrescrito para cálculos específicos
   */
  calcularDesconto(venda) {
    return 0; // Implementação padrão sem desconto
  }

  /**
   * Hook Method - Pode ser sobrescrito para impostos específicos
   */
  calcularImpostos(venda) {
    return venda.valorTotal * 0.05; // 5% padrão
  }

  /**
   * Emissão de cupom fiscal comum
   */
  async emitirCupomFiscal(venda) {
    const cupom = {
      numero: this.gerarNumeroCupom(),
      dataEmissao: new Date(),
      estabelecimento: venda.idEstabelecimento,
      itens: venda.itens,
      valorTotal: venda.valorTotal,
      impostos: venda.valorImpostos
    };
    
    if (venda.cpfCnpjCliente) {
      cupom.cliente = venda.cpfCnpjCliente;
    }
    
    console.log("Cupom fiscal emitido:", cupom.numero);
    return cupom;
  }

  /**
   * Processamento de pagamento comum
   */
  async processarPagamento(venda) {
    const pagamento = {
      idVenda: venda.id,
      valor: venda.valorTotal,
      formaPagamento: venda.formaPagamento || 'DINHEIRO',
      status: 'APROVADO',
      dataHora: new Date()
    };
    
    console.log("Pagamento processado:", pagamento);
    return pagamento;
  }

  /**
   * Hook Method opcional - pode ser sobrescrito
   */
  finalizarVenda(venda, pagamento, cupom) {
    console.log(`Venda ${venda.id} finalizada com sucesso`);
  }

  /**
   * Tratamento de erros
   */
  tratarErro(error) {
    console.error("Erro no processamento da venda:", error.message);
  }

  /**
   * Métodos auxiliares
   */
  gerarIdVenda() {
    return `VND-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  gerarNumeroCupom() {
    return `CF-${Date.now()}`;
  }
}

/**
 * Implementação concreta para vendas de combustível
 */
class VendaCombustivelProcessor extends VendaProcessor {
  
  /**
   * Validação específica para combustível
   */
  validarDados(venda) {
    super.validarDados(venda);
    
    venda.itens.forEach(item => {
      if (!item.idBomba) {
        throw new Error("ID da bomba é obrigatório para venda de combustível");
      }
      if (!item.litros || item.litros <= 0) {
        throw new Error("Quantidade de litros deve ser maior que zero");
      }
    });
  }

  /**
   * Atualização de estoque específica para combustível
   */
  async atualizarEstoque(venda) {
    for (const item of venda.itens) {
      // Atualiza o volume no tanque
      await this.atualizarTanque(item.idTanque, item.litros);
      
      // Registra a movimentação na bomba
      await this.registrarMovimentacaoBomba(item.idBomba, item.litros);
    }
    
    console.log("Estoque de combustível atualizado");
  }

  async atualizarTanque(idTanque, litros) {
    // Simula atualização do tanque
    console.log(`Tanque ${idTanque}: -${litros} litros`);
    
    // Verifica nível mínimo
    const nivelAtual = await this.consultarNivelTanque(idTanque);
    if (nivelAtual - litros < 1000) { // Alerta se menos de 1000L
      this.gerarAlertaEstoqueBaixo(idTanque);
    }
  }

  async registrarMovimentacaoBomba(idBomba, litros) {
    console.log(`Bomba ${idBomba}: registrado ${litros} litros`);
  }

  async consultarNivelTanque(idTanque) {
    // Simula consulta ao banco
    return 5000; // 5000 litros
  }

  gerarAlertaEstoqueBaixo(idTanque) {
    console.warn(`⚠️ ALERTA: Tanque ${idTanque} com estoque baixo!`);
  }

  /**
   * Cálculo de impostos específico para combustível
   */
  calcularImpostos(venda) {
    // ICMS + PIS/COFINS específicos para combustível
    return venda.valorTotal * 0.27; // 27% de impostos sobre combustível
  }

  /**
   * Finalização específica
   */
  finalizarVenda(venda, pagamento, cupom) {
    super.finalizarVenda(venda, pagamento, cupom);
    
    // Integração com ANP se necessário
    if (venda.valorTotal > 1000) {
      this.reportarANP(venda);
    }
  }

  reportarANP(venda) {
    console.log("Venda reportada à ANP");
  }
}

/**
 * Implementação concreta para vendas de produtos da conveniência
 */
class VendaProdutoProcessor extends VendaProcessor {
  
  /**
   * Validação específica para produtos
   */
  validarDados(venda) {
    super.validarDados(venda);
    
    venda.itens.forEach(item => {
      if (!item.idProduto) {
        throw new Error("ID do produto é obrigatório");
      }
      if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
        throw new Error("Quantidade deve ser um número inteiro positivo");
      }
    });
  }

  /**
   * Atualização de estoque específica para produtos
   */
  async atualizarEstoque(venda) {
    for (const item of venda.itens) {
      // Verifica disponibilidade
      const estoqueAtual = await this.consultarEstoque(item.idProduto);
      
      if (estoqueAtual < item.quantidade) {
        throw new Error(`Estoque insuficiente para produto ${item.idProduto}`);
      }
      
      // Atualiza estoque
      await this.decrementarEstoque(item.idProduto, item.quantidade);
      
      // Registra movimentação
      await this.registrarMovimentacao({
        idProduto: item.idProduto,
        tipo: 'SAIDA',
        quantidade: item.quantidade,
        idVenda: venda.id
      });
    }
    
    console.log("Estoque de produtos atualizado");
  }

  async consultarEstoque(idProduto) {
    // Simula consulta ao banco
    return 100; // 100 unidades em estoque
  }

  async decrementarEstoque(idProduto, quantidade) {
    console.log(`Produto ${idProduto}: -${quantidade} unidades`);
    
    // Verifica ponto de reposição
    const estoqueRestante = await this.consultarEstoque(idProduto) - quantidade;
    if (estoqueRestante <= 10) {
      this.gerarPedidoReposicao(idProduto);
    }
  }

  async registrarMovimentacao(movimentacao) {
    console.log("Movimentação registrada:", movimentacao);
  }

  gerarPedidoReposicao(idProduto) {
    console.log(`📦 Pedido de reposição gerado para produto ${idProduto}`);
  }

  /**
   * Cálculo de desconto para produtos
   */
  calcularDesconto(venda) {
    let desconto = 0;
    
    // Desconto progressivo por quantidade
    venda.itens.forEach(item => {
      if (item.quantidade >= 10) {
        desconto += item.valorTotal * 0.1; // 10% de desconto
      } else if (item.quantidade >= 5) {
        desconto += item.valorTotal * 0.05; // 5% de desconto
      }
    });
    
    // Desconto para clientes com CPF/CNPJ
    if (venda.cpfCnpjCliente) {
      desconto += venda.valorTotal * 0.02; // 2% adicional
    }
    
    return desconto;
  }

  /**
   * Impostos para produtos
   */
  calcularImpostos(venda) {
    // ICMS padrão para produtos
    return venda.valorTotal * 0.18; // 18% de impostos
  }
}

// Exportar as classes
module.exports = {
  VendaProcessor,
  VendaCombustivelProcessor,
  VendaProdutoProcessor
};