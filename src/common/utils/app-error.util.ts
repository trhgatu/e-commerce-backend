export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public cause?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    isOperational = true,
    cause?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.cause = cause;

    Error.captureStackTrace(this);
  }
}
