import { TaskRepository } from '../repositories/TaskRepository';

export class TaskService {
    private taskRepository: TaskRepository;

    constructor() {
        this.taskRepository = new TaskRepository();
    }

    async createTask(data: { title: string; description?: string; userId: number; dueDate?: Date }) {
        return this.taskRepository.create(data);
    }

    async getAllTasks() {
        return this.taskRepository.findAll();
    }

    async getTaskById(id: number) {
        return this.taskRepository.findById(id);
    }

    async updateTask(id: number, data: { title?: string; description?: string; dueDate?: Date }) {
        return this.taskRepository.update(id, data);
    }

    async deleteTask(id: number) {
        return this.taskRepository.delete(id);
    }

    async markTaskAsCompleted(id: number) {
        return this.taskRepository.markAsCompleted(id);
    }

    async getCompletedTasks() {
        return this.taskRepository.findCompleted();
    }

    async getIncompleteTasks() {
        return this.taskRepository.findIncomplete();
    }

    async getTasksByUserId(userId: number) {
        return this.taskRepository.findByUserId(userId);
    }
}
