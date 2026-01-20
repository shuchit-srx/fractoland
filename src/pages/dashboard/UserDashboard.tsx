import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronRight, Clock, Filter, MapPin, TrendingUp, Vote, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Total Investment", value: "₹5,50,000", change: "+12.5%", icon: TrendingUp, positive: true },
  { label: "Active Lands", value: "4", change: "+2 this month", icon: MapPin, positive: true },
  { label: "Wallet Balance", value: "₹25,000", change: "Available", icon: Wallet, positive: true },
  { label: "Pending Votes", value: "2", change: "Action needed", icon: Vote, positive: false },
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
    exitDate: "Dec 15, 2025",
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
    exitDate: "May 22, 2026",
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
    exitDate: "Feb 10, 2025",
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
    exitDate: "Ready to Exit",
    status: "unlocked",
    purchaseDate: "Jan 05, 2024",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&h=150&fit=crop"
  },
];

const upcomingVotes = [
  { id: 1, land: "Green Valley Plot A12", question: "Approve sale to XYZ Developers?", deadline: "3 days" },
  { id: 2, land: "Sunrise Estate B7", question: "Extend lock-in by 6 months?", deadline: "5 days" },
];

const lands = [
  {
    id: 1,
    name: "Green Valley Plot A12",
    location: "Bangalore, Karnataka",
    totalValue: "₹50,00,000",
    minInvestment: "₹25,000",
    availableTokens: 150,
    totalTokens: 200,
    lockIn: "18 months",
    expectedROI: "12-15%",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Sunrise Estate B7",
    location: "Hyderabad, Telangana",
    totalValue: "₹75,00,000",
    minInvestment: "₹50,000",
    availableTokens: 80,
    totalTokens: 150,
    lockIn: "24 months",
    expectedROI: "15-18%",
    image: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Metro Park C3",
    location: "Chennai, Tamil Nadu",
    totalValue: "₹35,00,000",
    minInvestment: "₹15,000",
    availableTokens: 200,
    totalTokens: 250,
    lockIn: "12 months",
    expectedROI: "8-10%",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=300&fit=crop"
  },
];

const InvestorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Investor Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your investment overview.</p>
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
                className="flex flex-col md:flex-row md:items-center gap-3 p-3 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/dashboard/user/land/${investment.id}`)}
              >
                {/* Image */}
                <img
                  src={investment.image}
                  alt={investment.name}
                  className="w-full md:w-20 h-32 md:h-14 rounded-lg object-cover"
                />

                {/* Info */}
                <div className="flex-1 min-w-[140px]">
                  <div className="flex flex-col items-start gap-1">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground truncate">{investment.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {investment.location}
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${investment.status === "unlocked"
                      ? "bg-green-500/10 text-green-600"
                      : "bg-amber-500/10 text-amber-600"
                      }`}>
                      {investment.status === "unlocked" ? "Ready to Exit" : `${investment.lockInRemaining} left`}
                    </span>
                  </div>
                </div>

                {/* Values */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="text-center min-w-[70px]">
                    <p className="text-[10px] text-muted-foreground">Invested</p>
                    <p className="text-sm font-medium text-foreground">{investment.invested}</p>
                  </div>
                  <div className="text-center min-w-[70px]">
                    <p className="text-[10px] text-muted-foreground">Value</p>
                    <p className="text-sm font-medium text-foreground">{investment.currentValue}</p>
                  </div>
                  <div className="text-center min-w-[50px]">
                    <p className="text-[10px] text-muted-foreground">ROI</p>
                    <p className="text-sm font-medium text-green-600 flex items-center justify-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" />
                      {investment.roi}
                    </p>
                  </div>
                  <div className="text-center min-w-[70px]">
                    <p className="text-[10px] text-muted-foreground">Exit Date</p>
                    <p className="text-sm font-medium text-foreground">{investment.exitDate}</p>
                  </div>
                  <div className="text-center min-w-[40px]">
                    <p className="text-[10px] text-muted-foreground">Tokens</p>
                    <p className="text-sm font-medium text-foreground">{investment.tokens}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Voting Alerts */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Pending Votes</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/user/voting")}>
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {upcomingVotes.map((vote) => (
              <div
                key={vote.id}
                className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
              >
                <p className="font-medium text-foreground text-sm">{vote.land}</p>
                <p className="text-sm text-muted-foreground mt-1">{vote.question}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-amber-600 font-medium">
                    Ends in {vote.deadline}
                  </span>
                  <Button size="sm" variant="outline">
                    Vote Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explore New Lands */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Explore New Lands</h2>
          <Button variant="outline" onClick={() => navigate("/dashboard/user/explore")}>
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lands.map((land, index) => (
            <motion.div
              key={land.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
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
                  <MapPin className="w-4 h-4" />
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
                      style={{ width: `${((land.totalTokens - land.availableTokens) / land.totalTokens) * 100}%` }}
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
      </div>
    </div>
  );
};

export default InvestorDashboard;
