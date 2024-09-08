const db = require("../../../models/db")
const jwt = require("jsonwebtoken") 
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")
require('dotenv').config();

/**
 * Função assíncrona para buscar um usuário no banco de dados pelo email.
 *
 * @param {string} email - Email do usuário.
 * @returns {Promise<Object>} - Retorna o usuário encontrado ou undefined se não encontrado.
 * @throws {Error} - Lança um erro se a busca falhar.
 */
async function searchUser(email) {
    const query = `SELECT id, email, password FROM users WHERE email = $1`;
    const value = [email];

    try {
        const result = await db.query(query, value);
        return result.rows[0];
    } catch (err) {
        throw new Error(err.message);
    }
}

const authLogin = {
    /**
     * Manipula a requisição de login e envia um token de autenticação por e-mail.
     *
     * @async
     * @param {Object} req - Objeto da requisição que deve conter o email e a senha no corpo.
     * @param {Object} res - Objeto da resposta para enviar ao cliente.
     * @returns {void} - Retorna uma resposta ao cliente indicando o sucesso ou falha do login.
     */
    login: async (req, res) => {
        const { email, password } = req.body;
        
        try {
            // Busca o usuário pelo e-mail
            const user = await searchUser(email);

            // Verifica se o usuário existe e a senha fornecida corresponde à senha armazenada
            if (user && await bcrypt.compare(password, user.password)) {
                // Gera um token JWT com o ID do usuário
                const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '1d' });
                
                // Configura o transportador de e-mail usando o serviço SMTP do Gmail
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    auth: {
                        user: "thiagolpssouza@gmail.com",
                        pass: process.env.PASSWORD_EMAIL
                    }
                });

                // Envia o e-mail com o token de autenticação
                transporter.sendMail({
                    from: "thiagolpssouza@gmail.com",
                    to: email,
                    subject: "Token para autenticação no TaskManage",
                    text: `Insira este token para acessar a plataforma: ${token}`
                })
                .then(() => {
                    res.status(200).json({ message: "Token enviado no email!", token });
                })
                .catch(err => {
                    console.error('Erro ao enviar o e-mail:', err);
                    res.status(500).send("Erro ao enviar o e-mail!");
                });
                
            } else {
                // Se as credenciais forem inválidas, retorna um erro de autorização
                res.status(401).send("Credenciais Inválidas!");
            }
        } catch (error) {
            // Envia uma mensagem de erro em caso de falha no processo de login
            res.status(500).send(error.message);
        }
    }
};

// Exporta o controlador
module.exports = authLogin;