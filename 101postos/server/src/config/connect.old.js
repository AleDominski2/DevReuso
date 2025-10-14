require('dotenv').config({ path: './src/config/.env' });
const mysql = require('mysql2');

// Atualize a configuração da conexão para usar variáveis de ambiente
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

function connectDB() {
    connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

}

module.exports = connectDB;

