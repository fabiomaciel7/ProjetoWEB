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

    async getAllTasks(isAdmin: boolean, userId: number) {
        if (isAdmin) {
            return this.taskRepository.findAll();
        } else {
            return this.taskRepository.findByUserId(userId);
        }
    }

    async getTaskById(id: number, userId: number, isAdmin: boolean) {
        const task = await this.taskRepository.findById(id);
        if (!task) return null;

        if (!isAdmin && task.userId !== userId) {
            throw new Error('Access denied');
        }
        return task;
    }

    async updateTask(id: number, data: Partial<Omit<TaskDto, 'id' | 'completed' | 'createdAt' | 'updatedAt'>>, userId: number, isAdmin: boolean) {
        const task = await this.getTaskById(id, userId, isAdmin);
        if (!task) throw new Error('Task not found or access denied');
        
        return this.taskRepository.update(id, data);
    }

    async deleteTask(id: number, userId: number, isAdmin: boolean) {
        const task = await this.getTaskById(id, userId, isAdmin);
        if (!task) throw new Error('Task not found or access denied');

        return this.taskRepository.delete(id);
    }

    async markTaskAsCompleted(id: number, userId: number, isAdmin: boolean) {
        const task = await this.getTaskById(id, userId, isAdmin);
        if (!task) throw new Error('Task not found or access denied');

        return this.taskRepository.markAsCompleted(id);
    }

    async getCompletedTasks(isAdmin: boolean, userId: number) {
        if (isAdmin) {
            return this.taskRepository.findCompleted();
        } else {
            return this.taskRepository.findCompletedByUserId(userId);
        }
    }

    async getIncompleteTasks(isAdmin: boolean, userId: number) {
        if (isAdmin) {
            return this.taskRepository.findIncomplete();
        } else {
            return this.taskRepository.findIncompleteByUserId(userId);
        }
    }

    async findAllGroupedByUser() {
        return this.taskRepository.findAllGroupedByUser();
    }
}

