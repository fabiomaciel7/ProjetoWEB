"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const UserService_1 = require("./services/UserService");
const port = 3000;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connectDatabase)();
            const userService = new UserService_1.UserService();
            const hasAdmin = yield userService.hasAdmin();
            if (!hasAdmin) {
                yield userService.createDefaultAdmin();
                console.log('Admin padrão criado: admin@default.com');
            }
            app_1.default.listen(port, () => {
                console.log(`Servidor rodando em http://localhost:${port}`);
            });
        }
        catch (err) {
            console.error('Erro ao conectar ao banco de dados ou iniciar o servidor:', err);
        }
    });
}
startServer();
