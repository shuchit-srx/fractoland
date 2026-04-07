import { api } from "./api";

export type NotificationType = "success" | "action" | "info" | "alert";

export interface NotificationItem {
  id: string;
  title: string;
  message: string | null;
  type: NotificationType;
  read: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

export async function getNotifications(params?: {
  read?: "true" | "false";
  limit?: number;
  offset?: number;
}): Promise<{ items: NotificationItem[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.read) search.set("read", params.read);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const res = await api.get(q ? `/notifications/me?${q}` : "/notifications/me");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load notifications");
  return data;
}

export async function markNotificationRead(id: string): Promise<void> {
  const res = await api.patch(`/notifications/me/${id}/read`, {});
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to update");
}

export async function markAllNotificationsRead(): Promise<void> {
  const res = await api.patch("/notifications/me/read-all", {});
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to update");
}

export async function deleteNotification(id: string): Promise<void> {
  const res = await api.delete(`/notifications/me/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to delete");
}
