// Classe abstrata que define o template de validação
class ValidadorCadastroTemplate {
    
    // Template Method - define o algoritmo principal de validação
    validarCadastro(dados) {
        console.log(`=== VALIDANDO ${this.getTipoCadastro().toUpperCase()} ===`);
        
        const resultado = {
            valido: true,
            erros: []
        };
        
        // Sequência fixa de validações
        this.validarCamposObrigatorios(dados, resultado);
        
        if (resultado.valido) {
            this.validarFormatos(dados, resultado);
        }
        
        if (resultado.valido) {
            this.validarRegrasNegocio(dados, resultado);
        }
        
        this.exibirResultado(resultado);
        return resultado;
    }
    
    // Método concreto - comum para todos os tipos
    exibirResultado(resultado) {
        if (resultado.valido) {
            console.log("✅ Cadastro válido!");
        } else {
            console.log("❌ Cadastro inválido:");
            resultado.erros.forEach(erro => console.log(`   - ${erro}`));
        }
        console.log();
    }
    
    // Método utilitário
    adicionarErro(resultado, mensagem) {
        resultado.erros.push(mensagem);
        resultado.valido = false;
    }
    
    // Métodos abstratos - devem ser implementados pelas subclasses
    getTipoCadastro() {
        throw new Error("Método getTipoCadastro() deve ser implementado");
    }
    
    validarCamposObrigatorios(dados, resultado) {
        throw new Error("Método validarCamposObrigatorios() deve ser implementado");
    }
    
    validarFormatos(dados, resultado) {
        throw new Error("Método validarFormatos() deve ser implementado");
    }
    
    validarRegrasNegocio(dados, resultado) {
        throw new Error("Método validarRegrasNegocio() deve ser implementado");
    }
}

// Validação para PRODUTOS
class ValidadorProduto extends ValidadorCadastroTemplate {
    
    getTipoCadastro() {
        return "PRODUTO";
    }
    
    validarCamposObrigatorios(dados, resultado) {
        if (!dados.codigo) {
            this.adicionarErro(resultado, "Código é obrigatório");
        }
        
        if (!dados.nome) {
            this.adicionarErro(resultado, "Nome é obrigatório");
        }
        
        if (!dados.preco) {
            this.adicionarErro(resultado, "Preço é obrigatório");
        }
    }
    
    validarFormatos(dados, resultado) {
        // Código deve ter 6 dígitos
        if (dados.codigo && !/^\d{6}$/.test(dados.codigo)) {
            this.adicionarErro(resultado, "Código deve ter 6 dígitos");
        }
        
        // Nome deve ter pelo menos 3 caracteres
        if (dados.nome && dados.nome.length < 3) {
            this.adicionarErro(resultado, "Nome deve ter pelo menos 3 caracteres");
        }
    }
    
    validarRegrasNegocio(dados, resultado) {
        // Preço deve ser positivo
        if (dados.preco && dados.preco <= 0) {
            this.adicionarErro(resultado, "Preço deve ser positivo");
        }
        
        // Preço não pode ser muito alto
        if (dados.preco && dados.preco > 1000) {
            this.adicionarErro(resultado, "Preço não pode ser superior a R$ 1000");
        }
    }
}

// Validação para BOMBAS
class ValidadorBomba extends ValidadorCadastroTemplate {
    
    getTipoCadastro() {
        return "BOMBA";
    }
    
    validarCamposObrigatorios(dados, resultado) {
        if (!dados.numero) {
            this.adicionarErro(resultado, "Número da bomba é obrigatório");
        }
        
        if (!dados.fabricante) {
            this.adicionarErro(resultado, "Fabricante é obrigatório");
        }
    }
    
    validarFormatos(dados, resultado) {
        // Número deve ser inteiro positivo
        if (dados.numero && (!Number.isInteger(dados.numero) || dados.numero <= 0)) {
            this.adicionarErro(resultado, "Número deve ser um inteiro positivo");
        }
        
        // Fabricante deve ter pelo menos 3 caracteres
        if (dados.fabricante && dados.fabricante.length < 3) {
            this.adicionarErro(resultado, "Fabricante deve ter pelo menos 3 caracteres");
        }
    }
    
    validarRegrasNegocio(dados, resultado) {
        // Número da bomba não pode ser maior que 20
        if (dados.numero && dados.numero > 20) {
            this.adicionarErro(resultado, "Número da bomba não pode ser maior que 20");
        }
        
        // Fabricante deve ser válido
        const fabricantesValidos = ['WAYNE', 'GILBARCO', 'TOKHEIM'];
        if (dados.fabricante && !fabricantesValidos.includes(dados.fabricante.toUpperCase())) {
            this.adicionarErro(resultado, `Fabricante deve ser: ${fabricantesValidos.join(', ')}`);
        }
    }
}

// Validação para COMBUSTÍVEIS
class ValidadorCombustivel extends ValidadorCadastroTemplate {
    
    getTipoCadastro() {
        return "COMBUSTÍVEL";
    }
    
    validarCamposObrigatorios(dados, resultado) {
        if (!dados.tipo) {
            this.adicionarErro(resultado, "Tipo é obrigatório");
        }
        
        if (!dados.preco) {
            this.adicionarErro(resultado, "Preço é obrigatório");
        }
        
        if (!dados.fornecedor) {
            this.adicionarErro(resultado, "Fornecedor é obrigatório");
        }
    }
    
    validarFormatos(dados, resultado) {
        // Tipo deve ter pelo menos 3 caracteres
        if (dados.tipo && dados.tipo.length < 3) {
            this.adicionarErro(resultado, "Tipo deve ter pelo menos 3 caracteres");
        }
        
        // Preço deve ser numérico
        if (dados.preco && isNaN(dados.preco)) {
            this.adicionarErro(resultado, "Preço deve ser numérico");
        }
    }
    
    validarRegrasNegocio(dados, resultado) {
        // Tipos válidos
        const tiposValidos = ['GASOLINA', 'ETANOL', 'DIESEL'];
        if (dados.tipo && !tiposValidos.includes(dados.tipo.toUpperCase())) {
            this.adicionarErro(resultado, `Tipo deve ser: ${tiposValidos.join(', ')}`);
        }
        
        // Preço deve estar em faixa aceitável
        if (dados.preco && (dados.preco < 1 || dados.preco > 10)) {
            this.adicionarErro(resultado, "Preço deve estar entre R$ 1,00 e R$ 10,00");
        }
        
        // Fornecedores válidos
        const fornecedoresValidos = ['PETROBRAS', 'SHELL', 'IPIRANGA'];
        if (dados.fornecedor && !fornecedoresValidos.includes(dados.fornecedor.toUpperCase())) {
            this.adicionarErro(resultado, `Fornecedor deve ser: ${fornecedoresValidos.join(', ')}`);
        }
    }
}