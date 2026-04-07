import { api, setTokens, clearTokens } from "./api";

export type UserRole = "customer" | "agent" | "owner" | "developer" | "admin";

/** Frontend uses "user" for customer; API expects "customer" */
export function roleToApi(role: string): UserRole {
  return role === "user" ? "customer" : (role as UserRole);
}

export interface ApiUser {
  id: string;
  phone: string;
  email?: string | null;
  name?: string | null;
  role: UserRole;
  country_code?: string | null;
  kyc_status?: string | null;
  kyc_type?: string | null;
  wallet_address?: string | null;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SendOtpPayload {
  phone: string;
  country_code?: string;
  purpose?: "login" | "register";
}

export interface VerifyOtpLoginPayload {
  phone: string;
  country_code?: string;
  otp: string;
  purpose?: "login" | "register";
}

export interface VerifyOtpRegisterPayload extends VerifyOtpLoginPayload {
  register: true;
  name: string;
  email: string;
  role: UserRole;
  kyc_type?: string;
  kyc_id?: string;
  referred_by_agent_id?: string;
  referred_by_link_id?: string;
  /** Alternative to referred_by_link_id; server resolves active link by code. */
  referral_code?: string;
  wallet_message: string;
  wallet_signature: string;
}

export interface VerifyOtpDeveloperPayload extends VerifyOtpLoginPayload {
  developer: true;
  company_name: string;
  gstin?: string;
  license_number?: string;
  email: string;
  name?: string;
  wallet_message: string;
  wallet_signature: string;
}

export interface AuthResponse {
  success: boolean;
  user: ApiUser;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export async function sendOtp(payload: SendOtpPayload): Promise<{ success: boolean; message: string; devOtp?: string }> {
  const res = await api.post("/auth/otp/send", payload);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to send OTP");
  return data;
}

export interface CheckOtpPayload {
  phone: string;
  country_code?: string;
  otp: string;
  purpose?: "login" | "register";
}

export async function checkOtp(payload: CheckOtpPayload): Promise<{ valid: boolean; error?: string }> {
  const res = await api.post("/auth/otp/check", payload);
  const data = await res.json();
  if (!res.ok) return { valid: false, error: data.message || data.error || "Verification failed" };
  return data;
}

export async function verifyOtp(
  payload: VerifyOtpLoginPayload | VerifyOtpRegisterPayload | VerifyOtpDeveloperPayload
): Promise<AuthResponse> {
  const res = await api.post("/auth/otp/verify", payload);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Verification failed");
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function refreshToken(): Promise<{ access_token: string }> {
  const res = await api.post("/auth/refresh", { refresh_token: getStoredRefreshToken() });
  const data = await res.json();
  if (!res.ok) {
    clearTokens();
    throw new Error(data.message || "Session expired");
  }
  return data;
}

function getStoredRefreshToken(): string {
  return localStorage.getItem("fractoland_refresh_token") || "";
}

export async function logoutApi(refreshToken?: string): Promise<void> {
  const token = localStorage.getItem("fractoland_access_token");
  try {
    await api.post("/auth/logout", { refresh_token: refreshToken || getStoredRefreshToken() });
  } finally {
    clearTokens();
  }
}

export interface LinkWalletPayload {
  message: string;
  signature: string;
}

export async function linkWallet(payload: LinkWalletPayload): Promise<{ success: boolean; user: ApiUser }> {
  const res = await api.post("/auth/link-wallet", payload);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to link wallet");
  return data;
}

export async function getMe(): Promise<ApiUser> {
  const res = await api.get("/users/me");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load profile");
  return data;
}

export interface LoginWithWalletPayload {
  message: string;
  signature: string;
}

export async function loginWithWallet(
  payload: LoginWithWalletPayload
): Promise<AuthResponse> {
  const res = await api.post("/auth/login-with-wallet", payload);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Login failed");
  setTokens(data.access_token, data.refresh_token);
  return data;
}
