import { apiRequest } from "./api";

export type Category = {
  id: number;
  user_id: number;
  name: string;
  type: "income" | "expense";
  color: string | null;
  created_at: string;
  updated_at: string | null;
};

export async function apiGetCategories(): Promise<Category[]> {
  return apiRequest<Category[]>("/api/categories", {
    auth: true,
  });
}

export type CreateCategoryRequest = {
  name: string;
  type: "income" | "expense";
  color?: string | null;
};

export async function apiCreateCategory(
  data: CreateCategoryRequest
): Promise<Category> {
  return apiRequest<Category>("/api/categories", {
    method: "POST",
    body: data,
    auth: true,
  });
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;

export async function apiUpdateCategory(
  id: number,
  data: UpdateCategoryRequest
): Promise<Category> {
  return apiRequest<Category>(`/api/categories/${id}`, {
    method: "PATCH",
    body: data,
    auth: true,
  });
}

export async function apiDeleteCategory(
  id: number
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/api/categories/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
