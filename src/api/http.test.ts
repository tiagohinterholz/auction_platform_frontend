import { describe, it, expect } from "vitest";
import { isAuthEndpoint } from "./http";

describe("isAuthEndpoint", () => {
  it("matches /auth/* endpoints, including refresh and logout themselves", () => {
    expect(isAuthEndpoint("/auth/login")).toBe(true);
    expect(isAuthEndpoint("/auth/refresh")).toBe(true);
    expect(isAuthEndpoint("/auth/logout")).toBe(true);
  });

  it("does not match other endpoints, so they are eligible for silent refresh", () => {
    expect(isAuthEndpoint("/auctions")).toBe(false);
    expect(isAuthEndpoint("/users/123")).toBe(false);
  });

  it("does not match undefined", () => {
    expect(isAuthEndpoint(undefined)).toBe(false);
  });
});
