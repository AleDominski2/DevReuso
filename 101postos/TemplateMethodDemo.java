// Classe abstrata que define o template
abstract class CaixaTemplate {
    
    // Template Method - define o algoritmo principal
    public final void operarCaixa() {
        abrirCaixa();
        processarMovimentacoes();
        fecharCaixa();
    }
    
    // Métodos concretos - comuns para todos os turnos
    private void abrirCaixa() {
        System.out.println("=== ABERTURA DE CAIXA ===");
        System.out.println("Ligando sistema...");
        definirSaldoInicial();
        validacoesEspecificas();
        System.out.println("Caixa aberto!");
        System.out.println();
    }
    
    private void fecharCaixa() {
        System.out.println("=== FECHAMENTO DE CAIXA ===");
        System.out.println("Calculando totais...");
        conferirValores();
        procedimentosFechamento();
        System.out.println("Caixa fechado!");
        System.out.println();
    }
    
    private void processarMovimentacoes() {
        System.out.println("=== MOVIMENTAÇÕES ===");
        System.out.println("Processando vendas do " + getTurno() + "...");
        System.out.println("Movimentações registradas!");
        System.out.println();
    }
    
    // Métodos abstratos - específicos para cada turno
    protected abstract String getTurno();
    protected abstract void definirSaldoInicial();
    protected abstract void validacoesEspecificas();
    protected abstract void conferirValores();
    protected abstract void procedimentosFechamento();
}

// Implementação para o turno da manhã
class CaixaManha extends CaixaTemplate {
    
    @Override
    protected String getTurno() {
        return "MANHÃ";
    }
    
    @Override
    protected void definirSaldoInicial() {
        System.out.println("Definindo fundo fixo: R$ 200,00");
    }
    
    @Override
    protected void validacoesEspecificas() {
        System.out.println("Verificando fechamento do turno anterior");
        System.out.println("Testando impressora e gaveta");
    }
    
    @Override
    protected void conferirValores() {
        System.out.println("Conferência padrão de valores");
        System.out.println("Preparando relatório manhã");
    }
    
    @Override
    protected void procedimentosFechamento() {
        System.out.println("Passando informações para turno tarde");
        System.out.println("Deixando fundo para próximo turno");
    }
}

// Implementação para o turno da noite
class CaixaNoite extends CaixaTemplate {
    
    @Override
    protected String getTurno() {
        return "NOITE";
    }
    
    @Override
    protected void definirSaldoInicial() {
        System.out.println("Recebendo saldo do turno anterior: R$ 150,00");
    }
    
    @Override
    protected void validacoesEspecificas() {
        System.out.println("Ativando protocolos de segurança noturna");
        System.out.println("Verificando sistemas de alarme");
    }
    
    @Override
    protected void conferirValores() {
        System.out.println("Conferência rigorosa - contagem tripla");
        System.out.println("Verificação de segurança adicional");
        System.out.println("Gerando relatório consolidado do dia");
    }
    
    @Override
    protected void procedimentosFechamento() {
        System.out.println("Guardando valores no cofre");
        System.out.println("Lacração do caixa");
        System.out.println("Ativação de alarmes");
    }
}

// Classe principal para demonstração
public class TemplateMethodDemo {
    public static void main(String[] args) {
        System.out.println("DEMONSTRAÇÃO TEMPLATE METHOD PATTERN");
        System.out.println("=====================================\n");
        
        // Turno da manhã
        System.out.println("🌅 SIMULANDO TURNO DA MANHÃ:");
        CaixaTemplate caixaManha = new CaixaManha();
        caixaManha.operarCaixa();
        
        // Turno da noite
        System.out.println("🌙 SIMULANDO TURNO DA NOITE:");
        CaixaTemplate caixaNoite = new CaixaNoite();
        caixaNoite.operarCaixa();
    }
}