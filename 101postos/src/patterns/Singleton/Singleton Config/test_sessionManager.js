// test_sessionManager_verbose.js
const assert = require("assert");
const sm1 = require("./sessionManager");
const sm2 = require("./sessionManager"); // deve ser a mesma instância

let stepNumber = 1;

async function step(name, fn) {
  console.log(`\nSTEP ${stepNumber++}: ${name}`);
  try {
    await fn();
    console.log("→ OK");
  } catch (err) {
    console.error("→ FALHOU");
    console.error("Erro:", err && err.message ? err.message : err);
    console.error(err && err.stack ? err.stack : "");
    process.exit(1); // encerra com erro para CI / scripts
  }
}

(async () => {
  console.log("Iniciando testes verbosos do SessionManager...");

  await step("Verificar que sm1 e sm2 são a mesma instância (singleton)", () => {
    assert.strictEqual(sm1, sm2, "As duas imports devem retornar a mesma instância (singleton)");
  });

  const userId = "user123";
  const sessionA = "sessA";

  await step("Garantir usuário limpo (logout antes do teste)", () => {
    sm1.logout(userId);
    assert.strictEqual(sm1.isLoggedIn(userId), false, "Usuário não deve estar logado inicialmente");
  });

  await step(`Fazer login do usuário ${userId} com sessionId ${sessionA}`, () => {
    const res = sm1.login(userId, sessionA);
    assert.strictEqual(res, true, "login deve retornar true");
    assert.strictEqual(sm1.isLoggedIn(userId), true, "Usuário deve estar logado");
    assert.strictEqual(sm1.getSession(userId), sessionA, "sessionId deve bater");
  });

  await step("Tentar logar novamente com mesmo usuário (deve lançar erro)", () => {
    let threw = false;
    try {
      sm2.login(userId, "sessB");
    } catch (err) {
      threw = true;
      assert.strictEqual(err.message, "Usuário já está logado em outro lugar!");
    }
    if (!threw) throw new Error("Esperava erro ao logar duas vezes, mas não ocorreu");
  });

  await step("Fazer logout e confirmar que usuário ficou deslogado", () => {
    sm1.logout(userId);
    assert.strictEqual(sm1.isLoggedIn(userId), false, "Usuário deve estar deslogado após logout");
  });

  await step("Fazer login de novo com novo sessionId e checar atualização", () => {
    const res2 = sm2.login(userId, "sessC");
    assert.strictEqual(res2, true, "Login após logout deve funcionar");
    assert.strictEqual(sm1.getSession(userId), "sessC", "sessionId deve ter sido atualizado para sessC");
  });

  console.log("\nTodos os passos concluídos ✅");
  process.exit(0);
})();
