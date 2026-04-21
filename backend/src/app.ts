import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import { toNodeHandler } from "better-auth/node";
import { config } from "./config";
import { ApiError } from "./shared/ApiError";
import { auth } from "./modules/auth/auth.utils";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import companyRoutes from "./modules/company/company.routes";
import financialDataRoutes from "./modules/financial-data/financialData.routes";
import financialYearRoutes from "./modules/financial-year/financialYear.routes";
import reviewRoutes from "./modules/review/review.routes";
import { globalErrorHandler } from "./middleware/error.middleware";

export const app = express();

app.use(helmet());

app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "..", config.UPLOAD_DIR)));

app.use("/api/auth", toNodeHandler(auth.handler));

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/companies", companyRoutes);

app.use("/api/v1/financial-data", financialDataRoutes);

app.use("/api/v1/companies/:companyId/years", financialYearRoutes);

app.use("/api/v1/reviews", reviewRoutes);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound("Route not found"));
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  globalErrorHandler(err, _req, res, _next);
});