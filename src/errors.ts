export class OpenAlexError extends Error {
  readonly statusCode: number;
  readonly url: string;

  constructor(message: string, statusCode: number, url: string) {
    super(message);
    this.name = "OpenAlexError";
    this.statusCode = statusCode;
    this.url = url;
  }
}

export class BadRequestError extends OpenAlexError {
  constructor(message: string, statusCode: number, url: string) {
    super(message, statusCode, url);
    this.name = "BadRequestError";
  }
}

export class ForbiddenError extends OpenAlexError {
  constructor(message: string, statusCode: number, url: string) {
    super(message, statusCode, url);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends OpenAlexError {
  constructor(message: string, statusCode: number, url: string) {
    super(message, statusCode, url);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends OpenAlexError {
  readonly retryAfter?: number;

  constructor(
    message: string,
    statusCode: number,
    url: string,
    retryAfter?: number,
  ) {
    super(message, statusCode, url);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
