export type AppError = {
  kind: "Validation" | "NotFound" | "Unauthorized" | "Forbidden" | "Unexpected";
  message: string;
}

export type Result<T> = 
  | { ok: true; value: T }
  | { ok: false; error: AppError };

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function fail<T = never>(error: AppError): Result<T> {
  return { ok: false, error };
}