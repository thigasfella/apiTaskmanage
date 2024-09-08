const db = require('../../../models/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Controlador para buscar tarefas do usuário.
 *
 * @param {Object} req - Objeto da requisição.
 * @param {Object} res - Objeto da resposta.
 * @returns {void} Retorna uma resposta ao cliente com as tarefas do usuário ou uma mensagem de erro.
 */
const handler = {
    /**
     * Busca tarefas do usuário autenticado.
     *
     * @async
     * @param {Object} req - Objeto da requisição, que deve conter cookies com um token JWT.
     * @param {Object} res - Objeto da resposta para enviar ao cliente.
     * @returns {void} Retorna um JSON com a lista de tarefas ou uma mensagem de erro.
     */
    searchTasks: async (req, res) => {
        try {
             // Obtém o token do cabeçalho Authorization
             const authHeader = req.headers.authorization;
             const token = authHeader && authHeader.split(' ')[1]; // Remove o "Bearer" do cabeçalho
             
            // Verifica se o token foi fornecido
            if (!token) {
                return res.status(401).json({ error: 'Token não fornecido' });
            }

            // Verifica a validade do token
            jwt.verify(token, process.env.SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ error: 'Token inválido' });
                }

                // Extrai o ID do usuário do token decodificado
                const userId = decoded.id;
                if (!userId) {
                    return res.status(401).json({ error: 'Token inválido' });
                }

                try {
                    // Consulta o banco de dados para obter as tarefas do usuário
                    const result = await db.query('SELECT * FROM tasks WHERE id_user = $1', [userId]);
                    const tasks = result.rows;
                    
                    // Retorna as tarefas como JSON
                    res.status(200).json(tasks);
                } catch (dbError) {
                    console.log('Erro ao buscar tasks:', dbError);
                    res.status(500).json({ error: 'Erro ao buscar tasks' });
                }
            });
        } catch (error) {
            console.log('Erro ao buscar tasks:', error);
            res.status(500).json({ error: 'Erro ao buscar tasks' });
        }
    }
};

// Exporta o controlador
module.exports = handler;
