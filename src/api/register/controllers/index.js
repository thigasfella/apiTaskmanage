const db = require('../../../models/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

/**
 * Função assíncrona para inserir um novo usuário no banco de dados.
 *
 * @param {string} name - Nome do usuário.
 * @param {string} email - Email do usuário.
 * @param {string} password - Senha do usuário (já hashada).
 * @returns {Promise<number>} - Retorna a ID do usuário inserido.
 * @throws {Error} - Lança um erro se a inserção falhar.
 */
async function insertUser(name, email, password) {
    const userQuery = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id`;
    const userValues = [name, email, password];

    try {
        // Adiciona o usuário na tabela 'users'
        const userResult = await db.query(userQuery, userValues);
        return userResult.rows[0].id;
    } catch (err) {
        throw new Error(err.message);
    }
}

/**
 * Função assíncrona para buscar um usuário no banco de dados pelo email.
 *
 * @param {string} email - Email do usuário.
 * @returns {Promise<Object>} - Retorna o usuário encontrado ou undefined se não encontrado.
 * @throws {Error} - Lança um erro se a busca falhar.
 */
async function searchUser(email) {
    const userQuery = `SELECT id, email FROM users WHERE email = $1`;
    const userValue = [email];

    try {
        const userResult = await db.query(userQuery, userValue);
        return userResult.rows[0];
    } catch (err) {
        throw new Error(err.message);
    }
}

const authRegister = {
    /**
     * Manipula a requisição para registrar um novo usuário.
     *
     * @async
     * @param {Object} req - Objeto da requisição que deve conter o nome, email e senha do usuário no corpo.
     * @param {Object} res - Objeto da resposta para enviar ao cliente.
     * @returns {void} - Retorna uma resposta ao cliente indicando o sucesso ou falha do registro.
     */
    register: async (req, res) => {
        const { name, email, password } = req.body;

        try {
            // Verifica se o email já está cadastrado
            const user = await searchUser(email);

            if (!user) {
                // Se o email não estiver cadastrado, cria um novo usuário
                const hashedPassword = await bcrypt.hash(password, 10);
                await insertUser(name, email, hashedPassword);
                res.status(200).send('Cadastro realizado com sucesso!');
            } else {
                // Se o email já estiver cadastrado, retorna um erro de conflito
                res.status(409).send('Email já cadastrado!');
            }
        } catch (error) {
            // Envia uma mensagem de erro em caso de falha no processo de registro
            res.status(500).send('Erro ao realizar cadastro!');
        }
    }
};

// Exporta o controlador
module.exports = authRegister;