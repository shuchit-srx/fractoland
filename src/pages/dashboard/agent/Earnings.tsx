import { Button } from "@/components/ui/button";
import { formatInr } from "@/lib/dashboardApi";
import { getAgentEarnings, getAgentLedger, requestAgentWithdrawal, type AgentLedgerRow } from "@/lib/referralsApi";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Building, Calendar, Download, TrendingUp, Wallet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const bankDetails = {
  accountName: "Linked bank (configure in profile)",
  accountNumber: "—",
  bankName: "—",
  ifsc: "—",
};

const Earnings = () => {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [summary, setSummary] = useState<{
    total_credited: number;
    available_balance: number;
    pending_withdrawals: number;
    completed_withdrawals: number;
    commission_rate: number;
  } | null>(null);
  const [ledger, setLedger] = useState<AgentLedgerRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, l] = await Promise.all([getAgentEarnings(), getAgentLedger({ limit: 40 })]);
      setSummary(s);
      setLedger(l.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load earnings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleWithdraw = async () => {
    const amt = Number(withdrawAmount);
    if (!withdrawAmount || !Number.isFinite(amt) || amt < 500) {
      toast.error("Minimum withdrawal is ₹500");
      return;
    }
    if (summary && amt > summary.available_balance) {
      toast.error("Insufficient available balance");
      return;
    }
    try {
      await requestAgentWithdrawal(amt);
      toast.success("Withdrawal request submitted (pending review).");
      setShowWithdraw(false);
      setWithdrawAmount("");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Withdrawal failed");
    }
  };

  const ratePct = summary?.commission_rate != null ? Math.round(summary.commission_rate * 100) : 2;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Earnings</h1>
        <p className="text-muted-foreground mt-1">Track your commissions and withdrawals</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-primary-foreground/80 text-sm">Available for withdrawal</p>
            <p className="text-4xl font-bold mt-1">
              {loading ? "—" : formatInr(summary?.available_balance ?? 0)}
            </p>
            <p className="text-primary-foreground/60 text-sm mt-2">
              {ratePct}% commission on attributed investments
            </p>
          </div>
          <Button
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-0"
            type="button"
            onClick={() => setShowWithdraw(true)}
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Withdraw funds
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total credited</p>
              <p className="font-semibold text-foreground">
                {loading ? "—" : formatInr(summary?.total_credited ?? 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completed withdrawals</p>
              <p className="font-semibold text-foreground">
                {loading ? "—" : formatInr(summary?.completed_withdrawals ?? 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending withdrawal</p>
              <p className="font-semibold text-foreground">
                {loading ? "—" : formatInr(summary?.pending_withdrawals ?? 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ledger rows</p>
              <p className="font-semibold text-foreground">{loading ? "—" : ledger.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Bank account</h2>
          <Button variant="outline" size="sm" type="button">
            Edit
          </Button>
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

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Transaction history</h2>
          <Button variant="outline" size="sm" type="button">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : ledger.length === 0 ? (
            <p className="text-sm text-muted-foreground">No earnings activity yet.</p>
          ) : (
            ledger.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === "withdrawal" ? "bg-red-500/10" : "bg-green-500/10"
                    }`}
                  >
                    {tx.type === "withdrawal" ? (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm capitalize">
                      {tx.type === "withdrawal" ? "Withdrawal request" : `${tx.type} credit`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.type === "withdrawal" ? "text-red-600" : "text-green-600"}`}>
                    {tx.type === "withdrawal" ? "−" : "+"}
                    {formatInr(Number(tx.amount))}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Withdraw funds</h2>
            <div className="bg-secondary/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-muted-foreground">Available balance</p>
              <p className="text-2xl font-bold text-foreground">{formatInr(summary?.available_balance ?? 0)}</p>
            </div>
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-2 block">Amount (INR)</label>
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
              <p className="text-xs text-muted-foreground mt-1">Minimum: ₹500</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" type="button" onClick={() => setShowWithdraw(false)}>
                Cancel
              </Button>
              <Button className="flex-1" type="button" onClick={handleWithdraw}>
                Submit request
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Earnings;
