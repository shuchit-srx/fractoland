import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Building2, CheckCircle, Clock, FileText, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Available Lands", value: "24", icon: MapPin },
  { label: "Active Bids", value: "3", icon: FileText },
  { label: "Approved Projects", value: "2", icon: CheckCircle },
  { label: "Pending Approval", value: "1", icon: Clock },
];

const availableLands = [
  { id: 1, name: "Industrial Zone A", location: "Bangalore", size: "5.2 acres", minBid: "₹2.5 Cr", deadline: "15 days" },
  { id: 2, name: "Commercial Plot B", location: "Mumbai", size: "3.8 acres", minBid: "₹4.2 Cr", deadline: "8 days" },
  { id: 3, name: "Residential Block C", location: "Pune", size: "7.1 acres", minBid: "₹1.8 Cr", deadline: "22 days" },
];

const myBids = [
  { id: 1, land: "Tech Park Zone D", status: "pending", amount: "₹3.5 Cr", submittedOn: "Dec 10, 2024" },
  { id: 2, land: "Green Valley E", status: "approved", amount: "₹2.1 Cr", submittedOn: "Nov 28, 2024" },
  { id: 3, land: "Metro Hub F", status: "rejected", amount: "₹5.0 Cr", submittedOn: "Nov 15, 2024" },
];

const statusConfig = {
  pending: { color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
  approved: { color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle },
  rejected: { color: "text-red-600 bg-red-50 border-red-200", icon: AlertCircle },
};

const BuilderDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Builder Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your land acquisitions and development projects.</p>
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
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4">
              <stat.icon className="w-6 h-6 text-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Available Lands */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Available for Bidding</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/developer/lands")}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {availableLands.map((land) => (
              <div
                key={land.id}
                className="p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{land.name}</p>
                  <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                    {land.deadline} left
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>{land.location}</span>
                  <span>•</span>
                  <span>{land.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    Min Bid: <span className="font-semibold text-foreground">{land.minBid}</span>
                  </p>
                  <Button size="sm">Place Bid</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Bids */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">My Bids</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/developer/bids")}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {myBids.map((bid) => {
              const config = statusConfig[bid.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;
              return (
                <div
                  key={bid.id}
                  className={`p-4 rounded-xl border ${config.color}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">{bid.land}</p>
                    <div className="flex items-center gap-1">
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium capitalize">{bid.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bid: {bid.amount}</span>
                    <span className="text-muted-foreground">{bid.submittedOn}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => navigate("/dashboard/developer/lands")}>
            <MapPin className="w-4 h-4 mr-2" />
            Browse Lands
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard/developer/bids")}>
            <FileText className="w-4 h-4 mr-2" />
            Manage Bids
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard/developer/projects")}>
            <Building2 className="w-4 h-4 mr-2" />
            View Projects
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuilderDashboard;