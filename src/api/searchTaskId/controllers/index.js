const db = require('../../../models/db');
require('dotenv').config();
/**
 * Função assíncrona para buscar uma tarefa no banco de dados pelo ID.
 *
 * @param {number} id - O ID da tarefa a ser buscada.
 * @returns {Promise<Object>} - Retorna uma promessa que resolve para a tarefa encontrada.
 * @throws {Error} - Lança um erro se a consulta falhar.
 */
async function searchTask(id) {
    const taskQuery = `SELECT (name, description) FROM tasks WHERE id = $1`;
    const values = [id];

    try {
        const result = await db.query(taskQuery, values);
        return result.rows[0]; // Retorna a tarefa encontrada
    } catch (error) {
        throw new Error(error.message);
    }
}

const seachTaskById = {
    /**
     * Manipula a requisição para buscar uma tarefa específica pelo ID.
     *
     * @async
     * @param {Object} req - Objeto da requisição que deve conter o ID da tarefa nos parâmetros.
     * @param {Object} res - Objeto da resposta para enviar ao cliente.
     * @returns {void} - Retorna uma resposta ao cliente com a tarefa encontrada ou uma mensagem de erro.
     */
    taskId: async (req, res) => {
        try {
            const { id } = req.params; // Obtém o ID da tarefa dos parâmetros da requisição

            // Chama a função para buscar a tarefa e aguarda o resultado
            const task = await searchTask(id);

            if (task) {
                // Envia a tarefa encontrada como resposta em formato JSON
                res.status(200).json(task);
            } else {
                // Envia uma mensagem de erro se a tarefa não for encontrada
                res.status(404).send('Tarefa não encontrada');
            }
        } catch (error) {
            // Envia uma mensagem de erro em caso de falha na requisição
            res.status(500).send('Erro na requisição: ' + error.message);
        }
    }
}

// Exporta o controlador
module.exports = seachTaskById;
