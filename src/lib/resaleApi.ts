import { api } from "./api";

export type ResaleStatus = "pending" | "listed" | "matched" | "completed" | "cancelled";

export interface ResaleRequestItem {
  id: string;
  venture_id: string;
  token_count: number;
  requested_amount: number | null;
  status: ResaleStatus;
  queue_position: number | null;
  created_at: string;
  updated_at: string;
  venture_name: string | null;
  location: string;
}

export interface ResaleListResponse {
  items: ResaleRequestItem[];
  total: number;
}

export async function getMyResaleRequests(params?: {
  status?: ResaleStatus;
  limit?: number;
  offset?: number;
}): Promise<ResaleListResponse> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const res = await api.get(q ? `/resale-requests/me?${q}` : "/resale-requests/me");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load resale requests");
  return data;
}

export async function getResaleAvailability(ventureId: string): Promise<{
  completed_tokens: number;
  locked_tokens: number;
  available_tokens: number;
}> {
  const res = await api.get(`/resale-requests/me/ventures/${ventureId}/availability`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load availability");
  return data;
}

export async function createResaleRequest(payload: {
  venture_id: string;
  token_count: number;
  requested_amount?: number | null;
}): Promise<ResaleRequestItem> {
  const res = await api.post("/resale-requests", payload);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to create resale request");
  return data;
}

export async function cancelResaleRequest(id: string): Promise<ResaleRequestItem> {
  const res = await api.post(`/resale-requests/me/${id}/cancel`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to cancel request");
  return data;
}

export interface AdminResaleRow extends ResaleRequestItem {
  user_id: string;
  user_name: string | null;
  user_phone: string | null;
}

export async function getAdminResaleQueue(params?: {
  status?: ResaleStatus;
  venture_id?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: AdminResaleRow[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.venture_id) search.set("venture_id", params.venture_id);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const res = await api.get(q ? `/admin/resale-requests?${q}` : "/admin/resale-requests");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load queue");
  return data;
}

export async function adminUpdateResaleRequest(
  id: string,
  body: { status: ResaleStatus; queue_position?: number }
): Promise<AdminResaleRow> {
  const res = await api.patch(`/admin/resale-requests/${id}`, body);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to update request");
  return data;
}

/** Public marketplace (listed resales only). Works without auth. */
export interface MarketplaceListing {
  id: string;
  venture_id: string;
  token_count: number;
  requested_amount: number | null;
  queue_position: number | null;
  created_at: string;
  venture_name: string | null;
  location: string;
  image_url: string | null;
  reference_token_price: number | null;
}

export async function getMarketplaceListings(params?: {
  venture_id?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: MarketplaceListing[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.venture_id) search.set("venture_id", params.venture_id);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const res = await api.get(q ? `/resale-requests/marketplace?${q}` : "/resale-requests/marketplace");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load marketplace");
  return data;
}

export async function purchaseResaleListing(
  listingId: string,
  body: { payment_method: "wallet" | "gateway"; amount?: number }
): Promise<{
  status: string;
  payment_id: string;
  sale_amount: number;
  resale_id: string;
  payment_gateway_order_id?: string | null;
}> {
  const res = await api.post(`/resale-requests/${listingId}/purchase`, body);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Purchase failed");
  return data;
}
