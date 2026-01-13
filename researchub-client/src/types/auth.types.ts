export interface User {
  userId?: string;
  username: string;
  email: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  personalDetails?: Record<string, any>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; //check if needed for checking is session checked
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface RegisterRequest {
  userId?: string;
  username: string;
  password: string;
  email: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  personalDetails?: Record<string, any>;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  data?: Omit<RegisterRequest, "password">;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = {
  success: boolean;
  message?: string;
  data?: User;
};
