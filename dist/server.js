"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const TaskRoutes_1 = __importDefault(require("./routes/TaskRoutes"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.use('/api', UserRoutes_1.default);
app.use('/api', TaskRoutes_1.default);
app.get('/hello', (req, res) => {
    res.send('Hello, world!');
});
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'public', 'index.html'));
});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
