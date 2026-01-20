import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Updated status types for better styling control
type Status = "active" | "pending" | "inactive";

const referrals = [
  {
    id: 1,
    refId: "Id123",
    status: "active" as Status,
    joinedDate: "Nov 15, 2024",
    totalInvested: "₹2,50,000",
    investments: 2,
    commission: "₹5,000",
  },
  {
    id: 2,
    refId: "Id124",
    status: "active" as Status,
    joinedDate: "Nov 20, 2024",
    totalInvested: "₹1,75,000",
    investments: 1,
    commission: "₹3,500",
  },
  {
    id: 3,
    refId: "Id125",
    status: "pending" as Status,
    joinedDate: "Dec 10, 2024",
    totalInvested: "-",
    investments: 0,
    commission: "-",
  },
  {
    id: 4,
    refId: "Id126",
    status: "active" as Status,
    joinedDate: "Oct 25, 2024",
    totalInvested: "₹3,00,000",
    investments: 3,
    commission: "₹6,000",
  },
  {
    id: 5,
    refId: "Id127",
    status: "active" as Status,
    joinedDate: "Nov 5, 2024",
    totalInvested: "₹4,50,000",
    investments: 4,
    commission: "₹9,000",
  },
  {
    id: 6,
    refId: "Id128",
    status: "inactive" as Status,
    joinedDate: "Sep 15, 2024",
    totalInvested: "₹50,000",
    investments: 1,
    commission: "₹1,000",
  },
];

const Referrals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = referral.refId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || referral.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: referrals.length,
    active: referrals.filter(r => r.status === "active").length,
    pending: referrals.filter(r => r.status === "pending").length,
    inactive: referrals.filter(r => r.status === "inactive").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Referrals</h1>
        <p className="text-muted-foreground mt-1">Manage and track your referred users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Same stats cards as before, they were fine */}
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Referrals</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Conversion Rate</p>
          <p className="text-2xl font-bold text-foreground">
            {Math.round((stats.active / stats.total) * 100)}%
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by ID..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "pending", "inactive"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Referrals - Card Layout (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredReferrals.map((referral, index) => (
          <motion.div
            key={referral.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{referral.id}</span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide ${referral.status === "active"
                  ? "bg-green-50 text-green-600"
                  : referral.status === "pending"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-gray-100 text-gray-600"
                }`}>
                {referral.status}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">ID-Num</p>
              <h3 className="text-lg font-bold text-foreground">{referral.refId}</h3>
              <p className="text-xs text-muted-foreground mt-1">Joined {referral.joinedDate}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-border/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Invested</span>
                <span className="font-medium">{referral.totalInvested}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Commission</span>
                <span className="font-bold text-green-600">{referral.commission}</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full mt-4" disabled={referral.status === 'pending'}>
              View Details
            </Button>
          </motion.div>
        ))}
        {filteredReferrals.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No referrals found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Referrals;
