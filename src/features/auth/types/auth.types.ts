export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
