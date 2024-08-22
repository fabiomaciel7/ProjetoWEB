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
    getAllTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.taskRepository.findAll();
        });
    }
    getTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.taskRepository.findById(id);
        });
    }
    updateTask(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.taskRepository.update(id, data);
        });
    }
    deleteTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.taskRepository.delete(id);
        });
    }
    markTaskAsCompleted(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.taskRepository.markAsCompleted(id);
        });
    }
    getCompletedTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.taskRepository.findCompleted();
        });
    }
    getIncompleteTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.taskRepository.findIncomplete();
        });
    }
}
exports.TaskService = TaskService;
