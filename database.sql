-- Criação de um banco de dados simples para cadastro de usuários

CREATE DATABASE cadastro_simples;
USE cadastro_simples;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -- Exemplo de inserção de usuário
-- INSERT INTO usuarios (nome, email, senha) VALUES
-- ('João Silva', 'joao@email.com', 'senha123');