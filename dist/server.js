"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { PrismaClient } = require("@prisma/client");

const app = express();
const port = 3000;

// Inicializa o Prisma Client
const prisma = new PrismaClient();

app.use(express.json());

// Configura o diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Usando as rotas de autenticação e tarefas
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Rota para limpar todos os usuários (apenas para fins de teste, não usar em produção)
app.delete('/clear-users', async (req, res) => {
    await prisma.user.deleteMany();
    res.status(204).send();
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Manter o Prisma Client desconectado após o uso
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
