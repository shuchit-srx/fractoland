import { api } from "./api";

const REF_STORAGE = "fractoland_referral_code";

export function getStoredReferralCode(): string | null {
  return localStorage.getItem(REF_STORAGE);
}

export function setStoredReferralCode(code: string) {
  localStorage.setItem(REF_STORAGE, code.trim());
}

export interface ReferralLinkRow {
  id: string;
  name: string | null;
  code: string;
  full_url: string | null;
  clicks: number;
  signups: number;
  conversions: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  earnings_from_link: number;
}

export async function trackReferralClick(code: string): Promise<void> {
  const c = code.trim();
  if (!c) return;
  const res = await api.post(`/referrals/track/${encodeURIComponent(c)}`);
  if (!res.ok) return;
}

export async function listMyReferralLinks(): Promise<{ items: ReferralLinkRow[] }> {
  const res = await api.get("/referrals/me/links");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load referral links");
  return data;
}

export async function createReferralLink(name: string): Promise<ReferralLinkRow> {
  const res = await api.post("/referrals/me/links", { name });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to create link");
  return data;
}

export async function updateReferralLink(
  id: string,
  body: { name?: string; is_active?: boolean }
): Promise<ReferralLinkRow> {
  const res = await api.patch(`/referrals/me/links/${id}`, body);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to update link");
  return data;
}

export async function deactivateReferralLink(id: string): Promise<ReferralLinkRow> {
  const res = await api.delete(`/referrals/me/links/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to delete link");
  return data;
}

export interface ReferredUserRow {
  user_id: string;
  name: string | null;
  phone: string | null;
  created_at: string;
  referred_by_link_id: string | null;
}

export async function listReferredUsers(params?: {
  limit?: number;
  offset?: number;
}): Promise<{ items: ReferredUserRow[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const res = await api.get(q ? `/referrals/me/referred-users?${q}` : "/referrals/me/referred-users");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load referred users");
  return data;
}

export async function getAgentEarnings(): Promise<{
  total_credited: number;
  pending_withdrawals: number;
  completed_withdrawals: number;
  available_balance: number;
  commission_rate: number;
}> {
  const res = await api.get("/referrals/me/earnings");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load earnings");
  return data;
}

export interface AgentLedgerRow {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  investment_id: string | null;
  referral_link_id: string | null;
}

export async function getAgentLedger(params?: {
  limit?: number;
  offset?: number;
}): Promise<{ items: AgentLedgerRow[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const res = await api.get(q ? `/referrals/me/ledger?${q}` : "/referrals/me/ledger");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load ledger");
  return data;
}

export async function requestAgentWithdrawal(amount: number): Promise<{
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
}> {
  const res = await api.post("/referrals/me/withdraw", { amount });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Withdrawal request failed");
  return data;
}
