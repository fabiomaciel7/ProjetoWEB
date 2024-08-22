import express, { Application } from 'express';
import cors from 'cors';

export function createServer(): Application {
    const app = express();

    app.use(cors());
    app.use(express.json());

    return app;
}