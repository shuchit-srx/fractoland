import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const summaryCards = [
  {
    label: "Lands Open for Bidding",
    value: "2",
    subtext: "Lands currently accepting developer bids",
  },
  {
    label: "Total Bids Received",
    value: "7",
    subtext: "Bids submitted across all eligible lands",
  },
  {
    label: "Highest Bid Value",
    value: "₹ 3.1 Cr",
    subtext: "Highest bid received so far",
  },
  {
    label: "Bidding Closing Soon",
    value: "1",
    subtext: "Lands nearing bid deadline",
  },
];

const developerBids = [
  {
    id: 1,
    landName: "Green Valley Hills",
    ref: "GVH-001",
    location: "Whitefield, Bangalore",
    area: "2.5 Acres",
    saleRange: "₹ 2.8 Cr – ₹ 3.2 Cr",
    votingOutcome: "Approved – 78% in favour",
    deadline: "05 Dec 2026",
    topBid: "₹ 3.1 Cr",
    topDeveloper: "XYZ Developers",
  },
  {
    id: 2,
    landName: "Skyline Meadows",
    ref: "SKY-014",
    location: "Hyderabad, Telangana",
    area: "1.8 Acres",
    saleRange: "₹ 1.6 Cr – ₹ 1.9 Cr",
    votingOutcome: "Approved – 64% in favour",
    deadline: "12 Dec 2026",
    topBid: "₹ 1.8 Cr",
    topDeveloper: "SkyRise Infra",
  },
];

const OwnerDeveloperBids = () => {
  const hasBids = developerBids.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Developer Bids</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Review developer interest and bid details for your approved land parcels. All approvals
          and final transactions are coordinated with the FractoLand team for compliance.
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

      {/* Simple list of lands with top bid */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Lands with developer bids</h2>

        {hasBids ? (
          <div className="space-y-3 text-sm">
            {developerBids.map((land, index) => (
              <motion.div
                key={land.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-border/70 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div className="space-y-1">
                  <p className="font-medium text-foreground flex items-center gap-2 text-sm">
                    {land.landName}
                    <span className="text-[11px] text-muted-foreground">({land.ref})</span>
                  </p>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{land.location}</span>
                    <span>•</span>
                    <span>{land.area}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Approved sale range:{" "}
                    <span className="font-medium text-foreground">{land.saleRange}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Voting outcome:{" "}
                    <span className="font-medium text-foreground">{land.votingOutcome}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Highest bid:{" "}
                    <span className="font-medium text-foreground">
                      {land.topBid} by {land.topDeveloper}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                  <span>
                    Bidding deadline:{" "}
                    <span className="font-medium text-foreground">{land.deadline}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2">
            <p className="text-sm font-semibold text-foreground">
              No developer bids have been received yet.
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Bidding will open once voting approval is completed.
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Final bid acceptance is performed in coordination with the FractoLand administration to
        ensure compliance and transparency.
      </p>
    </div>
  );
};

export default OwnerDeveloperBids;
