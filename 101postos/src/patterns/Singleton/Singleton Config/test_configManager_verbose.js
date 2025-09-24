// test_configManager_verbose.js
const assert = require("assert");

// importa duas vezes para garantir que o módulo retorna a mesma instância
const cm1 = require("./configManager");
const cm2 = require("./configManager");

let step = 1;

function printStep(name) {
  console.log(`\nSTEP ${step++}: ${name}`);
}

function fail(err) {
  console.error("→ FALHOU");
  console.error(err && err.message ? err.message : err);
  if (err && err.stack) console.error(err.stack);
  process.exit(1);
}

try {
  console.log("Iniciando testes verbosos do ConfigManager...");

  printStep("Verificar que cm1 e cm2 são a mesma instância (singleton)");
  try {
    assert.strictEqual(cm1, cm2, "As duas imports devem retornar a mesma instância (singleton)");
    console.log("→ OK");
  } catch (err) { fail(err); }

  const categoria = "estabelecimento";
  const chaveNome = "nome";
  const valorNome = "Loja Teste S/A";
  const chaveCNPJ = "cnpj";
  const valorCNPJ = "00.000.000/0000-00";

  printStep("Garantir que categoria esteja limpa antes do teste (remover keys se existirem)");
  try {
    // Limpa manualmente se houver (usa métodos do próprio manager)
    // Como não há método de remover chave específica, sobrescrevemos a categoria com objeto vazio
    // (evite fazer isso em produção; aqui é só para testar)
    cm1.setConfig(categoria, chaveNome, undefined);
    cm1.setConfig(categoria, chaveCNPJ, undefined);
    // checa que retorno é undefined
    const nomeInicial = cm1.getConfig(categoria, chaveNome);
    const cnpjInicial = cm1.getConfig(categoria, chaveCNPJ);
    // aceitamos undefined/no value como "limpo"
    assert.strictEqual(nomeInicial, undefined);
    assert.strictEqual(cnpjInicial, undefined);
    console.log("→ OK");
  } catch (err) { fail(err); }

  printStep(`Setar config ${categoria}.${chaveNome} = "${valorNome}" usando cm1`);
  try {
    cm1.setConfig(categoria, chaveNome, valorNome);
    const got = cm1.getConfig(categoria, chaveNome);
    assert.strictEqual(got, valorNome, "getConfig deve retornar o valor setado");
    console.log("→ OK");
  } catch (err) { fail(err); }

  printStep(`Ler config ${categoria}.${chaveNome} usando cm2 (deve ver mesmo valor)`);
  try {
    const got2 = cm2.getConfig(categoria, chaveNome);
    assert.strictEqual(got2, valorNome, "cm2 deve ver o mesmo estado (singleton)");
    console.log("→ OK");
  } catch (err) { fail(err); }

  printStep(`Setar outra config ${categoria}.${chaveCNPJ} = "${valorCNPJ}" usando cm2`);
  try {
    cm2.setConfig(categoria, chaveCNPJ, valorCNPJ);
    const gotCnpj = cm1.getConfig(categoria, chaveCNPJ);
    assert.strictEqual(gotCnpj, valorCNPJ, "cm1 deve ver a cnpj setada por cm2");
    console.log("→ OK");
  } catch (err) { fail(err); }

  printStep("Verificar getCategoria e getAllConfigs refletem o estado correto");
  try {
    const cat = cm1.getCategoria(categoria);
    assert.strictEqual(cat[chaveNome], valorNome, "getCategoria deve conter nome");
    assert.strictEqual(cat[chaveCNPJ], valorCNPJ, "getCategoria deve conter cnpj");

    const all = cm2.getAllConfigs();
    // checamos apenas as partes relevantes
    assert.ok(all.estabelecimento, "getAllConfigs deve ter propriedade estabelecimento");
    assert.strictEqual(all.estabelecimento[chaveNome], valorNome);
    assert.strictEqual(all.estabelecimento[chaveCNPJ], valorCNPJ);
    console.log("→ OK");
  } catch (err) { fail(err); }

  printStep("Confirmar que a instância exportada está congelada (Object.freeze) - tentativa de adicionar propriedade direta");
  try {
    // tentativa de criar propriedade de topo na instância; Object.freeze deve impedir
    const beforeHasNew = Object.prototype.hasOwnProperty.call(cm1, "__newProp");
    try {
      cm1.__newProp = 12345;
    } catch (e) {
      // em modo strict isso lançaria; em outros modos pode falhar silenciosamente
    }
    const afterHasNew = Object.prototype.hasOwnProperty.call(cm1, "__newProp");
    // esperamos que a propriedade não exista (não foi adicionada)
    assert.strictEqual(beforeHasNew, false);
    assert.strictEqual(afterHasNew, false);
    console.log("→ OK (instância congelada não permite adicionar propriedade de topo)");
  } catch (err) { fail(err); }

  console.log("\nTodos os passos concluídos ✅");
  process.exit(0);
} catch (err) {
  fail(err);
}
