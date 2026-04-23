import { toNodeHandler } from 'better-auth/node';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { envVars } from './app/config/env.js';
import { auth } from './app/lib/auth.js';
import { globalErrorHandler } from './app/middleware/globalErrorHandler.js';
import { notFound } from './app/middleware/notFound.js';
import { IndexRoutes } from './app/routes/index.js';

const app: Application = express();

// Better Auth handler (must be before body parsers)
app.all('/api/auth/*', toNodeHandler(auth));

app.use(cors({
  origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Audit-X API is running' });
});

app.use('/api/v1', IndexRoutes);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
