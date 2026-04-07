import { api } from "./api";

export interface AdminAnalytics {
  users_total: number;
  users_by_role: Record<string, number>;
  ventures_total: number;
  ventures_by_status: Record<string, number>;
  payments_total: number;
  payments_by_status: Record<string, number>;
  payment_volume_completed_inr: number;
  payment_volume_by_type_inr: Record<string, number>;
  investments_total: number;
  investments_by_status: Record<string, number>;
  resale_requests_total: number;
  resale_by_status: Record<string, number>;
  developer_bids_total: number;
  developer_bids_by_status: Record<string, number>;
  polls_total: number;
  polls_by_status: Record<string, number>;
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  const res = await api.get("/admin/analytics");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load analytics");
  return data;
}

export interface AdminVentureRow {
  id: string;
  ref: string;
  name: string;
  owner_id: string;
  status: string;
  state: string | null;
  district: string | null;
  total_value: number | null;
  token_price: number | null;
  available_tokens: number;
  image_url: string | null;
}

export async function getAdminVentures(params?: {
  status?: string;
  state?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: AdminVentureRow[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.state) search.set("state", params.state);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const res = await api.get(q ? `/admin/ventures?${q}` : "/admin/ventures");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load ventures");
  return data;
}

export async function patchAdminVenture(
  id: string,
  body: Record<string, unknown>
): Promise<unknown> {
  const res = await api.patch(`/admin/ventures/${id}`, body);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Update failed");
  return data;
}

export interface AdminPollRow {
  id: string;
  venture_id: string;
  venture_name: string | null;
  location: string | null;
  type: string | null;
  question: string;
  status: string;
  yes_count: number;
  no_count: number;
  starts_at: string | null;
  ends_at: string | null;
}

export async function getAdminPolls(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: AdminPollRow[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const res = await api.get(q ? `/admin/polls?${q}` : "/admin/polls");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load polls");
  return data;
}

export interface AdminBidRow {
  id: string;
  developer_id: string;
  venture_id: string;
  bid_amount: number;
  currency: string;
  status: string | null;
  notes: string | null;
  venture_name: string | null;
  location: string | null;
  developer_name: string | null;
  developer_phone: string | null;
  created_at: string;
}

export async function getAdminDeveloperBids(params?: {
  status?: string;
  venture_id?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: AdminBidRow[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.venture_id) search.set("venture_id", params.venture_id);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const res = await api.get(q ? `/admin/developer-bids?${q}` : "/admin/developer-bids");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load bids");
  return data;
}

export async function patchAdminDeveloperBid(
  id: string,
  body: { status: string; notes?: string | null }
): Promise<unknown> {
  const res = await api.patch(`/admin/developer-bids/${id}`, body);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Update failed");
  return data;
}

export interface AdminPaymentRow {
  id: string;
  user_id: string | null;
  user_name: string | null;
  user_phone: string | null;
  type: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string | null;
  gateway_order_id: string | null;
  description: string;
  created_at: string;
}

export async function getAdminPayments(params?: {
  type?: string;
  status?: string;
  user_id?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: AdminPaymentRow[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.type) search.set("type", params.type);
  if (params?.status) search.set("status", params.status);
  if (params?.user_id) search.set("user_id", params.user_id);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const res = await api.get(q ? `/admin/payments?${q}` : "/admin/payments");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load payments");
  return data;
}

export interface AdminAuditRow {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  payload: Record<string, unknown>;
  ip: string | null;
  created_at: string;
}

export async function createGovtApiToken(body: {
  name?: string;
  permissions: Record<string, boolean>;
}): Promise<{
  id: string;
  name: string;
  permissions: Record<string, boolean>;
  token: string;
  created_at: string;
  message: string;
}> {
  const res = await api.post("/admin/govt-api-tokens", body);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to create token");
  return data;
}

export async function listGovtApiTokens(): Promise<{
  items: { id: string; name: string; permissions: Record<string, boolean>; last_used_at: string | null; created_at: string }[];
}> {
  const res = await api.get("/admin/govt-api-tokens");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to list tokens");
  return data;
}

export async function getAdminAuditLogs(params?: {
  action?: string;
  resource_type?: string;
  user_id?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: AdminAuditRow[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.action) search.set("action", params.action);
  if (params?.resource_type) search.set("resource_type", params.resource_type);
  if (params?.user_id) search.set("user_id", params.user_id);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const res = await api.get(q ? `/admin/audit-logs?${q}` : "/admin/audit-logs");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load audit log");
  return data;
}
