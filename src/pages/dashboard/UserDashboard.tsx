import { Button } from "@/components/ui/button";
import {
  getActivePolls,
  getInvestmentStats,
  getInvestments,
  getWalletBalance,
  formatInr,
  formatDate,
  daysUntilEnd,
  type InvestmentItem,
  type PollItem,
} from "@/lib/dashboardApi";
import { getVentures, ventureToExploreCard } from "@/lib/venturesApi";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronRight, Clock, Filter, Loader2, MapPin, TrendingUp, Vote, Wallet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ExploreCard = ReturnType<typeof ventureToExploreCard>;

const TOP_ROI_COUNT = 3;
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&h=150&fit=crop";

const InvestorDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<{
    totalInvested: string;
    activeLands: number;
    walletBalance: string;
    pendingVotes: number;
    statsChange: string[];
  } | null>(null);
  const [investments, setInvestments] = useState<InvestmentItem[]>([]);
  const [polls, setPolls] = useState<PollItem[]>([]);
  const [exploreLands, setExploreLands] = useState<ExploreCard[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, investmentsRes, pollsRes, venturesRes] = await Promise.allSettled([
        Promise.all([getInvestmentStats(), getWalletBalance()]).then(([s, w]) => ({ stats: s, wallet: w })),
        getInvestments({ limit: 10 }),
        getActivePolls({ limit: 5 }),
        getVentures({ status: "live", limit: 50 }),
      ]);

      const statsData = statsRes.status === "fulfilled" ? statsRes.value : null;
      const invData = investmentsRes.status === "fulfilled" ? investmentsRes.value : null;
      const pollsData = pollsRes.status === "fulfilled" ? pollsRes.value : null;
      const venturesData = venturesRes.status === "fulfilled" ? venturesRes.value : null;

      const activePollItems = pollsData?.items ?? [];
      const pendingVotePolls = activePollItems.filter((p) => !p.voted);
      const pendingVoteCount = pendingVotePolls.length;

      if (statsData?.stats && statsData?.wallet) {
        const s = statsData.stats;
        const w = statsData.wallet;
        setStats({
          totalInvested: formatInr(s.total_invested),
          activeLands: s.active_investments,
          walletBalance: formatInr(w.balance),
          pendingVotes: pendingVoteCount,
          statsChange: [
            s.current_value > s.total_invested ? `+${(((s.current_value - s.total_invested) / s.total_invested) * 100).toFixed(1)}%` : "—",
            `${s.active_investments} land(s)`,
            "Available",
            pendingVoteCount > 0 ? "Action needed" : "None",
          ],
        });
      } else {
        setStats({
          totalInvested: formatInr(0),
          activeLands: 0,
          walletBalance: formatInr(0),
          pendingVotes: pendingVoteCount,
          statsChange: ["—", "0", "Available", pendingVoteCount > 0 ? "Action needed" : "None"],
        });
      }

      setInvestments(invData?.items ?? []);
      setPolls(pendingVotePolls);

      if (venturesData?.items) {
        const sorted = [...venturesData.items].sort((a, b) => {
          const roiA = a.expected_roi_percent ?? 0;
          const roiB = b.expected_roi_percent ?? 0;
          return roiB - roiA;
        });
        setExploreLands(sorted.slice(0, TOP_ROI_COUNT).map(ventureToExploreCard));
      } else {
        setExploreLands([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
      setStats({
        totalInvested: formatInr(0),
        activeLands: 0,
        walletBalance: formatInr(0),
        pendingVotes: 0,
        statsChange: ["—", "0", "—", "0"],
      });
      setInvestments([]);
      setPolls([]);
      setExploreLands([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const statCards = stats
    ? [
        { label: "Total Investment", value: stats.totalInvested, change: stats.statsChange[0], icon: TrendingUp, positive: true },
        { label: "Active Lands", value: String(stats.activeLands), change: stats.statsChange[1], icon: MapPin, positive: true },
        { label: "Wallet Balance", value: stats.walletBalance, change: stats.statsChange[2], icon: Wallet, positive: true },
        { label: "Pending Votes", value: String(stats.pendingVotes), change: stats.statsChange[3], icon: Vote, positive: stats.pendingVotes > 0 },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Investor Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s your investment overview.</p>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <span className={`text-sm font-medium ${stat.positive ? "text-green-600" : "text-amber-600"}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Two column layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Investments */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Your Investments</h2>
                <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/user/portfolio")}>
                  <Filter className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {investments.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6">No investments yet. Explore lands to get started.</p>
                ) : (
                  investments.map((inv, index) => (
                    <motion.div
                      key={inv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col md:flex-row md:items-center gap-3 p-3 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/dashboard/user/land/${inv.venture_id}`)}
                    >
                      <img
                        src={inv.image_url || DEFAULT_IMAGE}
                        alt={inv.venture_name || "Venture"}
                        className="w-full md:w-20 h-32 md:h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-[140px]">
                        <h3 className="text-sm font-semibold text-foreground truncate">{inv.venture_name || "Unknown"}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {inv.location || "—"}
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                          Active · {inv.token_count} token{inv.token_count !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <div className="text-center min-w-[70px]">
                          <p className="text-[10px] text-muted-foreground">Invested</p>
                          <p className="text-sm font-medium text-foreground">{formatInr(inv.amount_paid)}</p>
                        </div>
                        <div className="text-center min-w-[50px]">
                          <p className="text-[10px] text-muted-foreground">Tokens</p>
                          <p className="text-sm font-medium text-foreground">{inv.token_count}</p>
                        </div>
                        <div className="text-center min-w-[90px]">
                          <p className="text-[10px] text-muted-foreground">Purchased</p>
                          <p className="text-sm font-medium text-foreground">{formatDate(inv.created_at)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Pending Votes */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Pending Votes</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/user/voting")}>
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {polls.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pending votes.</p>
                ) : (
                  polls.map((poll) => (
                    <div
                      key={poll.id}
                      className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl"
                    >
                      <p className="font-medium text-foreground text-sm">{poll.venture_name || "Venture"}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{poll.question}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-amber-600 font-medium">
                          Ends in {daysUntilEnd(poll.ends_at)}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => navigate("/dashboard/user/voting")}>
                          Vote Now
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Explore New Lands — Top 3 by ROI */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Explore New Lands</h2>
              <Button variant="outline" onClick={() => navigate("/dashboard/user/explore")}>
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exploreLands.map((land, index) => (
                <motion.div
                  key={land.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/dashboard/user/land/${land.id}`)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={land.image}
                      alt={land.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-green-600">{land.expectedROI} ROI</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground text-lg mb-1">{land.name}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                      <MapPin className="w-4 h-4 shrink-0" />
                      {land.location}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Min Investment</p>
                        <p className="font-semibold text-foreground">{land.minInvestment}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Lock-in Period</p>
                        <p className="font-semibold text-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {land.lockIn}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Available Tokens</span>
                        <span>{land.availableTokens}/{land.totalTokens}</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${land.totalTokens > 0 ? ((land.totalTokens - land.availableTokens) / land.totalTokens) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <Button className="w-full group-hover:bg-primary/90">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {exploreLands.length === 0 && (
              <p className="text-sm text-muted-foreground py-6">No lands available right now. Check back later.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default InvestorDashboard;
