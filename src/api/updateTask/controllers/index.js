const db = require('../../../models/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Atualiza uma tarefa no banco de dados.
 *
 * @param {number} id - ID da tarefa a ser atualizada.
 * @param {string} title - Novo título da tarefa.
 * @param {string} description - Nova descrição da tarefa.
 * @throws {Error} Lança um erro se a consulta ao banco de dados falhar.
 */
async function updateTaskInDb(id, title, description) {
    const taskQuery = `UPDATE tasks SET name = $2, description = $3 WHERE id = $1`;
    const values = [id, title, description];

    try {
        await db.query(taskQuery, values);
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Controlador para atualizar uma tarefa.
 *
 * @param {Object} req - Objeto da requisição.
 * @param {Object} res - Objeto da resposta.
 * @returns {void} Retorna uma resposta ao cliente.
 */
const updateTask = {
    uptTask: async (req, res) => {
        try {
            // Extrai dados do corpo da requisição
            const { id, title, description, token } = req.body;

            // Verifica se o token foi fornecido
            if (!token) {
                return res.status(401).send('Token não fornecido');
            }

            // Verifica a validade do token
            jwt.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).send('Token inválido');
                }

                // Extrai o ID do usuário do token decodificado
                const userId = decoded.id;

                if (!userId) {
                    return res.status(401).send('Token inválido');
                }

                // Atualiza a tarefa no banco de dados
                updateTaskInDb(id, title, description)
                    .then(() => res.status(200).send('Tarefa atualizada com sucesso!'))
                    .catch((error) => res.status(500).send('Erro ao atualizar tarefa: ' + error.message));
            });
        } catch (error) {
            res.status(500).send('Erro na requisição: ' + error.message);
        }
    }
}

// Exporta o controlador de atualização de tarefas
module.exports = updateTask;
