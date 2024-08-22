export interface SessionDto {
    id: number;
    token: string;
    userId: number;
    expiresAt: Date;
}