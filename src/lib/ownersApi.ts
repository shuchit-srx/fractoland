import { api } from "./api";

export interface OwnerPollItem {
  id: string;
  venture_id: string;
  venture_name: string | null;
  type: string | null;
  question: string;
  description: string | null;
  rule: string | null;
  starts_at: string | null;
  ends_at: string | null;
  status: string;
  result: string | null;
  yes_count: number;
  no_count: number;
  total_eligible_tokens: number | null;
}

export async function listOwnerPolls(params?: {
  status?: "active" | "closed" | "all";
  limit?: number;
  offset?: number;
}): Promise<{ items: OwnerPollItem[]; total: number }> {
  const search = new URLSearchParams();
  search.set("status", params?.status ?? "all");
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const res = await api.get(`/owners/me/polls?${search.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load owner polls");
  return data;
}

export async function createOwnerPoll(payload: {
  venture_id: string;
  type?: string;
  question: string;
  description?: string;
  rule?: string;
  starts_at?: string;
  duration_days?: number;
}): Promise<Record<string, unknown>> {
  const res = await api.post("/owners/me/polls", payload);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to create poll");
  return data;
}

export interface OwnerProceedItem {
  id: string;
  venture_id: string;
  venture_name: string | null;
  token_count: number;
  amount: number;
  created_at: string;
  type: string;
}

export async function listOwnerProceeds(params?: {
  limit?: number;
  offset?: number;
}): Promise<{
  items: OwnerProceedItem[];
  total: number;
  summary: { total_received: number; transaction_count: number; venture_count: number };
}> {
  const search = new URLSearchParams();
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const res = await api.get(q ? `/owners/me/proceeds?${q}` : "/owners/me/proceeds");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load proceeds");
  return data;
}
