import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Download, Calendar, CreditCard, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";

const earnings = [
  { id: 1, type: "commission", investor: "Amit Kumar", land: "Green Valley A12", amount: "+₹5,000", date: "Dec 12, 2024", status: "credited" },
  { id: 2, type: "commission", investor: "Sneha Patel", land: "Sunrise Estate B7", amount: "+₹6,000", date: "Dec 10, 2024", status: "credited" },
  { id: 3, type: "withdrawal", investor: "-", land: "-", amount: "-₹15,000", date: "Dec 8, 2024", status: "completed" },
  { id: 4, type: "commission", investor: "Priya Singh", land: "Metro Park C3", amount: "+₹3,500", date: "Dec 5, 2024", status: "credited" },
  { id: 5, type: "commission", investor: "Vikram Reddy", land: "Lake View D9", amount: "+₹9,000", date: "Dec 3, 2024", status: "credited" },
  { id: 6, type: "withdrawal", investor: "-", land: "-", amount: "-₹20,000", date: "Nov 28, 2024", status: "completed" },
  { id: 7, type: "bonus", investor: "-", land: "-", amount: "+₹10,000", date: "Nov 25, 2024", status: "credited" },
];

const bankDetails = {
  accountName: "Mike Agent",
  accountNumber: "XXXX XXXX 4521",
  bankName: "HDFC Bank",
  ifsc: "HDFC0001234",
};

const Earnings = () => {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleWithdraw = () => {
    if (!withdrawAmount || parseInt(withdrawAmount) < 1000) {
      toast.error("Minimum withdrawal is ₹1,000");
      return;
    }
    if (parseInt(withdrawAmount) > 35000) {
      toast.error("Insufficient balance");
      return;
    }
    toast.success("Withdrawal initiated! Funds will be credited in 2-3 business days.");
    setShowWithdraw(false);
    setWithdrawAmount("");
  };

  const totalEarnings = earnings
    .filter(e => e.type === "commission" || e.type === "bonus")
    .reduce((sum, e) => sum + parseInt(e.amount.replace(/[^0-9]/g, "")), 0);

  const totalWithdrawn = earnings
    .filter(e => e.type === "withdrawal")
    .reduce((sum, e) => sum + parseInt(e.amount.replace(/[^0-9]/g, "")), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Earnings</h1>
          <p className="text-muted-foreground mt-1">Track your commissions and withdrawals</p>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-primary-foreground/80 text-sm">Available for Withdrawal</p>
              <p className="text-4xl font-bold mt-1">₹35,000</p>
              <p className="text-primary-foreground/60 text-sm mt-2">2% commission on all investments</p>
            </div>
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => setShowWithdraw(true)}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Withdraw Funds
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Earned</p>
                <p className="font-semibold text-foreground">₹{totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Withdrawn</p>
                <p className="font-semibold text-foreground">₹{totalWithdrawn.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="font-semibold text-foreground">₹23,500</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="font-semibold text-foreground">₹0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Bank Account</h2>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
          <div className="flex items-center gap-4 bg-secondary/50 rounded-xl p-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{bankDetails.bankName}</p>
              <p className="text-sm text-muted-foreground">{bankDetails.accountNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-foreground">{bankDetails.accountName}</p>
              <p className="text-xs text-muted-foreground">IFSC: {bankDetails.ifsc}</p>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="space-y-3">
            {earnings.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === "withdrawal" ? "bg-red-500/10" : "bg-green-500/10"
                  }`}>
                    {tx.type === "withdrawal" ? (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {tx.type === "commission" && `Commission from ${tx.investor}`}
                      {tx.type === "withdrawal" && "Withdrawal to Bank"}
                      {tx.type === "bonus" && "Performance Bonus"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tx.type === "commission" ? tx.land : tx.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.type === "withdrawal" ? "text-red-600" : "text-green-600"}`}>
                    {tx.amount}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Withdraw Modal */}
        {showWithdraw && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background rounded-2xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">Withdraw Funds</h2>

              <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-foreground">₹35,000</p>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">Withdraw Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    className="pl-8"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Minimum: ₹1,000</p>
              </div>

              <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                <p className="text-sm font-medium text-foreground mb-2">Withdraw to:</p>
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-foreground">{bankDetails.bankName} - {bankDetails.accountNumber}</p>
                    <p className="text-xs text-muted-foreground">{bankDetails.accountName}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-amber-800">
                  Funds will be credited within 2-3 business days.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowWithdraw(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleWithdraw}>
                  Withdraw
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Earnings;
