import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bell, Check, Clock, FileText, Info, Shield, Trash2 } from "lucide-react";
import { useState } from "react";

// Mock Data
const initialNotifications = [
    {
        id: 1,
        title: "Investment Successful",
        message: "You successfully invested ₹1,50,000 in Green Valley Plot A12.",
        time: "2 hours ago",
        type: "success",
        read: false,
    },
    {
        id: 2,
        title: "New Voting Proposal",
        message: "A new proposal for 'Metro Park C3' requires your vote regarding infrastructure development.",
        time: "5 hours ago",
        type: "action",
        read: false,
    },
    {
        id: 3,
        title: "Market Update",
        message: "Land values in Bangalore have seen a 5% increase in the last quarter.",
        time: "1 day ago",
        type: "info",
        read: true,
    },
    {
        id: 4,
        title: "Security Alert",
        message: "New login detected from a new device. Please verify if this was you.",
        time: "2 days ago",
        type: "alert",
        read: true,
    },
    {
        id: 5,
        title: "Dividend Received",
        message: "You received a dividend payout of ₹12,500 from your Sunrise Estate investment.",
        time: "3 days ago",
        type: "success",
        read: true,
    },
];

const Notifications = () => {
    const [notifications, setNotifications] = useState(initialNotifications);

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <Check className="w-5 h-5 text-green-600" />;
            case "action": return <FileText className="w-5 h-5 text-blue-600" />;
            case "alert": return <Shield className="w-5 h-5 text-amber-600" />;
            default: return <Info className="w-5 h-5 text-gray-600" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case "success": return "bg-green-500/10";
            case "action": return "bg-blue-500/10";
            case "alert": return "bg-amber-500/10";
            default: return "bg-gray-500/10";
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
                    <p className="text-muted-foreground mt-1">Stay updated with your latest activities and alerts</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                        <Check className="w-4 h-4 mr-2" />
                        Mark all read
                    </Button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border">
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">No new notifications</h3>
                        <p className="text-muted-foreground">You're all caught up!</p>
                    </div>
                ) : (
                    notifications.map((notification, index) => (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`relative p-5 rounded-2xl border transition-colors group ${notification.read
                                    ? "bg-card border-border"
                                    : "bg-secondary/30 border-primary/20"
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgColor(notification.type)}`}>
                                    {getIcon(notification.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className={`text-base font-semibold ${notification.read ? "text-foreground" : "text-primary"}`}>
                                                {notification.title}
                                                {!notification.read && (
                                                    <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary align-middle" />
                                                )}
                                            </h3>
                                            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                                                {notification.message}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                                                <Clock className="w-3 h-3" />
                                                {notification.time}
                                            </span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!notification.read && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:text-primary"
                                                        onClick={() => markAsRead(notification.id)}
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:text-red-500"
                                                    onClick={() => deleteNotification(notification.id)}
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
