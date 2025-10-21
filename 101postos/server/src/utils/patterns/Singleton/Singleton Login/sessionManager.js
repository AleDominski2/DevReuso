// Declaração da classe que vai gerir sessões ativas (userId -> sessionId)
class SessionManager {
  // Construtor da classe
  constructor() {
    // Se já existe uma instância salva na propriedade estática, retorna ela
    // Isso impede que `new SessionManager()` crie uma nova instância
    if (SessionManager.instance) {
      return SessionManager.instance;
    }

    // Mapa que guarda sessões ativas: chave = userId, valor = sessionId
    this.activeSessions = new Map(); // userId -> sessionId

    // Guarda a instância atual na propriedade estática da classe
    SessionManager.instance = this;
  }

  // Tenta registrar um login. Se o usuário já tiver sessão ativa, lança erro.
  login(userId, sessionId) {
    // Verifica se já existe sessão para esse usuário
    if (this.activeSessions.has(userId)) {
      // Lança erro para indicar que já está logado em outro lugar
      throw new Error("Usuário já está logado em outro lugar!");
    }
    // Se não houver, registra a sessão
    this.activeSessions.set(userId, sessionId);
    return true; // retorna true para indicar sucesso
  }

  // Força o login: substitui qualquer sessão anterior (sem lançar erro)
  forceLogin(userId, sessionId) {
    // Substitui (ou cria) a sessão para o userId
    this.activeSessions.set(userId, sessionId);
    return true;
  }

  // Remove a sessão do usuário (logout)
  logout(userId) {
    this.activeSessions.delete(userId);
  }

  // Retorna true se o usuário estiver logado
  isLoggedIn(userId) {
    return this.activeSessions.has(userId);
  }

  // Retorna o sessionId associado ao userId (ou undefined se não houver)
  getSession(userId) {
    return this.activeSessions.get(userId);
  }
}

// Cria uma instância única (eager singleton)
const instance = new SessionManager();

// Impede alterações acidentais na instância exportada (não obrigatório, mas ajuda)
Object.freeze(instance);

// Exporta a **mesma** instância para qualquer arquivo que der `require` neste módulo.
// Em Node.js, módulos são cacheados: quem der require("./sessionManager") receberá
// sempre essa mesma referência `instance`.
module.exports = instance;
