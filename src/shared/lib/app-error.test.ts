import { describe, it, expect, vi, beforeEach } from "vitest";
import { toAppError } from './app-error';

vi.mock("@/api/http", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));


describe("HttpAuctionGateway error handling", () => {
  it("maps 404 to NotFound with the backend detail", () => {
    const error = { response: { status: 404, data: { detail: "Leilão não existe" } } };

    const result = toAppError(error);

    expect(result).toEqual({ kind: "NotFound", message: "Leilão não existe" });
  });

  it("maps 400 to Validation with the backend detail", () => {
    const error = { response: { status: 400, data: { detail: "Dados inválidos" } } };

    const result = toAppError(error);

    expect(result).toEqual({ kind: "Validation", message: "Dados inválidos" });
  });

  it("maps 401 to Unauthorized with the backend detail", () => {
    const error = { response: { status: 401, data: { detail: "Não autorizado" } } };

    const result = toAppError(error);

    expect(result).toEqual({ kind: "Unauthorized", message: "Não autorizado" });
  });

  it("maps 403 to Forbidden with the backend detail", () => {
    const error = { response: { status: 403, data: { detail: "Proibido" } } };

    const result = toAppError(error);

    expect(result).toEqual({ kind: "Forbidden", message: "Proibido" });
  });

  it("maps unknown status to Unexpected with the backend detail", () => {
    const error = { response: { status: 500, data: { detail: "Erro interno" } } };

    const result = toAppError(error);

    expect(result).toEqual({ kind: "Unexpected", message: "Erro interno" });
  });

  it("maps unknown error shape to Unexpected with a generic message", () => {
    const error = { message: "Network error" };

    const result = toAppError(error);

    expect(result).toEqual({ kind: "Unexpected", message: "Erro inesperado" });
  });

  it("falls back to data.message when the backend sends no detail", () => {
    const error = { response: { status: 400, data: { message: "Campo inválido" } } };

    const result = toAppError(error);

    expect(result).toEqual({ kind: "Validation", message: "Campo inválido" });
  });
})
