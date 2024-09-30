import express, { Application } from 'express';

export function createServer(): Application {
    const app = express();

    app.use(express.json());

    return app;
}