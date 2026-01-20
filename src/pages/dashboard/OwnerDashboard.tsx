import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bell, Home, MapPin, Users, Vote } from "lucide-react";
import { useNavigate } from "react-router-dom";

const summaryCards = [
  { label: "Total Lands Listed", value: "6", subtext: "Total land parcels submitted to FractoLand" },
  { label: "Active Tokenized Lands", value: "4", subtext: "Lands currently open or active for investment" },
  { label: "Lands Under Voting", value: "1", subtext: "Lands currently in community voting stage" },
  { label: "Total Value Realized", value: "₹ 2.4 Cr", subtext: "Total amount received from completed land sales" },
];

const lands = [
  {
    id: 1,
    name: "Green Valley Hills",
    location: "Whitefield, Bangalore",
    status: "Live for Investment",
    tokens: 2000,
    tokensSold: 1650,
    lockIn: "18 months",
  },
  {
    id: 2,
    name: "Skyline Meadows",
    location: "Hyderabad, Telangana",
    status: "Voting in Progress",
    tokens: 1500,
    tokensSold: 1500,
    lockIn: "24 months",
  },
  {
    id: 3,
    name: "Urban Crest",
    location: "Outer Ring Road, Chennai",
    status: "Under Verification",
    tokens: 1200,
    tokensSold: 0,
    lockIn: "12 months",
  },
];

const investmentProgress = [
  { id: 1, name: "Green Valley Hills", tokensSold: 1650, totalTokens: 2000, investors: 42 },
  { id: 2, name: "Skyline Meadows", tokensSold: 1500, totalTokens: 1500, investors: 37 },
  { id: 3, name: "Urban Crest", tokensSold: 0, totalTokens: 1200, investors: 0 },
];

const votingUpdates = [
  {
    id: 1,
    land: "Skyline Meadows",
    rule: "51% approval",
    votesCast: 32,
    totalVotes: 40,
    timeLeft: "06h 21m left",
  },
];

const developerInterest = [
  { id: 1, land: "Green Valley Hills", bids: 3, highestBid: "₹ 3.2 Cr" },
  { id: 2, land: "Sunrise Fields", bids: 1, highestBid: "₹ 1.8 Cr" },
];

const recentActivity = [
  "Land Green Valley Hills approved and listed",
  "Voting started for Skyline Meadows",
  "Developer bid received for Urban Crest",
  "Sale completed for Sunrise Fields",
];

const verificationStatus = [
  { label: "Identity verification", value: "Verified" },
  { label: "Land documents", value: "Approved" },
  { label: "Bank details", value: "Verified" },
];

const OwnerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.18em]">
            Land Owner Dashboard
          </p>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Home className="w-5 h-5" />
            <span>Welcome back, Land Owner</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Manage your lands, track investor participation, and monitor voting and sale progress in
            one place.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground text-[10px] text-background px-1">
              3
            </span>
          </button>
          <Button
            className="rounded-full h-9 px-5 text-sm"
            onClick={() => navigate("/dashboard/owner/lands/new")}
          >
            + Add New Land
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="bg-card border border-border rounded-2xl p-5 shadow-card"
            >
              <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
              <p className="text-2xl font-semibold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.subtext}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* My Lands + Investment Progress */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* My Lands */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">My Lands</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="hidden md:grid grid-cols-6 gap-3 text-xs text-muted-foreground pb-1 border-b border-border/70">
              <span>Land</span>
              <span>Location</span>
              <span>Status</span>
              <span className="text-right">Total Tokens</span>
              <span className="text-right">Tokens Sold</span>
              <span className="text-right">Lock-in</span>
            </div>
            {lands.map((land) => (
              <div
                key={land.id}
                className="grid md:grid-cols-6 gap-3 items-center py-3 border-b last:border-b-0 border-border/60"
              >
                <div className="md:col-span-1">
                  <p className="font-medium text-foreground text-sm">{land.name}</p>
                </div>
                <div className="md:col-span-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{land.location}</span>
                </div>
                <div className="md:col-span-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] bg-secondary/80 text-foreground">
                    {land.status}
                  </span>
                </div>
                <div className="md:col-span-1 text-right text-xs text-muted-foreground">
                  {land.tokens.toLocaleString()}
                </div>
                <div className="md:col-span-1 text-right text-xs text-muted-foreground">
                  {land.tokensSold.toLocaleString()}
                </div>
                <div className="md:col-span-1 flex md:justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{land.lockIn}</span>
                    <Button variant="outline" size="sm" className="h-7 text-xs px-3 rounded-full">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Progress */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Investment Progress</h2>
          </div>
          <div className="space-y-4 text-sm">
            {investmentProgress.map((item) => {
              const pct = item.totalTokens
                ? Math.round((item.tokensSold / item.totalTokens) * 100)
                : 0;
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {item.tokensSold.toLocaleString()}/{item.totalTokens.toLocaleString()} tokens ·{" "}
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-foreground rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Investors: {item.investors}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Voting + Developer Interest */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Voting Updates */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Voting Updates</h2>
          </div>
          {votingUpdates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active voting sessions right now.</p>
          ) : (
            <div className="space-y-3 text-sm">
              {votingUpdates.map((vote) => (
                <div
                  key={vote.id}
                  className="border border-border rounded-xl p-3 flex flex-col gap-2 bg-secondary/40"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <Vote className="w-4 h-4" />
                      {vote.land}
                    </p>
                    <span className="text-[11px] px-2 py-1 rounded-full bg-background text-muted-foreground">
                      {vote.rule}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Votes: {vote.votesCast}/{vote.totalVotes}
                    </span>
                    <span>{vote.timeLeft}</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs rounded-full self-start">
                    View Voting Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Developer Interest */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Developer Interest</h2>
          </div>
          {developerInterest.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active developer bids at the moment.</p>
          ) : (
            <div className="space-y-3 text-sm">
              {developerInterest.map((dev) => (
                <div
                  key={dev.id}
                  className="flex items-center justify-between border border-border rounded-xl p-3 bg-secondary/40"
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">{dev.land}</p>
                    <p className="text-xs text-muted-foreground">
                      {dev.bids} active bid{dev.bids > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Highest bid</p>
                    <p className="font-semibold text-foreground">{dev.highestBid}</p>
                    <Button variant="outline" size="sm" className="mt-2 h-8 text-xs rounded-full">
                      Review Bids
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity + Verification */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          </div>
          <div className="space-y-2 text-sm">
            {recentActivity.map((item, index) => (
              <div key={index} className="flex items-start gap-2 text-muted-foreground">
                <Bell className="w-4 h-4 mt-0.5" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Verification Status</h2>
          </div>
          <div className="space-y-3 text-sm">
            {verificationStatus.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border border-border rounded-xl px-3 py-2 bg-secondary/40"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{item.label}</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-background text-muted-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
