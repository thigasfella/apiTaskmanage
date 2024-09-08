const db = require('../../../models/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();


/**
 * Função assíncrona para adicionar uma nova tarefa ao banco de dados.
 *
 * @param {string} title - Título da tarefa a ser criada.
 * @param {string} description - Descrição da tarefa a ser criada.
 * @param {number} userId - ID do usuário que está criando a tarefa.
 * @returns {Promise<void>} - Retorna uma promessa que é resolvida quando a tarefa é adicionada.
 * @throws {Error} - Lança um erro se a inserção falhar.
 */
async function addTask(title, description, userId) {
    const taskQuery = `INSERT INTO tasks (name, description, id_user) VALUES ($1, $2, $3)`;
    const values = [title, description, userId];

    try {
        await db.query(taskQuery, values);
    } catch (error) {
        throw new Error(error.message);
    }
}

const createTask = {
    /**
     * Manipula a requisição para criar uma nova tarefa.
     *
     * @async
     * @param {Object} req - Objeto da requisição que deve conter o título e a descrição da tarefa no corpo, e o token JWT nos cookies.
     * @param {Object} res - Objeto da resposta para enviar ao cliente.
     * @returns {void} - Retorna uma resposta ao cliente indicando o sucesso ou falha da criação da tarefa.
     */
    createTask: async (req, res) => {
        try {
            const { title, description, token } = req.body;
            

            // Verifica se o token está presente
            if (!token) {
                return res.status(401).json({ error: `Token não fornecido ${JSON.stringify(req.cookies)}`});
            }

            // Verifica a validade do token e decodifica-o
            jwt.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ error: 'Token inválido' });
                }

                const userId = decoded.id;

                // Verifica se o ID do usuário foi decodificado corretamente
                if (!userId) {
                    return res.status(401).json({ error: 'Token inválido' });
                }

                // Adiciona a tarefa e retorna uma resposta apropriada
                addTask(title, description, userId)
                    .then(() => res.status(201).send('Tarefa criada com sucesso!'))
                    .catch((error) => res.status(500).send('Erro ao criar tarefa: ' + error.message));
            });
        } catch (error) {
            // Envia uma mensagem de erro em caso de falha no processamento da requisição
            res.status(500).send('Erro ao realizar cadastro: ' + error.message);
        }
    }
};

// Exporta o controlador
module.exports = createTask;