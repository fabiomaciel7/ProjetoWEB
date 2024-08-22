import { TaskRepository } from '../repositories/TaskRepository';
import { TaskDto } from '../dtos/TaskDto';

export class TaskService {
    private taskRepository: TaskRepository;

    constructor() {
        this.taskRepository = new TaskRepository();
    }

    async createTask(data: Omit<TaskDto, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) { 
        return this.taskRepository.create(data);
    }

    async getAllTasks() {
        return this.taskRepository.findAll();
    }

    async getTaskById(id: number) {
        return this.taskRepository.findById(id);
    }

    async updateTask(id: number, data: Partial<Omit<TaskDto, 'id' | 'completed' | 'createdAt' | 'updatedAt'>>) {
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
}
