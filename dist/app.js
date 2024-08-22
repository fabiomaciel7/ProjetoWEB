"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./config/server");
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const TaskRoutes_1 = __importDefault(require("./routes/TaskRoutes"));
const app = (0, server_1.createServer)();
app.use('/api', UserRoutes_1.default);
app.use('/api', AuthRoutes_1.default);
app.use('/api', TaskRoutes_1.default);
exports.default = app;
