// interface strategy para pagamento
class TrocoStrategy {
    calcularTroco(dados) {
        throw new Error("Método deve ser implementado pelas classes filhas");
    }
}

// estrategia arredondamento
class ArredondamentoStrategy extends TrocoStrategy {
    calcularTroco(dados) {
        const { troco } = dados;

        //arredonda para multiplos de 0,05 (5 centravos)
        const trocoArredondamento = Math.round(troco * 20) / 20;
        const diferenca = trocoArredondado - troco;
        
        return {
            trocoOrignal: troco,
            trocoFinal: trocoArredondado,
            ajuste: diferenca,
            tipo: "ARREDONDAMENTO"
        };
    }
}
 // estrategia cashback
 class CashbackStrategy extends TrocoStrategy {
    calcularTroco(dados) {
        const { troco, percentualCashback = 0.05 } = dados;

        const cashback = troco + percentualCashback;
        const trocoFinal = troco + cashback;

        return {
            trocoOrignal: troco,
            trocoFinal: trocoFinal,
            cashback: cashback,
            tipo: "CASHBACK"
        };
    }
 }

 // estrategia credito cliente
 class CreditoClienteStrategy extends TrocoStrategy {
    calcularTroco(dados) {
        const { troco, cpfCliente } = dados;

        if (!cpfCliente) {
            return {
                sucesso: false,
                mensagem: "CPF necessario para credito"
            };
        }

        return {
            trocoOrignal: troco,
            trocoFinal: 0,
            creditoAdicionado: troco,
            cpfCliente: cpfCliente,
            tipo: "CREDITO_CLIENTE"
        };
    }
 }

 // CONTEXT - classe que usa as estrategias de troco
 class CalculadoraTroco {
    constructor(strategy) {
        this.strategy = strategy;
    }

    definirEstrategia(strategy) {
        this.strategy = strategy;
    }

    calcular(dados) {
        return this.strategy.calcularTroco(dados);
    }
 }