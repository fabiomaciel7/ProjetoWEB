# Projeto da disciplina de Princípios de Desenvolvimento WEB

Task-Manager

# Tecnologias Utilizadas

- Node.js/TypeScript
- PostgreSQL
- Prisma CLI

# Instalação

1. Clone o Repositório

    ```bash
    git clone https://github.com/fabiomaciel7/ProjetoWEB.git
    ```

2. Acesse o Repositório com o projeto

    ```bash
    cd ProjetoWEB
    ```

3.  Instale as Dependências

    ```bash
    npm install
    ```

4. Configure a URL do banco de dados
  
    ```bash
    DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/seu_banco"
    ```

  Crie um arquivo .env na raiz do projeto e adicione a linha acima, substituindo seu_usuario, sua_senha e seu_banco pelas suas informações

5. Execute as migrações do Prisma para criar as tabelas no banco de dados:

    ```bash
    npx prisma migrate dev --name init
    ```

6. Inicie o servidor

    ```bash
    npm start
    ```

A API estará disponível em http://localhost:3000.

# Testes

Para rodar os testes:

```bash
npm run test
```

# Swagger

A documentação da API está disponível em [Swagger](https://app.swaggerhub.com/apis/FABIOMACIEL/Task-Manager/1.0.0) com todos os detalhes sobre os endpoints e os dados esperados.
