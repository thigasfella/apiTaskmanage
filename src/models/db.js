// Importa o módulo Pool do pacote 'pg' para trabalhar com o banco de dados PostgreSQL
const { Pool } = require('pg')

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config()

// Cria uma nova instância do Pool para gerenciar conexões com o banco de dados PostgreSQL
const client = new Pool({
    connectionString: process.env.POSTGRES_URL,  // Usa a URL completa de conexão do banco de dados
    ssl: {
        rejectUnauthorized: false  // Aceita conexões SSL
    }
})

client.connect((err) => {
    if (err) throw err
    console.log('Connect to PostgreSQL successfully!')
})
// Exporta a instância do Pool para ser usada em outras partes da aplicação
module.exports = client
