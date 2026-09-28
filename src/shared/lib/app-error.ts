import type { AppError } from './result';


export function toAppError(error: any): AppError {
  const status = error.response?.status;
  const message = error.response?.data?.detail ?? error.response?.data?.message ?? "Erro inesperado";
  if (status === 400 || status === 422) return { kind: "Validation", message };
  if (status === 401) return { kind: "Unauthorized", message };
  if (status === 403) return { kind: "Forbidden", message };
  if (status === 404) return { kind: "NotFound", message };
  return { kind: "Unexpected", message };
}
