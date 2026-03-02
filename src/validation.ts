import { ValidationError } from "./errors.js";

export function validateId(id: string): void {
  if (typeof id !== "string" || id.trim().length === 0) {
    throw new ValidationError("Entity ID must be a non-empty string");
  }
}

export function validateListParams(params: {
  page?: number;
  per_page?: number;
  sample?: number;
  cursor?: string;
}): void {
  if (params.page !== undefined) {
    if (!Number.isInteger(params.page) || params.page < 1) {
      throw new ValidationError("page must be a positive integer");
    }
  }

  if (params.per_page !== undefined) {
    if (
      !Number.isInteger(params.per_page) ||
      params.per_page < 1 ||
      params.per_page > 200
    ) {
      throw new ValidationError("per_page must be an integer between 1 and 200");
    }
  }

  if (params.sample !== undefined) {
    if (!Number.isInteger(params.sample) || params.sample < 1) {
      throw new ValidationError("sample must be a positive integer");
    }
  }

  if (params.cursor !== undefined && params.page !== undefined) {
    throw new ValidationError(
      "Cannot use both cursor and page pagination simultaneously",
    );
  }
}

export function validateSelect(fields: string[]): void {
  if (!Array.isArray(fields) || fields.length === 0) {
    throw new ValidationError("select must be a non-empty array of field names");
  }
  for (const field of fields) {
    if (typeof field !== "string" || field.trim().length === 0) {
      throw new ValidationError("Each select field must be a non-empty string");
    }
  }
}
