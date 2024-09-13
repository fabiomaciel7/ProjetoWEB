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
exports.TaskService = void 0;
const TaskRepository_1 = require("../repositories/TaskRepository");
class TaskService {
    constructor() {
        this.taskRepository = new TaskRepository_1.TaskRepository();
    }
    createTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.taskRepository.create(data);
        });
    }
    getAllTasks(isAdmin, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isAdmin) {
                return this.taskRepository.findAll();
            }
            else {
                return this.taskRepository.findByUserId(userId);
            }
        });
    }
    getTaskById(id, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.findById(id);
            if (!task)
                return null;
            if (!isAdmin && task.userId !== userId) {
                throw new Error('Access denied');
            }
            return task;
        });
    }
    updateTask(id, data, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.getTaskById(id, userId, isAdmin);
            if (!task)
                throw new Error('Task not found or access denied');
            return this.taskRepository.update(id, data);
        });
    }
    deleteTask(id, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.getTaskById(id, userId, isAdmin);
            if (!task)
                throw new Error('Task not found or access denied');
            return this.taskRepository.delete(id);
        });
    }
    markTaskAsCompleted(id, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.getTaskById(id, userId, isAdmin);
            if (!task)
                throw new Error('Task not found or access denied');
            return this.taskRepository.markAsCompleted(id);
        });
    }
    getCompletedTasks(isAdmin, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isAdmin) {
                return this.taskRepository.findCompleted();
            }
            else {
                return this.taskRepository.findCompletedByUserId(userId);
            }
        });
    }
    getIncompleteTasks(isAdmin, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isAdmin) {
                return this.taskRepository.findIncomplete();
            }
            else {
                return this.taskRepository.findIncompleteByUserId(userId);
            }
        });
    }
    findAllGroupedByUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.taskRepository.findAllGroupedByUser();
        });
    }
}
exports.TaskService = TaskService;
