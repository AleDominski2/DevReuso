// /**
//  * Interface Strategy para cálculo de estoque
//  */
// class EstoqueStrategy {
//   calcularEstoque(dados) {
//     throw new Error("Método deve ser implementado pelas classes filhas");
//   }
  
//   verificarDisponibilidade(dados, quantidade) {
//     throw new Error("Método deve ser implementado pelas classes filhas");
//   }
  
//   atualizarEstoque(dados, quantidade, operacao) {
//     throw new Error("Método deve ser implementado pelas classes filhas");
//   }
// }

// /**
//  * Estratégia para controle de combustível por volume (litros)
//  */
// class EstoqueCombustivelStrategy extends EstoqueStrategy {
  
//   calcularEstoque(dados) {
//     const { tanques } = dados;
    
//     const volumeTotal = tanques.reduce((total, tanque) => {
//       return total + tanque.volumeAtual;
//     }, 0);
    
//     // Considera margem de segurança de 5%
//     const margemSeguranca = volumeTotal * 0.05;
//     const volumeDisponivel = volumeTotal - margemSeguranca;
    
//     return {
//       total: volumeTotal,
//       disponivel: Math.max(0, volumeDisponivel),
//       unidade: 'L',
//       margemSeguranca: margemSeguranca
//     };
//   }
  
//   verificarDisponibilidade(dados, quantidadeSolicitada) {
//     const estoque = this.calcularEstoque(dados);
//     return {
//       temEstoque: estoque.disponivel >= quantidadeSolicitada,
//       disponivel: estoque.disponivel,
//       solicitado: quantidadeSolicitada,
//       unidade: 'L'
//     };
//   }
  
//   atualizarEstoque(dados, quantidade, operacao) {
//     const { tanques } = dados;
    
//     if (operacao === 'ENTRADA') {
//       // Adiciona no tanque com mais espaço disponível
//       const tanque = tanques.reduce((melhor, atual) => {
//         const espacoMelhor = melhor.capacidadeTotal - melhor.volumeAtual;
//         const espacoAtual = atual.capacidadeTotal - atual.volumeAtual;
//         return espacoAtual > espacoMelhor ? atual : melhor;
//       });
      
//       const espacoDisponivel = tanque.capacidadeTotal - tanque.volumeAtual;
//       const quantidadeAdicionar = Math.min(quantidade, espacoDisponivel);
//       tanque.volumeAtual += quantidadeAdicionar;
      
//       return {
//         sucesso: true,
//         processado: quantidadeAdicionar,
//         restante: quantidade - quantidadeAdicionar
//       };
//     }
    
//     if (operacao === 'SAIDA') {
//       // Remove do tanque com mais volume
//       const tanque = tanques.reduce((melhor, atual) => {
//         return atual.volumeAtual > melhor.volumeAtual ? atual : melhor;
//       });
      
//       if (tanque.volumeAtual >= quantidade) {
//         tanque.volumeAtual -= quantidade;
//         return {
//           sucesso: true,
//           processado: quantidade,
//           restante: 0
//         };
//       }
      
//       return {
//         sucesso: false,
//         mensagem: "Volume insuficiente no tanque"
//       };
//     }
//   }
// }

// /**
//  * Estratégia para controle de produtos por unidade
//  */
// class EstoqueProdutoStrategy extends EstoqueStrategy {
  
//   calcularEstoque(dados) {
//     const { produtos } = dados;
    
//     const quantidadeTotal = produtos.reduce((total, produto) => {
//       return total + produto.quantidade;
//     }, 0);
    
//     return {
//       total: quantidadeTotal,
//       disponivel: quantidadeTotal,
//       unidade: 'UN',
//       produtos: produtos.length
//     };
//   }
  
//   verificarDisponibilidade(dados, quantidadeSolicitada) {
//     const { produtos, idProduto } = dados;
//     const produto = produtos.find(p => p.id === idProduto);
    
//     if (!produto) {
//       return {
//         temEstoque: false,
//         disponivel: 0,
//         solicitado: quantidadeSolicitada,
//         mensagem: "Produto não encontrado"
//       };
//     }
    
