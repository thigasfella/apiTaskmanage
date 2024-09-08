# Task Management API

Esta é a API para o projeto Task Management, que gerencia tarefas de usuários autenticados. A API permite que os usuários façam login, criem, leiam, atualizem e excluam tarefas. A autenticação é realizada com JWT (JSON Web Tokens), e as requisições para o servidor são protegidas por middleware de autenticação.

## Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- JWT (JSON Web Token)
- CORS
- Helmet
- Rate Limiting

## Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/thigasfella/apiTaskmanage.git
    ```

2. Acesse o diretório do projeto:
    ```bash
    cd apiTaskManagement
    ```

3. Instale as dependências:
    ```bash
    npm install
    ```

4. Configure as variáveis de ambiente no arquivo `.env`:
    ```bash
    POSTGRES_URL=UrlDoSeuBancoDeDados
    ```

## Executando o Servidor

1. Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

2. O servidor estará disponível em `http://localhost:3001`.

## Rotas da API

### Autenticação

- **POST /api/login**: Realiza o login e retorna um token JWT.
    - Corpo da requisição:
        ```json
        {
            "email": "usuario@example.com",
            "password": "suaSenha"
        }
        ```
    - Resposta:
        ```json
        {
            "token": "tokenJWT"
        }
        ```

### Tarefas

- **GET /api/tasks**: Retorna as tarefas do usuário autenticado.
- **POST /api/createtask**: Cria uma nova tarefa para o usuário autenticado.
    - Corpo da requisição:
        ```json
        {
            "title": "Título da Tarefa",
            "description": "Descrição da tarefa"
        }
        ```
- **PUT /api/tasks/:id**: Atualiza uma tarefa existente.
    - Corpo da requisição:
        ```json
        {
            "title": "Novo título",
            "description": "Nova descrição"
        }
        ```
- **DELETE /api/tasks/:id**: Exclui uma tarefa.

## Middleware de Segurança

- **CORS**: Controla quais origens têm permissão para acessar a API.
- **Helmet**: Configurações de segurança para proteger a API contra várias ameaças da web.
- **Rate Limiting**: Limita o número de requisições por IP para prevenir ataques de força bruta.
