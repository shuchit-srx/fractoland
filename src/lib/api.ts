const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function getAccessToken(): string | null {
  return localStorage.getItem("fractoland_access_token");
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("fractoland_refresh_token");
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("fractoland_access_token", access);
  localStorage.setItem("fractoland_refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("fractoland_access_token");
  localStorage.removeItem("fractoland_refresh_token");
  localStorage.removeItem("fractoland_user");
}

export async function authFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE}${path}`;
  const access = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (access) headers["Authorization"] = `Bearer ${access}`;

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const retryHeaders = { ...headers, Authorization: `Bearer ${getAccessToken()}` };
      res = await fetch(url, { ...options, headers: retryHeaders });
    }
  }
  return res;
}

export async function refreshAccessToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    if (!res.ok) {
      clearTokens();
      return false;
    }
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("fractoland_access_token", data.access_token);
      return true;
    }
  } catch {
    clearTokens();
  }
  return false;
}

export const api = {
  get: (path: string, options?: RequestInit) =>
    authFetch(path, { ...options, method: "GET" }),
  post: (path: string, body?: unknown, options?: RequestInit) =>
    authFetch(path, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: (path: string, body?: unknown, options?: RequestInit) =>
    authFetch(path, {
      ...options,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
};
