import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    res.end();
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  // Anthropic API errors
  if (err.message?.includes("anthropic") || err.message?.includes("API")) {
    res.status(502).json({
      status: "error",
      message: "AI service unavailable. Try again shortly.",
    });
    return;
  }

  console.error("[Unhandled Error]", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error.",
  });
}
