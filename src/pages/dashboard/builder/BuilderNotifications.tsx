import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle, Clock, FileText, Wallet } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";

type NotificationCategory = "all" | "bids" | "payments" | "platform";

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  category: NotificationCategory;
  read: boolean;
  icon: "bid" | "payment" | "system";
}

const notificationsSeed: NotificationItem[] = [
  {
    id: 1,
    title: "Bid status updated – Tech Park Zone D",
    description: "Your bid is currently ranked #2 of 4. You may choose to revise your offer.",
    time: "10 mins ago",
    category: "bids",
    read: false,
    icon: "bid",
  },
  {
    id: 2,
    title: "Payment in process",
    description: "Advance payment of ₹ 3.5 Cr for Tech Park Zone D is being processed.",
    time: "1 hour ago",
    category: "payments",
    read: false,
    icon: "payment",
  },
  {
    id: 3,
    title: "New land available near Bangalore",
    description: "Industrial Zone A is now open for bidding. Minimum bid starts at ₹ 2.5 Cr.",
    time: "Yesterday",
    category: "bids",
    read: true,
    icon: "bid",
  },
  {
    id: 4,
    title: "Platform update",
    description: "FractoLand has updated its bidding cut-off timelines for high-value lands.",
    time: "2 days ago",
    category: "platform",
    read: true,
    icon: "system",
  },
];

const BuilderNotifications = () => {
  const [filter, setFilter] = useState<NotificationCategory>("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>(notificationsSeed);

  const filtered = notifications.filter((n) => (filter === "all" ? true : n.category === filter));
  const hasUnread = notifications.some((n) => !n.read);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (item: NotificationItem) => {
    if (item.icon === "bid") return FileText;
    if (item.icon === "payment") return Wallet;
    return Bell;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              Stay on top of bid decisions, payment status, and important platform updates.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasUnread && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <CheckCircle className="w-3 h-3" />
                {notifications.filter((n) => !n.read).length} unread
              </span>
            )}
            <Button
              size="sm"
              variant="outline"
              className="rounded-full h-9 px-4 text-sm"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All" },
            { key: "bids", label: "Bids & Lands" },
            { key: "payments", label: "Payments" },
            { key: "platform", label: "Platform Updates" },
          ].map((tab) => (
            <Button
              key={tab.key}
              size="sm"
              variant={filter === tab.key ? "default" : "outline"}
              className="rounded-full h-8 px-4 text-xs"
              onClick={() => setFilter(tab.key as NotificationCategory)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Notification list */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-card space-y-2">
          {filtered.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm font-semibold text-foreground">No notifications in this view.</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                When there are updates to your bids, payments, or projects, they will show up here.
              </p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const Icon = getIcon(item);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-start gap-3 rounded-2xl px-3 py-3 border ${
                    item.read ? "border-border/60 bg-card" : "border-foreground/50 bg-secondary/40"
                  }`}
                >
                  <div className="mt-1">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                      <Icon className="w-4 h-4 text-foreground" />
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BuilderNotifications;

