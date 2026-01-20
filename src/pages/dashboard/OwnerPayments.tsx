import { motion } from "framer-motion";

const summaryCards = [
  { label: "Total Amount Received", value: "₹ 2.4 Cr", subtext: "Total payouts completed so far" },
  { label: "Pending Settlements", value: "₹ 75 L", subtext: "Amount awaiting settlement" },
  { label: "Lands Under Settlement", value: "1", subtext: "Lands currently in sale finalization stage" },
  { label: "Total Transactions", value: "14", subtext: "Number of payment transactions recorded" },
];

const transactions = [
  {
    id: "TXN-1023",
    land: "Green Valley Hills",
    amount: "₹ 1.2 Cr",
    type: "Credit",
    date: "12 Dec 2026",
    status: "Completed",
  },
  {
    id: "TXN-1019",
    land: "Skyline Meadows",
    amount: "₹ 75,00,000",
    type: "Credit",
    date: "02 Dec 2026",
    status: "Pending",
  },
  {
    id: "TXN-1018",
    land: "Urban Crest",
    amount: "₹ 15,00,000",
    type: "Adjustment",
    date: "20 Nov 2026",
    status: "Completed",
  },
];

const settlements = [
  {
    land: "Green Valley Hills",
    saleValue: "₹ 3.1 Cr",
    developerStatus: "Completed",
    customerStatus: "Completed",
    ownerStatus: "Completed",
  },
  {
    land: "Skyline Meadows",
    saleValue: "₹ 1.8 Cr",
    developerStatus: "In Process",
    customerStatus: "Pending",
    ownerStatus: "Pending",
  },
];

const OwnerPayments = () => {
  const hasTransactions = transactions.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payments &amp; Settlements</h1>
        <p className="text-sm text-muted-foreground">
          Track financial transactions and settlement status for your land sales.
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

      {/* Transactions */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
        </div>
        {hasTransactions ? (
          <div className="space-y-3 text-sm">
            <div className="hidden md:grid grid-cols-6 gap-3 text-[11px] text-muted-foreground border-b border-border/80 pb-2">
              <span>Transaction ID</span>
              <span>Land Name</span>
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
            <p className="text-sm font-semibold text-foreground">
              No payment records available yet.
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Completed land sales will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Settlement details */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Settlement Details</h2>
        <div className="space-y-3 text-sm">
          <div className="hidden md:grid grid-cols-5 gap-3 text-[11px] text-muted-foreground border-b border-border/80 pb-2">
            <span>Land</span>
            <span>Approved Sale Value</span>
            <span>Developer Payment</span>
            <span>Customer Payout</span>
            <span className="text-right">Owner Settlement</span>
          </div>
          {settlements.map((row) => (
            <div
              key={row.land}
              className="grid md:grid-cols-5 gap-3 items-center border-b last:border-b-0 border-border/60 py-3 text-xs text-muted-foreground"
            >
              <span className="font-medium text-foreground">{row.land}</span>
              <span>{row.saleValue}</span>
              <span>{row.developerStatus}</span>
              <span>{row.customerStatus}</span>
              <span className="flex justify-end">{row.ownerStatus}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Transparent tracking of all financial settlements and payouts.
      </p>
    </div>
  );
};

export default OwnerPayments;
