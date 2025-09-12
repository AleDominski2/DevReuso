/**
 * Interface Strategy para cálculo de estoque
 * Define o contrato para diferentes estratégias de controle de estoque
 */
class EstoqueStrategy {
  constructor() {
    if (this.constructor === EstoqueStrategy) {
      throw new Error("Interface não pode ser instanciada diretamente");
    }
  }

  /**
   * Calcula o estoque disponível
   * @abstract
   */
  calcularEstoqueDisponivel(dados) {
    throw new Error("Método calcularEstoqueDisponivel deve ser implementado");
  }

  /**
   * Verifica se há estoque suficiente
   * @abstract
   */
  verificarDisponibilidade(dados, quantidade) {
    throw new Error("Método verificarDisponibilidade deve ser implementado");
  }

  /**
   * Atualiza o estoque após movimentação
   * @abstract
   */
  atualizarEstoque(dados, quantidade, tipo) {
    throw new Error("Método atualizarEstoque deve ser implementado");
  }

  /**
   * Calcula o ponto de reposição
   * @abstract
   */
  calcularPontoReposicao(dados) {
    throw new Error("Método calcularPontoReposicao deve ser implementado");
  }

  /**
   * Gera alertas de estoque
   * @abstract
   */
  gerarAlertas(dados) {
    throw new Error("Método gerarAlertas deve ser implementado");
  }
}

/**
 * Estratégia concreta para controle de combustível por volume
 */
class EstoqueCombustivelStrategy extends EstoqueStrategy {
  
  /**
   * Calcula estoque de combustível em litros
   */
  calcularEstoqueDisponivel(dados) {
    const { tanques } = dados;
    
    if (!tanques || tanques.length === 0) {
      return 0;
    }

    // Soma o volume de todos os tanques do mesmo combustível
    const volumeTotal = tanques.reduce((total, tanque) => {
      return total + (tanque.volumeAtual || 0);
    }, 0);

    // Considera a margem de segurança (5% do volume fica inacessível)
    const margemSeguranca = volumeTotal * 0.05;
    const volumeUtil = volumeTotal - margemSeguranca;

    return {
      volumeTotal,
      volumeUtil,
      margemSeguranca,
      unidade: 'LITROS',
      tanques: tanques.map(t => ({
        id: t.id,
        capacidade: t.capacidadeTotal,
        atual: t.volumeAtual,
        percentual: (t.volumeAtual / t.capacidadeTotal * 100).toFixed(2)
      }))
    };
  }

  /**
   * Verifica disponibilidade considerando múltiplos tanques
   */
  verificarDisponibilidade(dados, quantidadeSolicitada) {
    const estoque = this.calcularEstoqueDisponivel(dados);
    
    const disponivel = estoque.volumeUtil >= quantidadeSolicitada;
    const tanqueSuficiente = this.identificarTanqueDisponivel(dados.tanques, quantidadeSolicitada);

    return {
      disponivel,
      volumeDisponivel: estoque.volumeUtil,
      quantidadeSolicitada,
      tanqueRecomendado: tanqueSuficiente,
      necessitaDistribuicao: !tanqueSuficiente && disponivel,
      mensagem: this.gerarMensagemDisponibilidade(disponivel, estoque.volumeUtil, quantidadeSolicitada)
    };
  }

  identificarTanqueDisponivel(tanques, quantidade) {
    // Encontra o tanque com volume suficiente
    return tanques.find(t => t.volumeAtual >= quantidade);
  }

  gerarMensagemDisponibilidade(disponivel, volumeDisponivel, solicitado) {
    if (disponivel) {
      return `Disponível: ${volumeDisponivel.toFixed(2)}L disponíveis para ${solicitado}L solicitados`;
    }
    return `Estoque insuficiente: apenas ${volumeDisponivel.toFixed(2)}L disponíveis para ${solicitado}L solicitados`;
  }

  /**
   * Atualiza estoque de combustível
   */
  atualizarEstoque(dados, quantidade, tipo) {
    const { tanques } = dados;
    
    if (tipo === 'ENTRADA') {
      return this.processarEntrada(tanques, quantidade);
    } else if (tipo === 'SAIDA') {
      return this.processarSaida(tanques, quantidade);
    }
    
    throw new Error(`Tipo de movimentação inválido: ${tipo}`);
  }

  processarEntrada(tanques, quantidade) {
    // Distribui entrada nos tanques com mais espaço disponível
    const tanquesOrdenados = [...tanques].sort((a, b) => {
      const espacoA = a.capacidadeTotal - a.volumeAtual;
      const espacoB = b.capacidadeTotal - b.volumeAtual;
      return espacoB - espacoA;
    });

    let quantidadeRestante = quantidade;
    const movimentacoes = [];

    for (const tanque of tanquesOrdenados) {
      if (quantidadeRestante <= 0) break;
      
      const espacoDisponivel = tanque.capacidadeTotal - tanque.volumeAtual;
      const quantidadeAdicionar = Math.min(espacoDisponivel, quantidadeRestante);
      
      if (quantidadeAdicionar > 0) {
        tanque.volumeAtual += quantidadeAdicionar;
        quantidadeRestante -= quantidadeAdicionar;
        
        movimentacoes.push({
          idTanque: tanque.id,
          quantidade: quantidadeAdicionar,
          volumeFinal: tanque.volumeAtual
        });
      }
    }

    return {
      sucesso: quantidadeRestante === 0,
      movimentacoes,
      quantidadeProcessada: quantidade - quantidadeRestante,
      quantidadeRestante
    };
  }

