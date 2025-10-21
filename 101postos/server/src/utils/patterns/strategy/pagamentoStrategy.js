// interface strategy para pagamento
class PagamentoStrategy {
    processar(dados) {
        throw new Error( "Metodo deve ser implementado pelas classes filhas");
    }
}

//estrategia dinheiro
class DinheiroStrategy extends PagamentoStrategy {
    processar(dados) {
        const { valor, valorRecebido } = dados;

        if (valorRecebido < valor) {
            return { sucesso: false, mensagem: "Valor insuficiente" }; 
        }

        return {
            sucesso: true,
            valorPago: valor,
            troco: valorRecebido - valor,
            formaPagamento: "DINHEIRO"
        };
    }
}

// estrategia cartao
class CartaoStrategy extends PagamentoStrategy {
    processar(dados) {
        const { valor, numeroCartao, cvv } = dados;

        //simulação de validaçao basica
        if (!numeroCartao || numeroCartao.length < 16 || !cvv) {
            return { sucesso: false, mensagem: "Dados do cartao invalidos" };
        }

        //taca de 3%
        const taxa = valor * 0.03;
        return {
            sucesso: true,
            valorPago: valor,
            valorLiquido: valor - taxa,
            taxa: taxa,
            formaPagamento: "CARTAO"
        };
    }
}

// estrategia transferencia
class TransferenciaStrategy extends PagamentoStrategy {
    processar(dados) {
        const { valor, chavePix, banco } = dados;

         if (!chavePix) {
            return { sucesso: false, mensagem: "Chave PIX obrigatória" };
    }
    
    return {
      sucesso: true,
      valorPago: valor,
      chavePix: chavePix,
      banco: banco || "PIX",
      formaPagamento: "TRANSFERENCIA"
    };
  }
}

 // Context - classe que usa as estratégias de pagamento
class ProcessadorPagamento {
    constructor(strategy) {
        this.strategy = strategy;
  }
  
    definirEstrategia(strategy) {
        this.strategy = strategy;
  }
  
    processar(dados) {
        return this.strategy.processar(dados);
  }
}