import LinkWalletCard from "@/components/wallet/LinkWalletCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addFundsInit, formatInr, getPayments, getWalletBalance, paymentCallback, withdrawFunds, type PaymentItem } from "@/lib/dashboardApi";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Clock, CreditCard, Download, Loader2, Plus, Wallet as WalletIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [wallet, payments] = await Promise.all([getWalletBalance(), getPayments({ limit: 50 })]);
      setBalance(wallet.balance);
      setTransactions(payments.items);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const totals = useMemo(() => {
    let deposited = 0;
    let invested = 0;
    let withdrawn = 0;
    let pending = 0;
    for (const tx of transactions) {
      if (tx.status === "pending") pending += tx.amount;
      if (tx.status !== "completed") continue;
      if (tx.type === "add_funds" || tx.type === "royalty" || tx.type === "refund") deposited += tx.amount;
      if (tx.type === "investment") invested += tx.amount;
      if (tx.type === "withdrawal") withdrawn += tx.amount;
    }
    return { deposited, invested, withdrawn, pending };
  }, [transactions]);

  const handleAddFunds = async (method: string) => {
    const amount = parseInt(addAmount, 10);
    if (!addAmount || amount < 1000) {
      toast.error("Minimum amount is ₹1,000");
      return;
    }
    setProcessing(true);
    try {
      const init = await addFundsInit({ amount, currency: "INR", gateway: method.toLowerCase() });
      await paymentCallback({
        gateway_order_id: init.gateway_order_id,
        gateway_payment_id: `pay_${Date.now()}`,
        status: "completed",
      });
      toast.success(`Added ${formatInr(amount)} successfully`);
      setShowAddFunds(false);
      setAddAmount("");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add funds");
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount, 10);
    if (!withdrawAmount || amount < 1000) {
      toast.error("Minimum withdrawal is ₹1,000");
      return;
    }
    if (amount > balance) {
      toast.error("Insufficient balance");
      return;
    }
    setProcessing(true);
    try {
      await withdrawFunds({ amount });
      toast.success("Withdrawal processed successfully.");
      setShowWithdraw(false);
      setWithdrawAmount("");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to withdraw");
    } finally {
      setProcessing(false);
    }
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
            <p className="text-4xl font-bold mt-1">{formatInr(balance)}</p>
            <p className="text-primary-foreground/60 text-sm mt-2">Last updated: Just now</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => setShowAddFunds(true)}
              disabled={processing}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Funds
            </Button>
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => setShowWithdraw(true)}
              disabled={processing}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Link Web3 Wallet (SIWE) */}
      <LinkWalletCard />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Deposited</p>
              <p className="font-semibold text-foreground">{formatInr(totals.deposited)}</p>
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
              <p className="font-semibold text-foreground">{formatInr(totals.invested)}</p>
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
              <p className="font-semibold text-foreground">{formatInr(totals.withdrawn)}</p>
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
              <p className="font-semibold text-foreground">{formatInr(totals.pending)}</p>
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
          {loading ? (
            <div className="py-10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No transactions yet.</p>
          ) : transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "add_funds" || tx.type === "royalty" || tx.type === "refund" ? "bg-green-500/10" : "bg-red-500/10"
                  }`}>
                  {tx.type === "add_funds" || tx.type === "royalty" || tx.type === "refund" ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{tx.description || tx.type.replace("_", " ")}</p>
                  <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${tx.type === "add_funds" || tx.type === "royalty" || tx.type === "refund" ? "text-green-600" : "text-red-600"}`}>
                  {(tx.type === "add_funds" || tx.type === "royalty" || tx.type === "refund" ? "+" : "-") + formatInr(tx.amount)}
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
                disabled={processing}
                className="w-full p-4 bg-secondary/50 rounded-xl flex items-center gap-3 hover:bg-secondary transition-colors"
              >
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">UPI</span>
                </div>
                <span className="font-medium">Pay with UPI</span>
              </button>
              <button
                onClick={() => handleAddFunds("Card")}
                disabled={processing}
                className="w-full p-4 bg-secondary/50 rounded-xl flex items-center gap-3 hover:bg-secondary transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium">Credit/Debit Card</span>
              </button>
            </div>

            <Button variant="ghost" className="w-full" onClick={() => setShowAddFunds(false)} disabled={processing}>
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
              <p className="text-2xl font-bold text-foreground">{formatInr(balance)}</p>
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
              <p className="text-xs text-muted-foreground mt-1">Minimum: ₹1,000 • Max: {formatInr(balance)}</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800">
                Funds will be credited to your registered bank account within 2-3 business days.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowWithdraw(false)} disabled={processing}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleWithdraw} disabled={processing}>
                {processing ? "Processing..." : "Withdraw"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
