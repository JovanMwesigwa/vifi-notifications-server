import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

export function apiAuth(req: Request, _res: Response, next: NextFunction) {
  if (!env.API_KEY) {
    return next(
      new AppError("API key not configured", {
        statusCode: 503,
        code: "SERVICE_UNAVAILABLE",
      })
    );
  }

  const header = req.header("authorization");
  const apiKeyHeader = req.header("x-api-key");

  const token =
    (header && header.toLowerCase().startsWith("bearer ")
      ? header.slice(7).trim()
      : undefined) || apiKeyHeader;

  if (!token) {
    return next(
      new AppError("Missing API credentials", {
        statusCode: 401,
        code: "UNAUTHORIZED",
      })
    );
  }
  if (token !== env.API_KEY) {
    return next(
      new AppError("Invalid API credentials", {
        statusCode: 403,
        code: "FORBIDDEN",
      })
    );
  }
  next();
}
