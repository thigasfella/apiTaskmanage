const express = require('express');
const authRouter = require('./routes');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Cria uma instância do aplicativo Express
const app = express();
// Configura o Express para confiar nos proxies
app.set('trust proxy', 1);

// Middleware para parsing de cookies
app.use(cookieParser());

// Configuração do CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: '*', // URL do frontend permitido
    methods: 'GET, POST, PUT, DELETE', // Métodos HTTP permitidos
    allowedHeaders: 'Content-Type, Authorization', // Cabeçalhos permitidos
    credentials: true, // Permite envio de cookies
}));


// Middleware de segurança com Helmet (é importante colocar depois do CORS)
app.use(helmet());

// Configuração do rate limiting para prevenir ataques de força bruta
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Janela de tempo de 15 minutos
    max: 100, // Limita cada IP a 100 requisições por janela
});
app.use(limiter);

// Middleware para parsing de JSON no corpo das requisições
app.use(express.json());

// Define as rotas para a API
app.use('/api', authRouter);

// Porta na qual o servidor irá escutar
const PORT = process.env.PORT || 3001;

// Inicia o servidor e exibe uma mensagem no console
app.listen(PORT, () => {
    console.log(`Servidor da API rodando em localhost:${PORT}`);
});
