import { motion } from "framer-motion";
import { MapPin, TrendingUp, Clock, ArrowUpRight, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";

const portfolioStats = [
  { label: "Total Invested", value: "₹5,50,000", change: "+₹75,000 gains" },
  { label: "Current Value", value: "₹6,25,000", change: "+13.6%" },
  { label: "Active Investments", value: "4", change: "Across 3 cities" },
  { label: "Tokens Owned", value: "22", change: "In 4 lands" },
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

        {/* Portfolio Value Chart Placeholder */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Portfolio Performance</h2>
          <div className="h-48 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-primary/40 mx-auto mb-2" />
              <p className="text-muted-foreground">Portfolio value chart</p>
              <p className="text-sm text-muted-foreground">+13.6% overall growth</p>
            </div>
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
