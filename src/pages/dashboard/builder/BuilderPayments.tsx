import DashboardLayout from "@/components/dashboard/DashboardLayout";

const BuilderPayments = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">
            Manage invoices, transactions, and settlements for your purchases.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Payment Overview</h2>
          <p className="text-sm text-muted-foreground">
            Track pending payments, completed settlements, and transaction history.
          </p>
          <div className="text-xs text-muted-foreground">
            Placeholder view — plug in your payment invoices, transaction tables, and settlement
            status here.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BuilderPayments;

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";

const summaryCards = [
  { label: "Total Amount Received", value: "₹ 0.0 Cr", subtext: "Payouts completed so far" },
  { label: "Pending Payments", value: "₹ 0", subtext: "Awaiting settlement" },
  { label: "Lands Under Settlement", value: "0", subtext: "Deals in finalization" },
  { label: "Total Transactions", value: "0", subtext: "Payments recorded" },
];

const transactions: Array<{
  id: string;
  land: string;
  amount: string;
  type: string;
  date: string;
  status: string;
}> = [];

const BuilderPayments = () => {
  const hasTransactions = transactions.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">
            Manage invoices, settlements, and payout status for your purchases.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="bg-card border border-border rounded-2xl p-4 shadow-card"
            >
              <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
              <p className="text-2xl font-semibold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.subtext}</p>
            </motion.div>
          ))}
        </div>

        {/* Transaction history */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
          </div>

          {hasTransactions ? (
            <div className="space-y-3 text-sm">
              <div className="hidden md:grid grid-cols-6 gap-3 text-[11px] text-muted-foreground border-b border-border/80 pb-2">
                <span>Transaction ID</span>
                <span>Land</span>
                <span>Amount</span>
                <span>Type</span>
                <span>Date</span>
                <span className="text-right">Status</span>
              </div>
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="grid md:grid-cols-6 gap-3 items-center border-b last:border-b-0 border-border/60 py-3 text-xs text-muted-foreground"
                >
                  <span className="font-medium text-foreground">{txn.id}</span>
                  <span>{txn.land}</span>
                  <span>{txn.amount}</span>
                  <span>{txn.type}</span>
                  <span>{txn.date}</span>
                  <span className="flex justify-end">
                    <span className="inline-flex px-2 py-1 rounded-full border border-border text-[11px]">
                      {txn.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm font-semibold text-foreground">No payment records available yet.</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Once a land purchase is finalized, its payment records will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BuilderPayments;


