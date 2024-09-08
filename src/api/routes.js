const express = require('express');
const authRegister = require('./register/controllers/index');
const authLogin = require('./login/controllers');
const handler = require('./searchTasks/controllers');
const createTask = require('./createTasks/controllers');
const deleteTask = require('./deleteTask/controllers');
const updateTask = require('./updateTask/controllers');
const seachTaskById = require('./searchTaskId/controllers');
const completeTask = require('./completionTask/controllers');

// Cria uma instância do roteador Express
const routes = express.Router();

// Rota para registro de usuário
// Método: POST
// Endpoint: /register
// Controlador: authRegister.register
// Descrição: Registra um novo usuário.
routes.post('/register', authRegister.register);

// Rota para login de usuário
// Método: POST
// Endpoint: /login
// Controlador: authLogin.login
// Descrição: Realiza o login do usuário e gera um token de autenticação.
routes.post('/login', authLogin.login);

// Rota para criar uma nova tarefa
// Método: POST
// Endpoint: /createtask
// Controlador: createTask.createTask
// Descrição: Cria uma nova tarefa.
routes.post('/createtask', createTask.createTask);

// Rota para deletar uma tarefa
// Método: DELETE
// Endpoint: /deleteTask
// Controlador: deleteTask.deleteTask
// Descrição: Remove uma tarefa existente.
routes.delete('/deleteTask', deleteTask.deleteTask);

// Rota para atualizar uma tarefa
// Método: PUT
// Endpoint: /updateTask
// Controlador: updateTask.uptTask
// Descrição: Atualiza uma tarefa existente.
routes.put('/updateTask', updateTask.uptTask);

// Rota para atualizar uma tarefa
// Método: PUT
// Endpoint: /completionTask
// Controlador: completeTask.complete
// Descrição: Marca uma tarefa como check.
routes.put('/completionTask', completeTask.complete)

// Rota para buscar todas as tarefas
// Método: GET
// Endpoint: /tasks
// Controlador: handler.searchTasks
// Descrição: Retorna todas as tarefas existentes.
routes.get('/tasks', handler.searchTasks);

// Rota para buscar uma tarefa pelo ID
// Método: GET
// Endpoint: /task/:id
// Controlador: seachTaskById.taskId
// Descrição: Retorna uma tarefa específica com base no ID fornecido.
routes.get('/task/:id', seachTaskById.taskId);

// Exporta o roteador para uso em outros arquivos
module.exports = routes;
