import { apiRequest } from "./api";

export type Transaction = {
  id: number;
  user_id: number;
  category_id: number | null;
  amount: string;
  type: "income" | "expense";
  occurred_at: string;
  note: string | null;
  created_at: string;
  updated_at: string | null;
};

export async function apiGetTransactions(): Promise<Transaction[]> {
  return apiRequest<Transaction[]>("/api/transactions", {
    auth: true,
  });
}

export type CreateTransactionRequest = {
  category_id?: number | null;
  amount: string;
  type: "income" | "expense";
  occurred_at: string;
  note?: string | null;
};

export async function apiCreateTransaction(
  data: CreateTransactionRequest
): Promise<Transaction> {
  return apiRequest<Transaction>("/api/transactions", {
    method: "POST",
    body: data,
    auth: true,
  });
}

export async function apiGetTransaction(id: number): Promise<Transaction> {
  return apiRequest<Transaction>(`/api/transactions/${id}`, {
    auth: true,
  });
}

export type UpdateTransactionRequest = Partial<CreateTransactionRequest>;

export async function apiUpdateTransaction(
  id: number,
  data: UpdateTransactionRequest
): Promise<Transaction> {
  return apiRequest<Transaction>(`/api/transactions/${id}`, {
    method: "PATCH",
    body: data,
    auth: true,
  });
}

export async function apiDeleteTransaction(
  id: number
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/api/transactions/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
