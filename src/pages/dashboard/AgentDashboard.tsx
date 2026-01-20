import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Copy, TrendingUp, Users, Wallet } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const stats = [
  { label: "Total Referrals", value: "48", change: "+12 this month", icon: Users },
  { label: "Active Investors", value: "32", change: "67% conversion", icon: TrendingUp },
  { label: "Total Earnings", value: "₹1,25,000", change: "+₹18,500 this month", icon: Wallet },
  { label: "Expected Payments", value: "₹35,000", change: "Available now", icon: Wallet },
];

const recentReferrals = [
  { id: 1, name: "Id123", status: "active", invested: "₹2,50,000", commission: "₹5,000" },
  { id: 2, name: "Id124", status: "active", invested: "₹1,75,000", commission: "₹3,500" },
  { id: 3, name: "Id125", status: "pending", invested: "-", commission: "-" },
  { id: 4, name: "Id126", status: "active", invested: "₹3,00,000", commission: "₹6,000" },
];

const commissionHistory = [
  { id: 1, investor: "Amit Kumar", land: "Green Valley A12", amount: "₹5,000", date: "Dec 12, 2024" },
  { id: 2, investor: "Sneha Patel", land: "Sunrise Estate B7", amount: "₹6,000", date: "Dec 10, 2024" },
  { id: 3, investor: "Priya Singh", land: "Metro Park C3", amount: "₹3,500", date: "Dec 5, 2024" },
];

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const referralLink = "https://fractoland.com/ref/AGENT123";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Agent Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track your referrals and earnings.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-foreground" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xs text-green-600 mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Referral Link */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/30 rounded-2xl p-6 border border-primary/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Your Referral Link</h2>
            <p className="text-muted-foreground text-sm">Share this link to earn 2% commission on investments</p>
          </div>
          <div className="flex items-center gap-2 bg-background rounded-xl p-2 w-full md:w-auto">
            <code className="text-sm text-muted-foreground px-3 py-2 flex-1 truncate max-w-[300px]">
              {referralLink}
            </code>
            <Button size="sm" onClick={copyLink}>
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Referrals */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Recent Referrals</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/agent/referrals")}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentReferrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">{referral.id}</span>

                  </div>
                  <p className="font-small text-foreground text-sm">{"Id-Num :"}</p>
                  <div>
                    <p className="font-medium text-foreground text-sm">{referral.name}</p>

                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${referral.status === "active"
                    ? "bg-green-50 text-green-600"
                    : "bg-amber-50 text-amber-600"
                    }`}>
                    {referral.status}
                  </span>
                  {referral.commission !== "-" && (
                    <p className="text-sm font-semibold text-green-600 mt-1">{referral.commission}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commission History */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Commission History</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/agent/earnings")}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {commissionHistory.map((commission) => (
              <div
                key={commission.id}
                className="p-4 bg-secondary/50 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground text-sm">{commission.investor}</p>
                  <span className="font-semibold text-green-600">{commission.amount}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{commission.land}</span>
                  <span>{commission.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AgentDashboard;
