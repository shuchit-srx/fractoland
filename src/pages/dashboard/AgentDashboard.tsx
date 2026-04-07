import { Button } from "@/components/ui/button";
import { formatInr } from "@/lib/dashboardApi";
import { getAgentEarnings, listMyReferralLinks, listReferredUsers } from "@/lib/referralsApi";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Copy, TrendingUp, Users, Wallet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [referralUrl, setReferralUrl] = useState<string | null>(null);
  const [earnings, setEarnings] = useState<{
    total_credited: number;
    available_balance: number;
    commission_rate: number;
  } | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [recent, setRecent] = useState<{ user_id: string; name: string | null; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [linksRes, earnRes, usersRes] = await Promise.all([
        listMyReferralLinks().catch(() => ({ items: [] })),
        getAgentEarnings().catch(() => null),
        listReferredUsers({ limit: 8 }).catch(() => ({ items: [], total: 0 })),
      ]);
      const first = linksRes.items.find((l) => l.is_active) || linksRes.items[0];
      setReferralUrl(first?.full_url || null);
      if (earnRes) setEarnings(earnRes);
      setReferralCount(usersRes.total);
      setRecent(usersRes.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const copyLink = () => {
    if (!referralUrl) {
      toast.error("Create a referral link first");
      navigate("/dashboard/agent/links");
      return;
    }
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    toast.success("Referral link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const ratePct = earnings?.commission_rate != null ? Math.round(earnings.commission_rate * 100) : 2;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Agent Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track your referrals and earnings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Referred users", value: loading ? "—" : String(referralCount), change: "All time signups", icon: Users },
          {
            label: "Total credited",
            value: loading ? "—" : formatInr(earnings?.total_credited ?? 0),
            change: "Commissions & bonuses",
            icon: TrendingUp,
          },
          {
            label: "Available balance",
            value: loading ? "—" : formatInr(earnings?.available_balance ?? 0),
            change: "For withdrawal requests",
            icon: Wallet,
          },
          {
            label: "Commission rate",
            value: loading ? "—" : `${ratePct}%`,
            change: "Per completed investment",
            icon: Wallet,
          },
        ].map((stat, index) => (
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

      <div className="bg-gradient-to-r from-primary/10 to-accent/30 rounded-2xl p-6 border border-primary/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Your referral link</h2>
            <p className="text-muted-foreground text-sm">
              Share this link so signups and investments are attributed to you ({ratePct}% commission).
            </p>
          </div>
          <div className="flex items-center gap-2 bg-background rounded-xl p-2 w-full md:w-auto">
            <code className="text-sm text-muted-foreground px-3 py-2 flex-1 truncate max-w-[300px]">
              {referralUrl || "Create a link in Referral Links"}
            </code>
            <Button size="sm" type="button" onClick={copyLink}>
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Recent referred users</h2>
            <Button variant="ghost" size="sm" type="button" onClick={() => navigate("/dashboard/agent/referrals")}>
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No referrals yet.</p>
            ) : (
              recent.map((r) => (
                <div key={r.user_id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground text-sm">{r.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(r.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Quick actions</h2>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-between" type="button" onClick={() => navigate("/dashboard/agent/links")}>
              Manage referral links <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between" type="button" onClick={() => navigate("/dashboard/agent/earnings")}>
              Earnings & withdrawals <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
