const db = require('../../../models/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Função para atualizar o status de conclusão de uma tarefa no banco de dados
async function updateTaskCompletion(iscompleted, id) {
    const query = `UPDATE tasks SET iscompleted = $1 WHERE id = $2 RETURNING *`; // Query SQL para atualizar o campo 'iscompleted' e retornar a tarefa atualizada
    const values = [iscompleted, id]; // Array de valores para substituir os placeholders ($1 e $2) na query

    try {
        const result = await db.query(query, values); // Executa a query no banco de dados
        return result.rows[0]; // Retorna a primeira linha (tarefa atualizada) do resultado
    } catch (error) {
        throw new Error(error.message); // Lança um erro caso a execução da query falhe
    }
}

const completeTask = {
    // Função assíncrona que lida com a conclusão de uma tarefa
    complete: async (req, res) => {
        try {
            const { iscompleted, id, token } = req.body; // Extrai os dados 'iscompleted' e 'id' do corpo da requisição

            if (!token) {
                return res.status(401).json({ error: 'Token não fornecido' }); // Retorna erro 401 se o token não for fornecido
            }

            // Verifica o token utilizando o segredo armazenado nas variáveis de ambiente
            jwt.verify(token, process.env.SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ error: 'Token inválido' }); // Retorna erro 401 se o token for inválido
                }

                const userId = decoded.id; // Extrai o ID do usuário decodificado a partir do token

                if (!userId) {
                    return res.status(401).json({ error: 'Token inválido' }); // Retorna erro se o ID do usuário não estiver presente no token
                }

                try {
                    const updatedTask = await updateTaskCompletion(iscompleted, id); // Atualiza o status da tarefa
                    res.status(200).json(updatedTask); // Responde com a tarefa atualizada em caso de sucesso
                } catch (error) {
                    res.status(500).json({ error: 'Erro ao concluir tarefa: ' + error.message }); // Retorna erro 500 se ocorrer um erro durante a atualização da tarefa
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro na requisição: ' + error.message }); // Retorna erro 500 se ocorrer um erro na requisição
        }
    }
};

module.exports = completeTask;
