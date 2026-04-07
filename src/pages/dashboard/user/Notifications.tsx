import { Button } from "@/components/ui/button";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
  type NotificationType,
} from "@/lib/notificationsApi";
import { motion } from "framer-motion";
import { Bell, Check, Clock, FileText, Info, Loader2, Shield, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h ago`;
  return d.toLocaleDateString();
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications({ limit: 80 });
      setNotifications(res.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const markAsRead = async (id: string) => {
    setBusyId(id);
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All marked read");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <Check className="w-5 h-5 text-green-600" />;
      case "action":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "alert":
        return <Shield className="w-5 h-5 text-amber-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBgColor = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-green-500/10";
      case "action":
        return "bg-blue-500/10";
      case "alert":
        return "bg-amber-500/10";
      default:
        return "bg-gray-500/10";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with investments, polls, resale, bids, and withdrawals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" type="button" onClick={() => void load()} disabled={loading}>
            Refresh
          </Button>
          <Button variant="outline" size="sm" type="button" onClick={() => void markAllAsRead()} disabled={loading || notifications.length === 0}>
            <Check className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No notifications</h3>
            <p className="text-muted-foreground">You&apos;re all caught up.</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`relative p-5 rounded-2xl border transition-colors group ${
                notification.read ? "bg-card border-border" : "bg-secondary/30 border-primary/20"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgColor(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`text-base font-semibold ${notification.read ? "text-foreground" : "text-primary"}`}>
                        {notification.title}
                        {!notification.read && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary align-middle" />}
                      </h3>
                      {notification.message ? (
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{notification.message}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(notification.created_at)}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-primary"
                            type="button"
                            disabled={busyId === notification.id}
                            onClick={() => void markAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-red-500"
                          type="button"
                          disabled={busyId === notification.id}
                          onClick={() => void remove(notification.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
