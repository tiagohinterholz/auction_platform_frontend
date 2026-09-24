export interface HttpAuth {
  getAccessToken: () => string | null;
  hasRefreshToken: () => boolean;
  refresh: () => Promise<boolean>;
  onUnauthorized: () => void;
}
