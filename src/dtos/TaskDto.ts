export interface TaskDto {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    dueDate?: Date;
}
