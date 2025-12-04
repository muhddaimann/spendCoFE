import { apiRequest, setAuthToken } from "./api";
import type { User } from "./user";

export type LoginRequest = {
  login: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export async function apiLogin(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: data,
  });
  setAuthToken(res.token);
  return res;
}

export async function apiLogout(): Promise<{ message: string }> {
  const res = await apiRequest<{ message: string }>("/api/auth/logout", {
    method: "POST",
    auth: true,
  });
  setAuthToken(null);
  return res;
}

export async function apiVerifyEmail(token: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/api/email/verify?token=${encodeURIComponent(token)}`);
}

export async function apiResendVerificationEmail(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/email/resend", {
    method: "POST",
    auth: true,
  });
}

export type ForgotPasswordRequest = {
  email: string;
};

export async function apiForgotPassword(
  data: ForgotPasswordRequest
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: data,
  });
}

export type ResetPasswordRequest = {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export async function apiResetPassword(
  data: ResetPasswordRequest
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    body: data,
  });
}
