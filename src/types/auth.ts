export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  message: string;
  details?: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
  code?: string;
}

export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: Date;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
} 