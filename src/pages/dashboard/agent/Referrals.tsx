import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Filter, Mail, Phone, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const referrals = [
  {
    id: 1,
    name: "Amit Kumar",
    email: "amit.kumar@email.com",
    phone: "+91 98765 43210",
    status: "active",
    joinedDate: "Nov 15, 2024",
    totalInvested: "₹2,50,000",
    investments: 2,
    commission: "₹5,000",
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya.singh@email.com",
    phone: "+91 98765 43211",
    status: "active",
    joinedDate: "Nov 20, 2024",
    totalInvested: "₹1,75,000",
    investments: 1,
    commission: "₹3,500",
  },
  {
    id: 3,
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91 98765 43212",
    status: "pending",
    joinedDate: "Dec 10, 2024",
    totalInvested: "-",
    investments: 0,
    commission: "-",
  },
  {
    id: 4,
    name: "Sneha Patel",
    email: "sneha.patel@email.com",
    phone: "+91 98765 43213",
    status: "active",
    joinedDate: "Oct 25, 2024",
    totalInvested: "₹3,00,000",
    investments: 3,
    commission: "₹6,000",
  },
  {
    id: 5,
    name: "Vikram Reddy",
    email: "vikram.reddy@email.com",
    phone: "+91 98765 43214",
    status: "active",
    joinedDate: "Nov 5, 2024",
    totalInvested: "₹4,50,000",
    investments: 4,
    commission: "₹9,000",
  },
  {
    id: 6,
    name: "Anita Desai",
    email: "anita.desai@email.com",
    phone: "+91 98765 43215",
    status: "inactive",
    joinedDate: "Sep 15, 2024",
    totalInvested: "₹50,000",
    investments: 1,
    commission: "₹1,000",
  },
];

const Referrals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReferral, setSelectedReferral] = useState<typeof referrals[0] | null>(null);

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.email.toLowerCase().includes(searchTerm.toLowerCase());
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
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Referrals</h1>
          <p className="text-muted-foreground mt-1">Manage and track your referred users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              placeholder="Search by name or email..."
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

        {/* Referrals Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contact</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Invested</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Commission</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.map((referral, index) => (
                  <motion.tr
                    key={referral.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-secondary/20"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">{referral.name[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{referral.name}</p>
                          <p className="text-xs text-muted-foreground">Joined {referral.joinedDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="text-foreground">{referral.email}</p>
                        <p className="text-muted-foreground">{referral.phone}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        referral.status === "active"
                          ? "bg-green-50 text-green-600"
                          : referral.status === "pending"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">{referral.totalInvested}</p>
                      <p className="text-xs text-muted-foreground">{referral.investments} investments</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-green-600">{referral.commission}</p>
                    </td>
                    <td className="p-4">
                      <Button size="sm" variant="outline" onClick={() => setSelectedReferral(referral)}>
                        View
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referral Detail Modal */}
        {selectedReferral && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-2xl">{selectedReferral.name[0]}</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{selectedReferral.name}</h2>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    selectedReferral.status === "active"
                      ? "bg-green-50 text-green-600"
                      : selectedReferral.status === "pending"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {selectedReferral.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedReferral.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedReferral.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">Joined {selectedReferral.joinedDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">Total Invested</p>
                  <p className="font-bold text-foreground">{selectedReferral.totalInvested}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">Your Commission</p>
                  <p className="font-bold text-green-600">{selectedReferral.commission}</p>
                </div>
              </div>

              <Button className="w-full" onClick={() => setSelectedReferral(null)}>
                Close
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Referrals;
