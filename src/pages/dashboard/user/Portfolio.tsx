import { Button } from "@/components/ui/button";
import { formatDate, formatInr, getInvestments, getInvestmentStats, type InvestmentItem } from "@/lib/dashboardApi";
import { motion } from "framer-motion";
import { ArrowUpRight, Download, Filter, Loader2, MapPin, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&h=150&fit=crop";

const Portfolio = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    total_invested: number;
    current_value: number;
    active_investments: number;
    tokens_owned: number;
  } | null>(null);
  const [investments, setInvestments] = useState<InvestmentItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [s, inv] = await Promise.all([
          getInvestmentStats(),
          getInvestments({ limit: 100 }),
        ]);
        if (cancelled) return;
        setStats(s);
        setInvestments(inv.items);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const portfolioHistory = useMemo(() => {
    if (!investments.length) return [];
    const byMonth = new Map<string, number>();
    for (const inv of investments) {
      const d = new Date(inv.created_at);
      const key = d.toLocaleString("en-IN", { month: "short" });
      byMonth.set(key, (byMonth.get(key) || 0) + inv.amount_paid);
    }
    let running = 0;
    return Array.from(byMonth.entries()).map(([month, value]) => {
      running += value;
      return { month, value: running };
    });
  }, [investments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Portfolio</h1>
          <p className="text-muted-foreground mt-1">Track your land investments and returns</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Invested", value: formatInr(stats?.total_invested ?? 0), change: "From completed investments" },
          { label: "Current Value", value: formatInr(stats?.current_value ?? 0), change: "Based on current model" },
          { label: "Active Investments", value: String(stats?.active_investments ?? 0), change: "Live portfolio count" },
          { label: "Tokens Owned", value: String(stats?.tokens_owned ?? 0), change: "Across all ventures" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-2xl p-5 border border-border"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            <p className="text-xs text-green-600 mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Portfolio Value Chart */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Portfolio Performance</h2>
        <div className="h-64 rounded-xl bg-muted/40 px-4 py-2 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>Last 8 months</span>
            <span className="flex items-center gap-1 font-medium text-foreground">
              <TrendingUp className="w-3 h-3" />
              +13.6% overall growth
            </span>
          </div>
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioHistory} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#000000" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#000000" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "rgba(0,0,0,0.6)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "rgba(0,0,0,0.6)" }}
                tickFormatter={(val: number) => `₹${Math.round(val / 1000)}k`}
              />
              <Tooltip
                cursor={{ stroke: "rgba(0,0,0,0.15)", strokeWidth: 1 }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: 9999,
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  padding: "6px 10px",
                }}
                labelStyle={{ fontSize: 11, color: "rgba(0,0,0,0.6)" }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, "Portfolio value"]}
              />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#000000"
                  strokeWidth={2}
                  fill="url(#portfolioFill)"
                  activeDot={{ r: 5, stroke: "#000000", strokeWidth: 1, fill: "#ffffff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Investments List */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Your Investments</h2>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="py-10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : investments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No investments yet.</p>
          ) : investments.map((investment, index) => (
            <motion.div
              key={investment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/dashboard/user/land/${investment.venture_id}`)}
            >
              {/* Image */}
              <img
                src={investment.image_url || DEFAULT_IMAGE}
                alt={investment.venture_name || "Venture"}
                className="w-full md:w-24 h-32 md:h-16 rounded-lg object-cover"
              />

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{investment.venture_name || "Venture"}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {investment.location}
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${investment.status === "completed"
                    ? "bg-green-500/10 text-green-600"
                    : "bg-amber-500/10 text-amber-600"
                    }`}>
                    {investment.status}
                  </span>
                </div>
              </div>

              {/* Values */}
              <div className="flex items-center gap-6 md:gap-8">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Invested</p>
                    <p className="font-semibold text-foreground">{formatInr(investment.amount_paid)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Current Value</p>
                    <p className="font-semibold text-foreground">{formatInr(investment.amount_paid)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">ROI</p>
                  <p className="font-semibold text-green-600 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                      0%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Exit Date</p>
                    <p className="font-semibold text-foreground">—</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Tokens</p>
                    <p className="font-semibold text-foreground">{investment.token_count}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
