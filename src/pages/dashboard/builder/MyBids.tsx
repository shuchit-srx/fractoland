import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Clock, MapPin, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const bids = [
  {
    id: 1,
    land: "Tech Park Zone D",
    location: "Hyderabad, Telangana",
    bidAmount: "₹3,50,00,000",
    submittedOn: "Dec 10, 2024",
    status: "pending",
    deadline: "30 days",
    competingBids: 4,
    yourRank: 2,
  },
  {
    id: 2,
    land: "Green Valley E",
    location: "Bangalore, Karnataka",
    bidAmount: "₹2,10,00,000",
    submittedOn: "Nov 28, 2024",
    status: "approved",
    deadline: "-",
    competingBids: 6,
    yourRank: 1,
  },
  {
    id: 3,
    land: "Metro Hub F",
    location: "Chennai, Tamil Nadu",
    bidAmount: "₹5,00,00,000",
    submittedOn: "Nov 15, 2024",
    status: "rejected",
    deadline: "-",
    competingBids: 8,
    yourRank: 4,
    rejectionReason: "Higher bid accepted from another developer",
  },
  {
    id: 4,
    land: "Industrial Zone A",
    location: "Bangalore, Karnataka",
    bidAmount: "₹2,80,00,000",
    submittedOn: "Dec 12, 2024",
    status: "pending",
    deadline: "15 days",
    competingBids: 8,
    yourRank: 3,
  },
  {
    id: 5,
    land: "Residential Block C",
    location: "Pune, Maharashtra",
    bidAmount: "₹2,00,00,000",
    submittedOn: "Dec 8, 2024",
    status: "outbid",
    deadline: "22 days",
    competingBids: 5,
    yourRank: 4,
  },
];

const statusConfig = {
  pending: { color: "bg-amber-50 text-amber-600 border-amber-200", icon: Clock, label: "Pending" },
  approved: { color: "bg-green-50 text-green-600 border-green-200", icon: CheckCircle, label: "Approved" },
  rejected: { color: "bg-red-50 text-red-600 border-red-200", icon: XCircle, label: "Rejected" },
  outbid: { color: "bg-orange-50 text-orange-600 border-orange-200", icon: AlertCircle, label: "Outbid" },
};

const MyBids = () => {
  const navigate = useNavigate();

  const pendingBids = bids.filter(b => b.status === "pending" || b.status === "outbid");
  const completedBids = bids.filter(b => b.status === "approved" || b.status === "rejected");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Bids</h1>
          <p className="text-muted-foreground mt-1">Track and manage your land bids</p>
        </div>
        <Button onClick={() => navigate("/dashboard/builder/lands")}>
          <MapPin className="w-4 h-4 mr-2" />
          Browse Lands
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Bids</p>
          <p className="text-2xl font-bold text-foreground">{bids.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{bids.filter(b => b.status === "pending").length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="text-2xl font-bold text-green-600">{bids.filter(b => b.status === "approved").length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Success Rate</p>
          <p className="text-2xl font-bold text-foreground">
            {Math.round((bids.filter(b => b.status === "approved").length / completedBids.length) * 100) || 0}%
          </p>
        </div>
      </div>

      {/* Active Bids */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Active Bids</h2>
        <div className="space-y-4">
          {pendingBids.map((bid, index) => {
            const config = statusConfig[bid.status as keyof typeof statusConfig];
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={bid.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{bid.land}</h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${config.color}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {bid.location}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground">Your Bid</p>
                      <p className="font-semibold text-foreground">{bid.bidAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Your Rank</p>
                      <p className="font-semibold text-foreground">#{bid.yourRank} of {bid.competingBids}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="font-semibold text-foreground">{bid.deadline}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                      <p className="font-semibold text-foreground">{bid.submittedOn}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {bid.status === "outbid" && (
                      <Button size="sm">Increase Bid</Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/dashboard/builder/bid/${bid.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Completed Bids */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Completed Bids</h2>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Land</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Bid Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Submitted</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedBids.map((bid) => {
                  const config = statusConfig[bid.status as keyof typeof statusConfig];
                  const StatusIcon = config.icon;

                  return (
                    <tr key={bid.id} className="border-b border-border last:border-0">
                      <td className="p-4">
                        <p className="font-medium text-foreground">{bid.land}</p>
                        <p className="text-xs text-muted-foreground">{bid.location}</p>
                      </td>
                      <td className="p-4 text-sm font-medium text-foreground">{bid.bidAmount}</td>
                      <td className="p-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${config.color}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {config.label}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{bid.submittedOn}</td>
                      <td className="p-4">
                        {bid.status === "approved" && (
                          <Button size="sm" onClick={() => navigate("/dashboard/builder/projects")}>
                            View Project
                          </Button>
                        )}
                        {bid.status === "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/dashboard/builder/bid/${bid.id}`)}
                          >
                            View Details
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBids;
