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

const corsOptions = {
  origin: [
    envVars.FRONTEND_URL,
    envVars.BETTER_AUTH_URL,
    'http://localhost:3000',
    'http://localhost:5000',
    // Production Vercel URLs
    'https://frontend-gamma-orcin-61.vercel.app',
    'https://backend-weld-theta-88.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
  exposedHeaders: ['Set-Cookie'],
};

// CORS must be FIRST — before Better Auth and all other middleware
app.use(cors(corsOptions));

// Handle preflight for all routes explicitly
app.options('/{*path}', cors(corsOptions));

// Better Auth handler — after CORS
app.all('/api/auth/{*path}', toNodeHandler(auth));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logger
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.path}`);
  next();
});

app.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Audit-X API is running' });
});

app.use('/api/v1', IndexRoutes);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
