import { describe, it, expect } from "vitest";
import { api, configureHttp, isAuthEndpoint } from "./http";
import { AxiosHeaders } from "axios";

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

describe("request interceptor", () => {
  function makeAuth(token: string | null) {
    return {
      getAccessToken: () => token,
      hasRefreshToken: () => false,
      refresh: async () => false,
      onUnauthorized: () => {},
    };
  }

  function runRequestInterceptor() {
    const interceptor = (api.interceptors.request as any).handlers[0].fulfilled;
    return interceptor({ headers: new AxiosHeaders()})
  }

  it("adds Authorization header if access token is present", () => {
    configureHttp(makeAuth("abc123"));

    const config = runRequestInterceptor();

    expect(config.headers.get("Authorization")).toBe("Bearer abc123");
  });

  it("does not add Authorization header if access token is null", () => {
    configureHttp(makeAuth(null));

    const config = runRequestInterceptor();

    expect(config.headers.get("Authorization")).toBeUndefined();
  });
});
