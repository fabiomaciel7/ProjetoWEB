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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const TaskService_1 = require("../services/TaskService");
const TaskCreateValidation_1 = require("../validation/TaskCreateValidation");
const TaskUpdateValidation_1 = require("../validation/TaskUpdateValidation");
class TaskController {
    constructor() {
        this.taskService = new TaskService_1.TaskService();
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!request.userId) {
                    return response.status(400).json({ message: 'ID do usuário é obrigatório' });
                }
                const { error, value } = TaskCreateValidation_1.createTaskSchema.validate(request.body, { abortEarly: false });
                if (error) {
                    return response.status(400).json({
                        message: 'Erro de validação',
                        details: error.details.map(detail => detail.message),
                    });
                }
                const taskData = value;
                taskData.userId = request.userId;
                const task = yield this.taskService.createTask(taskData);
                return response.status(201).json(task);
            }
            catch (error) {
                console.error('Erro ao criar tarefa:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    getAll(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof request.userId === 'undefined' || typeof request.isAdmin === 'undefined') {
                    return response.status(400).json({ message: 'User ID and admin status are required' });
                }
                const tasks = yield this.taskService.getAllTasks(request.isAdmin, request.userId);
                return response.json(tasks);
            }
            catch (error) {
                console.error('Erro ao obter tarefas:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    getAllTasksGroupedByUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!request.isAdmin) {
                    return response.status(403).json({ message: 'Access denied' });
                }
                const tasksGrouped = yield this.taskService.findAllGroupedByUser();
                return response.json(tasksGrouped);
            }
            catch (error) {
                console.error('Erro ao obter tarefas agrupadas por usuário:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    getById(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof request.userId === 'undefined' || typeof request.isAdmin === 'undefined') {
                    return response.status(400).json({ message: 'ID do usuário e status de administrador são obrigatórios' });
                }
                const { id } = request.params;
                const task = yield this.taskService.getTaskById(parseInt(id), request.userId, request.isAdmin);
                if (!task) {
                    return response.status(404).json({ message: 'Task não encontrada' });
                }
                return response.json(task);
            }
            catch (error) {
                console.error('Erro ao obter tarefa por ID:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof request.userId === 'undefined' || typeof request.isAdmin === 'undefined') {
                    return response.status(400).json({ message: 'ID do usuário e status de administrador são obrigatórios' });
                }
                const { error, value } = TaskUpdateValidation_1.updateTaskSchema.validate(request.body, { abortEarly: false });
                if (error) {
                    return response.status(400).json({
                        message: 'Erro de validação',
                        details: error.details.map(detail => detail.message),
                    });
                }
                const { id } = request.params;
                const taskData = value;
                const task = yield this.taskService.updateTask(parseInt(id), taskData, request.userId, request.isAdmin);
                return response.json(task);
            }
            catch (error) {
                console.error('Erro ao atualizar tarefa:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof request.userId === 'undefined' || typeof request.isAdmin === 'undefined') {
                    return response.status(400).json({ message: 'ID do usuário e status de administrador são obrigatórios' });
                }
                const { id } = request.params;
                yield this.taskService.deleteTask(parseInt(id), request.userId, request.isAdmin);
                return response.status(204).send();
            }
            catch (error) {
                console.error('Erro ao deletar tarefa:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    markAsCompleted(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const { completed } = request.body; // Captura o status do checkbox do front-end
                const userId = request.userId;
                const isAdmin = request.isAdmin;
                if (typeof userId === 'undefined' || typeof isAdmin === 'undefined') {
                    return response.status(400).json({ message: 'ID do usuário e status de administrador são obrigatórios' });
                }
                const task = yield this.taskService.markTaskAsCompleted(parseInt(id), userId, isAdmin, completed);
                return response.json(task);
            }
            catch (error) {
                console.error('Erro ao atualizar status da tarefa:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    getCompletedTasks(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof request.userId === 'undefined' || typeof request.isAdmin === 'undefined') {
                    return response.status(400).json({ message: 'ID do usuário e status de administrador são obrigatórios' });
                }
                const tasks = yield this.taskService.getCompletedTasks(request.isAdmin, request.userId);
                return response.json(tasks);
            }
            catch (error) {
                console.error('Erro ao obter tarefas concluídas:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    getIncompleteTasks(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof request.userId === 'undefined' || typeof request.isAdmin === 'undefined') {
                    return response.status(400).json({ message: 'ID do usuário e status de administrador são obrigatórios' });
                }
                const tasks = yield this.taskService.getIncompleteTasks(request.isAdmin, request.userId);
                return response.json(tasks);
            }
            catch (error) {
                console.error('Erro ao obter tarefas incompletas:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
}
exports.TaskController = TaskController;
