import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bell, Home, MapPin, Users, Vote, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const summaryCards = [
  { label: "Total Lands Listed", value: "6", subtext: "Total land parcels submitted" },
  { label: "Active Tokenized", value: "4", subtext: "Lands active for investment" },
  { label: "Under Voting", value: "1", subtext: "Lands in community voting" },
  { label: "Value Realized", value: "₹ 2.4 Cr", subtext: "Total from completed sales" },
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

// CHANGED: Use 'xl' breakpoint.
// Below XL (Laptop/Tablet), the table is too wide for the space next to the sidebar.
const GRID_COLS_CLASS = "xl:grid-cols-[1.75fr_1.5fr_1.25fr_1fr_1fr_1.25fr]";

const OwnerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">
            Land Owner Dashboard
          </p>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, Land Owner
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Manage your lands, track investor participation, and monitor voting and sale progress.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shrink-0"
          >
            <Bell className="w-4 h-4" />
          </Button>
          <Button
            className="rounded-full px-5 text-sm"
            onClick={() => navigate("/dashboard/owner/lands/new")}
          >
            + Add New Land
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-xs text-muted-foreground font-medium uppercase mb-2">{card.label}</p>
            <p className="text-2xl font-bold text-foreground mb-1">{card.value}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{card.subtext}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: My Lands & Progress */}
      <div className="grid xl:grid-cols-2 gap-8">

        {/* My Lands Section */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 pb-4 border-b border-border/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">My Lands</h2>
            <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => navigate("/dashboard/owner/lands")}>
              View All <ArrowUpRight className="ml-1 w-3 h-3" />
            </Button>
          </div>

          <div className="p-0">
            {/* Desktop Header (Only visible on XL+) */}
            <div className={`hidden xl:grid ${GRID_COLS_CLASS} gap-4 px-6 py-3 bg-secondary/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border`}>
              <span>Property</span>
              <span>Location</span>
              <span>Status</span>
              <span className="text-right">Tokens</span>
              <span className="text-right">Sold</span>
              <span className="text-right">Action</span>
            </div>

            <div className="divide-y divide-border/60">
              {lands.map((land) => (
                <div
                  key={land.id}
                  // Responsive Grid: Block on Mobile, Grid on XL
                  className={`p-4 xl:px-6 xl:py-4 grid grid-cols-1 xl:grid-cols-[1.75fr_1.5fr_1.25fr_1fr_1fr_1.25fr] gap-y-3 gap-x-4 items-center hover:bg-secondary/20 transition-colors`}
                >
                  {/* Name */}
                  <div className="font-medium text-foreground text-sm flex justify-between xl:block">
                    <span>{land.name}</span>
                    <span className="xl:hidden inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-secondary border border-border">
                      {land.status}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground xl:col-span-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-primary/60" />
                    <span className="truncate">{land.location}</span>
                  </div>

                  {/* Status (Desktop Only) */}
                  <div className="hidden xl:block">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-secondary text-foreground border border-border/50">
                      {land.status}
                    </span>
                  </div>

                  {/* Stats Row for Mobile */}
                  <div className="grid grid-cols-2 gap-4 xl:hidden mt-1 bg-secondary/20 p-2 rounded-lg border border-border/50">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">Total Tokens</p>
                      <p className="text-sm font-medium">{land.tokens.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">Tokens Sold</p>
                      <p className="text-sm font-medium">{land.tokensSold.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Desktop Stats */}
                  <div className="hidden xl:block text-right text-xs text-muted-foreground font-medium">
                    {land.tokens.toLocaleString()}
                  </div>
                  <div className="hidden xl:block text-right text-xs text-muted-foreground font-medium">
                    {land.tokensSold.toLocaleString()}
                  </div>

                  {/* Action */}
                  <div className="flex justify-end xl:justify-end mt-2 xl:mt-0">
                    <Button variant="outline" size="sm" className="h-8 text-xs rounded-full w-full xl:w-auto">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Investment Progress */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Investment Progress</h2>
          </div>
          <div className="space-y-6">
            {investmentProgress.map((item) => {
              const pct = item.totalTokens
                ? Math.round((item.tokensSold / item.totalTokens) * 100)
                : 0;
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-medium text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.investors} Investors</p>
                    </div>
                    <span className="text-xs font-semibold text-primary">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>0 Tokens</span>
                    <span>{item.totalTokens.toLocaleString()} Tokens</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Voting + Interest Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Voting Updates */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Voting Updates</h2>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium border border-amber-200">Live</span>
          </div>

          <div className="space-y-3">
            {votingUpdates.map((vote) => (
              <div
                key={vote.id}
                className="border border-border rounded-xl p-4 bg-secondary/10 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Vote className="w-4 h-4 text-primary" />
                    <p className="font-medium text-foreground text-sm">{vote.land}</p>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-background border border-border">
                    {vote.rule}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{vote.votesCast}/{vote.totalVotes} votes</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[80%]" />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-amber-600 font-medium">{vote.timeLeft}</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs hover:bg-background">Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          </div>
          <div className="relative pl-2 border-l border-border/60 space-y-6 my-2">
            {recentActivity.map((item, index) => (
              <div key={index} className="relative pl-4">
                <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-background border-2 border-primary" />
                <p className="text-sm text-foreground">{item}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Today, 10:23 AM</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;