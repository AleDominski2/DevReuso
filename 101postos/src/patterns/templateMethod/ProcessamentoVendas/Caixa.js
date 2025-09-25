// Classe abstrata que define o template
class CaixaTemplate {
    
    // Template Method - define o algoritmo principal
    operarCaixa() {
        this.abrirCaixa();
        this.processarMovimentacoes();
        this.fecharCaixa();
    }
    
    // Métodos concretos - comuns para todos os turnos
    abrirCaixa() {
        console.log("=== ABERTURA DE CAIXA ===");
        console.log("Ligando sistema...");
        this.definirSaldoInicial();
        this.validacoesEspecificas();
        console.log("Caixa aberto!");
        console.log();
    }
    
    fecharCaixa() {
        console.log("=== FECHAMENTO DE CAIXA ===");
        console.log("Calculando totais...");
        this.conferirValores();
        this.procedimentosFechamento();
        console.log("Caixa fechado!");
        console.log();
    }
    
    processarMovimentacoes() {
        console.log("=== MOVIMENTAÇÕES ===");
        console.log(`Processando vendas do ${this.getTurno()}...`);
        console.log("Movimentações registradas!");
        console.log();
    }
    
    // Métodos abstratos - devem ser implementados pelas subclasses
    getTurno() {
        throw new Error("Método getTurno() deve ser implementado pela subclasse");
    }
    
    definirSaldoInicial() {
        throw new Error("Método definirSaldoInicial() deve ser implementado pela subclasse");
    }
    
    validacoesEspecificas() {
        throw new Error("Método validacoesEspecificas() deve ser implementado pela subclasse");
    }
    
    conferirValores() {
        throw new Error("Método conferirValores() deve ser implementado pela subclasse");
    }
    
    procedimentosFechamento() {
        throw new Error("Método procedimentosFechamento() deve ser implementado pela subclasse");
    }
}

// Implementação para o turno da manhã
class CaixaManha extends CaixaTemplate {
    
    getTurno() {
        return "MANHÃ";
    }
    
    definirSaldoInicial() {
        console.log("Definindo fundo fixo: R$ 200,00");
    }
    
    validacoesEspecificas() {
        console.log("Verificando fechamento do turno anterior");
        console.log("Testando impressora e gaveta");
    }
    
    conferirValores() {
        console.log("Conferência padrão de valores");
        console.log("Preparando relatório manhã");
    }
    
    procedimentosFechamento() {
        console.log("Passando informações para turno tarde");
        console.log("Deixando fundo para próximo turno");
    }
}

// Implementação para o turno da noite
class CaixaNoite extends CaixaTemplate {
    
    getTurno() {
        return "NOITE";
    }
    
    definirSaldoInicial() {
        console.log("Recebendo saldo do turno anterior: R$ 150,00");
    }
    
    validacoesEspecificas() {
        console.log("Ativando protocolos de segurança noturna");
        console.log("Verificando sistemas de alarme");
    }
    
    conferirValores() {
        console.log("Conferência rigorosa - contagem tripla");
        console.log("Verificação de segurança adicional");
        console.log("Gerando relatório consolidado do dia");
    }
    
    procedimentosFechamento() {
        console.log("Guardando valores no cofre");
        console.log("Lacração do caixa");
        console.log("Ativação de alarmes");
    }
}

// Demonstração do padrão
function demonstrarTemplateMethod() {
    console.log("DEMONSTRAÇÃO TEMPLATE METHOD PATTERN");
    console.log("=====================================\n");
    
    // Turno da manhã
    console.log("🌅 SIMULANDO TURNO DA MANHÃ:");
    const caixaManha = new CaixaManha();
    caixaManha.operarCaixa();
    
    // Turno da noite
    console.log("🌙 SIMULANDO TURNO DA NOITE:");
    const caixaNoite = new CaixaNoite();
    caixaNoite.operarCaixa();
}

// Executar demonstração
demonstrarTemplateMethod();