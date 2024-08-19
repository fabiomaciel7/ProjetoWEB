"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = require("./controllers/UserController");
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("./controllers/AuthController");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
const userController = new UserController_1.UserController();
const authController = new AuthController_1.AuthController();
app.post('/user/create', (req, res) => userController.create(req, res));
app.post('/user/login', (req, res) => authController.login(req, res));
app.get('/validate-token', (req, res) => authController.validateToken(req, res));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'public', 'index.html'));
});
app.get('/hello', (req, res) => {
    res.send('Hello, world!');
});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
