import { motion } from "framer-motion";
import { TrendingUp, MapPin, Wallet, Vote, ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Total Investment", value: "₹5,50,000", change: "+12.5%", icon: TrendingUp, positive: true },
  { label: "Active Lands", value: "4", change: "+2 this month", icon: MapPin, positive: true },
  { label: "Wallet Balance", value: "₹25,000", change: "Available", icon: Wallet, positive: true },
  { label: "Pending Votes", value: "2", change: "Action needed", icon: Vote, positive: false },
];

const recentInvestments = [
  { id: 1, name: "Green Valley Plot A12", location: "Bangalore", invested: "₹1,50,000", roi: "+8.2%", lockIn: "18 months" },
  { id: 2, name: "Sunrise Estate B7", location: "Hyderabad", invested: "₹2,00,000", roi: "+15.4%", lockIn: "24 months" },
  { id: 3, name: "Metro Park C3", location: "Chennai", invested: "₹1,25,000", roi: "+6.8%", lockIn: "12 months" },
  { id: 4, name: "Lake View D9", location: "Pune", invested: "₹75,000", roi: "+10.2%", lockIn: "6 months" },
];

const upcomingVotes = [
  { id: 1, land: "Green Valley Plot A12", question: "Approve sale to XYZ Developers?", deadline: "3 days" },
  { id: 2, land: "Sunrise Estate B7", question: "Extend lock-in by 6 months?", deadline: "5 days" },
];

const InvestorDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
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
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Your Investments</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/user/portfolio")}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentInvestments.map((investment) => (
                <div
                  key={investment.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{investment.name}</p>
                      <p className="text-sm text-muted-foreground">{investment.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{investment.invested}</p>
                    <p className="text-sm text-green-600 flex items-center justify-end gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      {investment.roi}
                    </p>
                  </div>
                </div>
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

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => navigate("/dashboard/user/explore")}>
              <MapPin className="w-4 h-4 mr-2" />
              Explore New Lands
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard/user/wallet")}>
              <Wallet className="w-4 h-4 mr-2" />
              Add Funds
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard/user/portfolio")}>
              <TrendingUp className="w-4 h-4 mr-2" />
              View Portfolio
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvestorDashboard;