  processarSaida(tanques, quantidade) {
    // Remove do tanque com mais volume disponível
    const tanquesOrdenados = [...tanques].sort((a, b) => b.volumeAtual - a.volumeAtual);
    
    let quantidadeRestante = quantidade;
    const movimentacoes = [];

    for (const tanque of tanquesOrdenados) {
      if (quantidadeRestante <= 0) break;
      
      const quantidadeRemover = Math.min(tanque.volumeAtual, quantidadeRestante);
      
      if (quantidadeRemover > 0) {
        tanque.volumeAtual -= quantidadeRemover;
        quantidadeRestante -= quantidadeRemover;
        
        movimentacoes.push({
          idTanque: tanque.id,
          quantidade: quantidadeRemover,
          volumeFinal: tanque.volumeAtual
        });
      }
    }

    return {
      sucesso: quantidadeRestante === 0,
      movimentacoes,
      quantidadeProcessada: quantidade - quantidadeRestante,
      quantidadeRestante
    };
  }

  /**
   * Calcula ponto de reposição para combustível
   */
  calcularPontoReposicao(dados) {
    const { consumoMedioDiario, tempoReposicaoDias, tanques } = dados;
    
    // Ponto de reposição = (Consumo médio diário × Tempo de reposição) + Estoque de segurança
    const consumoDuranteReposicao = consumoMedioDiario * tempoReposicaoDias;
    const estoqueSeguranca = consumoMedioDiario * 3; // 3 dias de segurança
    const pontoReposicao = consumoDuranteReposicao + estoqueSeguranca;
    
    // Calcula capacidade total
    const capacidadeTotal = tanques.reduce((total, t) => total + t.capacidadeTotal, 0);
    
    // Quantidade ideal de pedido (60% da capacidade total)
    const quantidadePedido = capacidadeTotal * 0.6;

    return {
      pontoReposicao,
      quantidadePedido,
      estoqueSeguranca,
      consumoMedioDiario,
      diasAutonomia: this.calcularDiasAutonomia(dados),
      percentualReposicao: (pontoReposicao / capacidadeTotal * 100).toFixed(2)
    };
  }

  calcularDiasAutonomia(dados) {
    const estoque = this.calcularEstoqueDisponivel(dados);
    return Math.floor(estoque.volumeUtil / dados.consumoMedioDiario);
  }

  /**
   * Gera alertas específicos para combustível
   */
  gerarAlertas(dados) {
    const alertas = [];
    const estoque = this.calcularEstoqueDisponivel(dados);
    const pontoReposicao = this.calcularPontoReposicao(dados);

    // Alerta de estoque baixo
    if (estoque.volumeUtil <= pontoReposicao.pontoReposicao) {
      alertas.push({
        tipo: 'CRITICO',
        mensagem: `Estoque abaixo do ponto de reposição. Solicitar ${pontoReposicao.quantidadePedido.toFixed(0)}L`,
        acao: 'GERAR_PEDIDO_COMPRA'
      });
    }

    // Alerta por tanque
    dados.tanques.forEach(tanque => {
      const percentual = (tanque.volumeAtual / tanque.capacidadeTotal) * 100;
      
      if (percentual < 10) {
        alertas.push({
          tipo: 'CRITICO',
          mensagem: `Tanque ${tanque.id} com apenas ${percentual.toFixed(1)}% de capacidade`,
          acao: 'VERIFICAR_TANQUE'
        });
      } else if (percentual < 25) {
        alertas.push({
          tipo: 'AVISO',
          mensagem: `Tanque ${tanque.id} com ${percentual.toFixed(1)}% de capacidade`,
          acao: 'MONITORAR'
        });
      }
    });

    // Alerta de autonomia
    const diasAutonomia = pontoReposicao.diasAutonomia;
    if (diasAutonomia <= 2) {
      alertas.push({
        tipo: 'URGENTE',
        mensagem: `Estoque suficiente para apenas ${diasAutonomia} dias`,
        acao: 'PEDIDO_EMERGENCIAL'
      });
    }

    return alertas;
  }
}

/**
 * Estratégia concreta para controle de produtos por unidade
 */
class EstoqueProdutoStrategy extends EstoqueStrategy {
  
