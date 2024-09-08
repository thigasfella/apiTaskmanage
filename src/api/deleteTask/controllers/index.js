const db = require('../../../models/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Função assíncrona para deletar uma tarefa do banco de dados.
 *
 * @param {number} id - ID da tarefa a ser deletada.
 * @param {number} userId - ID do usuário que solicita a exclusão da tarefa.
 * @returns {Promise<void>} - Retorna uma promessa que é resolvida quando a tarefa é deletada.
 * @throws {Error} - Lança um erro se a exclusão falhar.
 */
async function delTask(id, userId) {
    const taskQuery = `DELETE FROM tasks WHERE id = $1 AND id_user = $2`;
    const values = [id, userId];

    try {
        await db.query(taskQuery, values);
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteTask = {
    /**
     * Manipula a requisição para excluir uma tarefa.
     *
     * @async
     * @param {Object} req - Objeto da requisição que deve conter o ID da tarefa no corpo e o token JWT nos cookies.
     * @param {Object} res - Objeto da resposta para enviar ao cliente.
     * @returns {void} - Retorna uma resposta ao cliente indicando o sucesso ou falha da exclusão.
     */
    deleteTask: async (req, res) => {
        try {
            const { id, token } = req.body;

            // Verifica se o token está presente
            if (!token) {
                return res.status(401).json({ error: 'Token não fornecido' });
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

                // Deleta a tarefa e retorna uma resposta apropriada
                delTask(id, userId)
                    .then(() => res.status(200).send('Tarefa deletada com sucesso!'))
                    .catch((error) => res.status(500).send('Erro ao deletar tarefa: ' + error.message));
            });
        } catch (error) {
            // Envia uma mensagem de erro em caso de falha no processamento da requisição
            res.status(500).send('Erro ao processar requisição: ' + error.message);
        }
    }
};

// Exporta o controlador
module.exports = deleteTask;