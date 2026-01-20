import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Clock, CreditCard, Download, Plus, Wallet as WalletIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const transactions = [
  { id: 1, type: "credit", description: "Added funds via UPI", amount: "+₹50,000", date: "Dec 12, 2024", status: "completed" },
  { id: 2, type: "debit", description: "Investment in Green Valley A12", amount: "-₹25,000", date: "Dec 10, 2024", status: "completed" },
  { id: 3, type: "credit", description: "ROI payout - Metro Park C3", amount: "+₹8,500", date: "Dec 5, 2024", status: "completed" },
  { id: 4, type: "debit", description: "Investment in Sunrise Estate B7", amount: "-₹50,000", date: "Nov 28, 2024", status: "completed" },
  { id: 5, type: "credit", description: "Added funds via Card", amount: "+₹1,00,000", date: "Nov 25, 2024", status: "completed" },
  { id: 6, type: "debit", description: "Investment in Lake View D9", amount: "-₹75,000", date: "Nov 20, 2024", status: "completed" },
];

const Wallet = () => {
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleAddFunds = (method: string) => {
    if (!addAmount || parseInt(addAmount) < 1000) {
      toast.error("Minimum amount is ₹1,000");
      return;
    }
    toast.success(`Adding ₹${parseInt(addAmount).toLocaleString()} via ${method}...`);
    setTimeout(() => {
      toast.success("Funds added successfully!");
      setShowAddFunds(false);
      setAddAmount("");
    }, 1500);
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseInt(withdrawAmount) < 1000) {
      toast.error("Minimum withdrawal is ₹1,000");
      return;
    }
    if (parseInt(withdrawAmount) > 25000) {
      toast.error("Insufficient balance");
      return;
    }
    toast.success("Withdrawal initiated. Funds will be credited in 2-3 business days.");
    setShowWithdraw(false);
    setWithdrawAmount("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Wallet</h1>
        <p className="text-muted-foreground mt-1">Manage your funds and transactions</p>
      </div>

      {/* Wallet Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-primary-foreground/80 text-sm">Available Balance</p>
            <p className="text-4xl font-bold mt-1">₹25,000</p>
            <p className="text-primary-foreground/60 text-sm mt-2">Last updated: Just now</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => setShowAddFunds(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Funds
            </Button>
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => setShowWithdraw(true)}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Deposited</p>
              <p className="font-semibold text-foreground">₹7,50,000</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Invested</p>
              <p className="font-semibold text-foreground">₹5,50,000</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <WalletIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Withdrawn</p>
              <p className="font-semibold text-foreground">₹1,75,000</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="font-semibold text-foreground">₹0</p>
            </div>
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
          {transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "credit" ? "bg-green-500/10" : "bg-red-500/10"
                  }`}>
                  {tx.type === "credit" ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {tx.amount}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Add Funds</h2>

            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-2 block">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  className="pl-8"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Minimum: ₹1,000</p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleAddFunds("UPI")}
                className="w-full p-4 bg-secondary/50 rounded-xl flex items-center gap-3 hover:bg-secondary transition-colors"
              >
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">UPI</span>
                </div>
                <span className="font-medium">Pay with UPI</span>
              </button>
              <button
                onClick={() => handleAddFunds("Card")}
                className="w-full p-4 bg-secondary/50 rounded-xl flex items-center gap-3 hover:bg-secondary transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium">Credit/Debit Card</span>
              </button>
            </div>

            <Button variant="ghost" className="w-full" onClick={() => setShowAddFunds(false)}>
              Cancel
            </Button>
          </motion.div>
        </div>
      )}

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
              <p className="text-2xl font-bold text-foreground">₹25,000</p>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-2 block">Amount to Withdraw</label>
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
              <p className="text-xs text-muted-foreground mt-1">Minimum: ₹1,000 • Max: ₹25,000</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800">
                Funds will be credited to your registered bank account within 2-3 business days.
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
  );
};

export default Wallet;