//     return {
//       temEstoque: produto.quantidade >= quantidadeSolicitada,
//       disponivel: produto.quantidade,
//       solicitado: quantidadeSolicitada,
//       unidade: produto.unidade || 'UN'
//     };
//   }
  
//   atualizarEstoque(dados, quantidade, operacao) {
//     const { produtos, idProduto } = dados;
//     const produto = produtos.find(p => p.id === idProduto);
    
//     if (!produto) {
//       return {
//         sucesso: false,
//         mensagem: "Produto não encontrado"
//       };
//     }
    
//     if (operacao === 'ENTRADA') {
//       produto.quantidade += quantidade;
//       return {
//         sucesso: true,
//         quantidadeFinal: produto.quantidade
//       };
//     }
    
//     if (operacao === 'SAIDA') {
//       if (produto.quantidade >= quantidade) {
//         produto.quantidade -= quantidade;
//         return {
//           sucesso: true,
//           quantidadeFinal: produto.quantidade
//         };
//       }
      
//       return {
//         sucesso: false,
//         mensagem: "Quantidade insuficiente em estoque"
//       };
//     }
//   }
// }

// /**
//  * Context - Classe que usa as estratégias
//  */
// class GerenciadorEstoque {
//   constructor(strategy) {
//     this.strategy = strategy;
//   }
  
//   definirEstrategia(strategy) {
//     this.strategy = strategy;
//   }
  
//   calcularEstoque(dados) {
//     return this.strategy.calcularEstoque(dados);
//   }
  
//   verificarDisponibilidade(dados, quantidade) {
//     return this.strategy.verificarDisponibilidade(dados, quantidade);
//   }
  
//   atualizarEstoque(dados, quantidade, operacao) {
//     return this.strategy.atualizarEstoque(dados, quantidade, operacao);
//   }
// }

// // Exemplo de uso
// console.log('=== TESTE COMBUSTÍVEL ===');

// const dadosCombustivel = {
//   tanques: [
//     { id: 1, capacidadeTotal: 10000, volumeAtual: 8000 },
//     { id: 2, capacidadeTotal: 15000, volumeAtual: 5000 }
//   ]
// };

// const gerenciadorCombustivel = new GerenciadorEstoque(new EstoqueCombustivelStrategy());

// console.log('Estoque atual:', gerenciadorCombustivel.calcularEstoque(dadosCombustivel));
// console.log('Disponibilidade para 2000L:', gerenciadorCombustivel.verificarDisponibilidade(dadosCombustivel, 2000));
// console.log('Saída de 1000L:', gerenciadorCombustivel.atualizarEstoque(dadosCombustivel, 1000, 'SAIDA'));

// console.log('\n=== TESTE PRODUTOS ===');

// const dadosProdutos = {
//   produtos: [
//     { id: 1, nome: 'Óleo Motor', quantidade: 50, unidade: 'UN' },
//     { id: 2, nome: 'Filtro Ar', quantidade: 20, unidade: 'UN' }
//   ],
//   idProduto: 1
// };

// const gerenciadorProdutos = new GerenciadorEstoque(new EstoqueProdutoStrategy());

// console.log('Estoque atual:', gerenciadorProdutos.calcularEstoque(dadosProdutos));
// console.log('Disponibilidade para 10 unidades:', gerenciadorProdutos.verificarDisponibilidade(dadosProdutos, 10));
// console.log('Entrada de 25 unidades:', gerenciadorProdutos.atualizarEstoque(dadosProdutos, 25, 'ENTRADA'));

// // Exportar para uso em módulos
// if (typeof module !== 'undefined' && module.exports) {
//   module.exports = {
//     EstoqueStrategy,
//     EstoqueCombustivelStrategy,
//     EstoqueProdutoStrategy,
//     GerenciadorEstoque
//   };
// }

/**
 * Interface Strategy para cálculo de estoque
 */
class EstoqueStrategy {
  calcularEstoque(dados) {
    throw new Error("Método deve ser implementado pelas classes filhas");
  }

  verificarDisponibilidade(dados, quantidade) {
    throw new Error("Método deve ser implementado pelas classes filhas");
  }

  atualizarEstoque(dados, quantidade, operacao) {
    throw new Error("Método deve ser implementado pelas classes filhas");
  }
}

module.exports = EstoqueStrategy;
