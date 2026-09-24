export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
}
