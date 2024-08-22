"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const port = 3000;
(0, database_1.connectDatabase)()
    .then(() => {
    app_1.default.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
})
    .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
});
