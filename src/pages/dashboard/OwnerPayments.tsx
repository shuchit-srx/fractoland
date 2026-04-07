import { formatInr } from "@/lib/dashboardApi";
import { listOwnerProceeds } from "@/lib/ownersApi";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const OwnerPayments = () => {
  const [summary, setSummary] = useState<{
    total_received: number;
    transaction_count: number;
    venture_count: number;
  } | null>(null);
  const [items, setItems] = useState<
    { id: string; venture_name: string | null; amount: number; created_at: string; token_count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listOwnerProceeds({ limit: 100 });
      setSummary(res.summary);
      setItems(res.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const hasTransactions = items.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payments &amp; Settlements</h1>
        <p className="text-sm text-muted-foreground">
          Proceeds from completed token sales on your listed lands (gross amounts before platform fees).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total received (completed sales)", value: formatInr(summary?.total_received ?? 0) },
          { label: "Transactions", value: loading ? "—" : String(summary?.transaction_count ?? 0) },
          { label: "Listed lands", value: loading ? "—" : String(summary?.venture_count ?? 0) },
          { label: "Pending settlements", value: "—", sub: "Use admin workflows when wired" },
        ].map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="bg-card border border-border rounded-2xl p-4 shadow-card"
          >
            <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
            <p className="text-2xl font-semibold text-foreground">{card.value}</p>
            {"sub" in card && card.sub ? <p className="text-xs text-muted-foreground mt-1">{card.sub}</p> : null}
          </motion.div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Transaction history</h2>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground py-4">Loading…</p>
        ) : hasTransactions ? (
          <div className="space-y-3 text-sm">
            <div className="hidden md:grid grid-cols-5 gap-3 text-[11px] text-muted-foreground border-b border-border/80 pb-2">
              <span>ID</span>
              <span>Land</span>
              <span>Tokens</span>
              <span>Amount</span>
              <span className="text-right">Date</span>
            </div>
            {items.map((txn) => (
              <div
                key={txn.id}
                className="grid md:grid-cols-5 gap-3 items-center border-b last:border-b-0 border-border/60 py-3 text-xs text-muted-foreground"
              >
                <span className="font-mono text-[10px] text-foreground truncate">{txn.id.slice(0, 8)}…</span>
                <span>{txn.venture_name || "—"}</span>
                <span>{txn.token_count}</span>
                <span className="text-foreground font-medium">{formatInr(txn.amount)}</span>
                <span className="md:text-right">{new Date(txn.created_at).toLocaleDateString("en-IN")}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2">
            <p className="text-sm font-semibold text-foreground">No payment records yet.</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              When investors complete purchases on your lands, they appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerPayments;