  /**
   * Calcula estoque de produtos em unidades
   */
  calcularEstoqueDisponivel(dados) {
    const { produtos, estoques } = dados;
    
    if (!produtos || produtos.length === 0) {
      return { quantidadeTotal: 0, produtos: [] };
    }

    const estoquePorProduto = produtos.map(produto => {
      const estoquesProduto = estoques.filter(e => e.idProduto === produto.id);
      const quantidadeTotal = estoquesProduto.reduce((total, e) => total + e.quantidade, 0);
      
      return {
        idProduto: produto.id,
        descricao: produto.descricao,
        quantidade: quantidadeTotal,
        unidade: produto.unidadeMedida || 'UN',
        valorEstoque: quantidadeTotal * produto.precoVenda,
        categoria: produto.categoria,
        localizacoes: estoquesProduto.map(e => ({
          idEstoque: e.idEstoque,
          quantidade: e.quantidade
        }))
      };
    });

    const totais = estoquePorProduto.reduce((acc, prod) => ({
      quantidade: acc.quantidade + prod.quantidade,
      valor: acc.valor + prod.valorEstoque
    }), { quantidade: 0, valor: 0 });

    return {
      quantidadeTotal: totais.quantidade,
      valorTotal: totais.valor,
      produtos: estoquePorProduto,
      numeroSKUs: produtos.length
    };
  }

  /**
   * Verifica disponibilidade de produtos
   */
  verificarDisponibilidade(dados, quantidadeSolicitada) {
    const { idProduto, quantidade } = quantidadeSolicitada;
    const estoque = this.calcularEstoqueDisponivel(dados);
    const produtoEstoque = estoque.produtos.find(p => p.idProduto === idProduto);
    
    if (!produtoEstoque) {
      return {
        disponivel: false,
        mensagem: 'Produto não encontrado no estoque'
      };
    }

    const disponivel = produtoEstoque.quantidade >= quantidade;
    
    return {
      disponivel,
      quantidadeDisponivel: produtoEstoque.quantidade,
      quantidadeSolicitada: quantidade,
      localizacoes: produtoEstoque.localizacoes,
      sugestaoAlternativa: !disponivel ? this.sugerirAlternativa(dados, idProduto) : null,
      mensagem: disponivel 
        ? `Disponível: ${produtoEstoque.quantidade} ${produtoEstoque.unidade}` 
        : `Insuficiente: apenas ${produtoEstoque.quantidade} ${produtoEstoque.unidade} disponíveis`
    };
  }

  sugerirAlternativa(dados, idProduto) {
    // Sugere produtos similares com estoque disponível
    const produto = dados.produtos.find(p => p.id === idProduto);
    if (!produto) return null;

    const similares = dados.produtos.filter(p => 
      p.categoria === produto.categoria && 
      p.id !== idProduto
    );

    return similares.map(p => ({
      id: p.id,
      descricao: p.descricao,
      quantidadeDisponivel: dados.estoques
        .filter(e => e.idProduto === p.id)
        .reduce((total, e) => total + e.quantidade, 0)
    })).filter(p => p.quantidadeDisponivel > 0);
  }

  /**
   * Atualiza estoque de produtos
   */
  atualizarEstoque(dados, movimentacao, tipo) {
    const { idProduto, quantidade, idEstoque } = movimentacao;
    const estoqueItem = dados.estoques.find(e => 
      e.idProduto === idProduto && e.idEstoque === idEstoque
    );

    if (!estoqueItem) {
      if (tipo === 'ENTRADA') {
        // Cria novo registro de estoque
        dados.estoques.push({
          idProduto,
          idEstoque,
          quantidade
        });
        return { sucesso: true, mensagem: 'Novo estoque criado' };
      }
      return { sucesso: false, mensagem: 'Estoque não encontrado' };
    }

    if (tipo === 'ENTRADA') {
      estoqueItem.quantidade += quantidade;
    } else if (tipo === 'SAIDA') {
      if (estoqueItem.quantidade < quantidade) {
        return { 
          sucesso: false, 
          mensagem: `Estoque insuficiente. Disponível: ${estoqueItem.quantidade}` 
        };
      }
      estoqueItem.quantidade -= quantidade;
    } else if (tipo === 'TRANSFERENCIA') {
      // Transferência entre estoques
      const { idEstoqueDestino } = movimentacao;
      
      if (estoqueItem.quantidade < quantidade) {
        return { sucesso: false, mensagem: 'Quantidade insuficiente para transferência' };
      }
      
      estoqueItem.quantidade -= quantidade;
      
      // Adiciona ao destino
      const estoqueDestino = dados.estoques.find(e => 
        e.idProduto === idProduto && e.idEstoque === idEstoqueDestino
      );
      
      if (estoqueDestino) {
        estoqueDestino.quantidade += quantidade;
      } else {
        dados.estoques.push({
          idProduto,
          idEstoque: idEstoqueDestino,
          quantidade
        });
      }
    } else if (tipo === 'INVENTARIO') {
      // Ajuste de inventário
      const diferenca = quantidade - estoqueItem.quantidade;
      estoqueItem.quantidade = quantidade;
      return { sucesso: true, mensagem: `Inventário ajustado em ${diferenca}` };
    } else {
      return { sucesso: false, mensagem: 'Tipo de movimentação inválido' };
    }}}