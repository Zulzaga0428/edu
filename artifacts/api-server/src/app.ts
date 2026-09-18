import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import type { NextFunction, Request, Response } from "express";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

if (isProduction && allowedOrigins.length === 0) {
  throw new Error(
    "CORS_ORIGINS is required in production and must contain the frontend origin.",
  );
}

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || !isProduction || allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
        callback(null, true);
        return;
      }

      const error = new Error("Origin is not allowed by CORS.") as Error & {
        status: number;
      };
      error.status = 403;
      callback(error);
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use(
  (
    error: Error & { status?: number },
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const status = error.status ?? 500;
    req.log.warn({ err: error, status }, "Request rejected");
    res.status(status).json({
      error: status === 403 ? "Origin is not allowed." : "Internal server error.",
    });
  },
);

export default app;
