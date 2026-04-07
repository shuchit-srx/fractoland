import { api } from "./api";

export interface DeveloperBidItem {
  id: string;
  venture_id: string;
  bid_amount: number;
  currency: string;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  venture_name: string | null;
  venture_status: string | null;
  location: string | null;
}

export interface DeveloperProjectItem extends DeveloperBidItem {
  full_address: string | null;
  area_acres: number | null;
  total_value: number | null;
}

export async function placeDeveloperBid(body: {
  venture_id: string;
  bid_amount: number;
  notes?: string | null;
}): Promise<DeveloperBidItem> {
  const res = await api.post("/developer-bids", body);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to place bid");
  return data;
}

export async function getMyDeveloperBids(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: DeveloperBidItem[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const res = await api.get(q ? `/developer-bids/me?${q}` : "/developer-bids/me");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load bids");
  return data;
}

export async function getMyDeveloperProjects(params?: {
  limit?: number;
  offset?: number;
}): Promise<{ items: DeveloperProjectItem[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const res = await api.get(q ? `/developer-bids/me/projects?${q}` : "/developer-bids/me/projects");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load projects");
  return data;
}
