import { apiRequest } from "./api";

export type User = {
  id: number;
  username: string;
  email: string;
  nickname: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string | null;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export async function apiRegister(data: RegisterRequest): Promise<User> {
  return apiRequest<User>("/api/users/register", {
    method: "POST",
    body: data,
  });
}

export async function apiGetMe(): Promise<User> {
  return apiRequest<User>("/api/users/me", {
    auth: true,
  });
}

export type UpdateMeRequest = Partial<Pick<User, "nickname">>;

export async function apiUpdateMe(data: UpdateMeRequest): Promise<User> {
  return apiRequest<User>("/api/users/me", {
    method: "PATCH",
    body: data,
    auth: true,
  });
}

export async function apiGetAllUsers(): Promise<User[]> {
  return apiRequest<User[]>("/api/users", {
    auth: true,
  });
}
