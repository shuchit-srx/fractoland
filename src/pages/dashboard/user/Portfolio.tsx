import { motion } from "framer-motion";
import { MapPin, TrendingUp, Clock, ArrowUpRight, Download, Filter } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";

const portfolioStats = [
  { label: "Total Invested", value: "₹5,50,000", change: "+₹75,000 gains" },
  { label: "Current Value", value: "₹6,25,000", change: "+13.6%" },
  { label: "Active Investments", value: "4", change: "Across 3 cities" },
  { label: "Tokens Owned", value: "22", change: "In 4 lands" },
];

const portfolioHistory = [
  { month: "Jan", value: 480000 },
  { month: "Feb", value: 495000 },
  { month: "Mar", value: 510000 },
  { month: "Apr", value: 530000 },
  { month: "May", value: 555000 },
  { month: "Jun", value: 575000 },
  { month: "Jul", value: 595000 },
  { month: "Aug", value: 625000 },
];

const investments = [
  {
    id: 1,
    name: "Green Valley Plot A12",
    location: "Bangalore, Karnataka",
    invested: "₹1,50,000",
    currentValue: "₹1,72,500",
    tokens: 6,
    roi: "+15.0%",
    lockIn: "18 months",
    lockInRemaining: "12 months",
    status: "locked",
    purchaseDate: "Jun 15, 2024",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&h=150&fit=crop"
  },
  {
    id: 2,
    name: "Sunrise Estate B7",
    location: "Hyderabad, Telangana",
    invested: "₹2,00,000",
    currentValue: "₹2,31,000",
    tokens: 4,
    roi: "+15.5%",
    lockIn: "24 months",
    lockInRemaining: "18 months",
    status: "locked",
    purchaseDate: "May 22, 2024",
    image: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=200&h=150&fit=crop"
  },
  {
    id: 3,
    name: "Metro Park C3",
    location: "Chennai, Tamil Nadu",
    invested: "₹1,25,000",
    currentValue: "₹1,33,750",
    tokens: 8,
    roi: "+7.0%",
    lockIn: "12 months",
    lockInRemaining: "2 months",
    status: "locked",
    purchaseDate: "Feb 10, 2024",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=200&h=150&fit=crop"
  },
  {
    id: 4,
    name: "Lake View D9",
    location: "Pune, Maharashtra",
    invested: "₹75,000",
    currentValue: "₹87,750",
    tokens: 4,
    roi: "+17.0%",
    lockIn: "6 months",
    lockInRemaining: "0 months",
    status: "unlocked",
    purchaseDate: "Jan 05, 2024",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&h=150&fit=crop"
  },
];

const Portfolio = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
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
          {portfolioStats.map((stat, index) => (
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
            {investments.map((investment, index) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/dashboard/user/land/${investment.id}`)}
              >
                {/* Image */}
                <img
                  src={investment.image}
                  alt={investment.name}
                  className="w-full md:w-24 h-32 md:h-16 rounded-lg object-cover"
                />

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{investment.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {investment.location}
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      investment.status === "unlocked" 
                        ? "bg-green-500/10 text-green-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {investment.status === "unlocked" ? "Ready to Exit" : `${investment.lockInRemaining} left`}
                    </span>
                  </div>
                </div>

                {/* Values */}
                <div className="flex items-center gap-6 md:gap-8">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Invested</p>
                    <p className="font-semibold text-foreground">{investment.invested}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Current Value</p>
                    <p className="font-semibold text-foreground">{investment.currentValue}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">ROI</p>
                    <p className="font-semibold text-green-600 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      {investment.roi}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Tokens</p>
                    <p className="font-semibold text-foreground">{investment.tokens}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Portfolio;
