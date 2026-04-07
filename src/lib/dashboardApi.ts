import { api } from "./api";

/** GET /wallets/me */
export interface WalletBalance {
  balance: number;
  currency: string;
}

export async function getWalletBalance(): Promise<WalletBalance> {
  const res = await api.get("/wallets/me");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load wallet");
  return data;
}

/** GET /investments/me/stats */
export interface InvestmentStats {
  total_invested: number;
  current_value: number;
  active_investments: number;
  tokens_owned: number;
}

export async function getInvestmentStats(): Promise<InvestmentStats> {
  const res = await api.get("/investments/me/stats");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load stats");
  return data;
}

/** GET /investments/me */
export interface InvestmentItem {
  id: string;
  venture_id: string;
  venture_name: string | null;
  location: string;
  token_count: number;
  amount_paid: number;
  status: string;
  created_at: string;
  image_url: string | null;
}

export interface InvestmentsListResponse {
  items: InvestmentItem[];
  total: number;
}

export async function getInvestments(params?: {
  status?: string;
  venture_id?: string;
  limit?: number;
  offset?: number;
}): Promise<InvestmentsListResponse> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.venture_id) search.set("venture_id", params.venture_id);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const path = q ? `/investments/me?${q}` : "/investments/me";
  const res = await api.get(path);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load investments");
  return data;
}

/** POST /investments */
export interface CreateInvestmentPayload {
  venture_id: string;
  token_count: number;
  payment_method: "wallet" | "gateway";
  /** Optional agent referral code (from registration link or stored session). */
  referral_code?: string | null;
}

export interface CreateInvestmentResponse {
  id: string;
  venture_id: string;
  token_count: number;
  amount_paid: number;
  status: "pending" | "completed" | "failed" | "refunded";
  payment_id: string | null;
  tx_hash: string | null;
  payment_gateway_order_id?: string | null;
}

export async function createInvestment(payload: CreateInvestmentPayload): Promise<CreateInvestmentResponse> {
  const res = await api.post("/investments", payload);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to create investment");
  return data;
}

/** GET /payments/me */
export interface PaymentItem {
  id: string;
  type: "add_funds" | "investment" | "withdrawal" | "royalty" | "refund" | "resale_purchase" | "resale_payout";
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  description?: string;
  created_at: string;
}

export interface PaymentsListResponse {
  items: PaymentItem[];
  total: number;
}

export async function getPayments(params?: { type?: string; limit?: number; offset?: number }): Promise<PaymentsListResponse> {
  const search = new URLSearchParams();
  if (params?.type) search.set("type", params.type);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const path = q ? `/payments/me?${q}` : "/payments/me";
  const res = await api.get(path);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load payments");
  return data;
}

/** POST /payments/add-funds */
export async function addFundsInit(payload: { amount: number; currency?: string; gateway?: string }): Promise<{
  order_id: string;
  amount: number;
  gateway_order_id: string;
  redirect_url: string | null;
}> {
  const res = await api.post("/payments/add-funds", payload);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to initialize add-funds");
  return data;
}

/** POST /payments/add-funds/callback */
export async function paymentCallback(payload: {
  gateway_order_id: string;
  gateway_payment_id: string;
  status: "pending" | "completed" | "failed" | "refunded";
}): Promise<{ success: boolean; payment_id?: string; status?: string; already_processed?: boolean }> {
  const res = await api.post("/payments/add-funds/callback", payload);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to process payment callback");
  return data;
}

/** POST /payments/withdraw */
export async function withdrawFunds(payload: { amount: number }): Promise<{ id: string; status: string; amount: number }> {
  const res = await api.post("/payments/withdraw", payload);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to request withdrawal");
  return data;
}

/** GET /polls — scoped to ventures you hold completed tokens in; includes vote state when authenticated */
export interface PollItem {
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
  voted: boolean;
  your_vote: "yes" | "no" | null;
  your_token_weight: number | null;
  eligible_token_weight: number;
}

export interface PollsListResponse {
  items: PollItem[];
  total: number;
}

export async function getPolls(params?: {
  status?: "active" | "closed" | "all";
  limit?: number;
  offset?: number;
}): Promise<PollsListResponse> {
  const search = new URLSearchParams();
  search.set("status", params?.status ?? "active");
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const res = await api.get(`/polls?${search.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load polls");
  return data;
}

/** @deprecated alias — use getPolls({ status: "active" }) */
export async function getActivePolls(params?: { limit?: number; offset?: number }): Promise<PollsListResponse> {
  return getPolls({ status: "active", ...params });
}

/** GET /polls/:id */
export async function getPoll(id: string): Promise<PollItem> {
  const res = await api.get(`/polls/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load poll");
  return data;
}

/** POST /polls/:id/vote */
export async function castPollVote(
  pollId: string,
  payload: { vote: "yes" | "no" }
): Promise<{ success: boolean; token_weight: number; vote: string }> {
  const res = await api.post(`/polls/${pollId}/vote`, payload);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to cast vote");
  return data;
}

/** GET /wishlist */
export interface WishlistVentureSummary {
  name: string | null;
  location: string;
  area_acres: number | null;
  expected_roi_percent: number | null;
  token_price: number | null;
}

export interface WishlistApiItem {
  id: string;
  venture_id: string;
  selected_piece_ids: number[];
  total_amount: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  venture: WishlistVentureSummary;
  image_url: string | null;
}

export interface WishlistListResponse {
  items: WishlistApiItem[];
  total: number;
}

export async function getWishlist(params?: { limit?: number; offset?: number }): Promise<WishlistListResponse> {
  const search = new URLSearchParams();
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const path = q ? `/wishlist?${q}` : "/wishlist";
  const res = await api.get(path);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load wishlist");
  return data;
}

/** POST /wishlist */
export async function createWishlistItem(payload: {
  venture_id: string;
  selected_piece_ids: number[];
  total_amount: number;
}): Promise<{
  id: string;
  venture_id: string;
  selected_piece_ids: number[];
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}> {
  const res = await api.post("/wishlist", payload);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to save wishlist");
  return data;
}

/** DELETE /wishlist/:id */
export async function deleteWishlistItem(id: string): Promise<{ success: boolean }> {
  const res = await api.delete(`/wishlist/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to remove wishlist item");
  return data;
}

/** Format INR for display */
export function formatInr(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format date for display */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** Days until end (for polls) */
export function daysUntilEnd(endsAt: string | null): string {
  if (!endsAt) return "—";
  const end = new Date(endsAt);
  const now = new Date();
  const days = Math.ceil((end.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
  if (days <= 0) return "Ended";
  if (days === 1) return "1 day";
  return `${days} days`;
}
