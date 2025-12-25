import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { MapPin, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const landSummary = {
  total: 6,
  active: 4,
  voting: 1,
  sold: 1,
};

const ownerLands = [
  {
    id: 1,
    name: "Green Valley Hills",
    ref: "GVH-001",
    location: "Whitefield, Bangalore",
    area: "2.5 Acres",
    status: "Live for Investment",
    tokens: 2000,
    tokensSold: 1650,
    investors: 42,
    lockIn: "18 months",
    lockInEnd: "12 Dec 2026",
    votingDate: "15 Dec 2026",
  },
  {
    id: 2,
    name: "Skyline Meadows",
    ref: "SKY-014",
    location: "Hyderabad, Telangana",
    area: "1.8 Acres",
    status: "Voting in Progress",
    tokens: 1500,
    tokensSold: 1500,
    investors: 37,
    lockIn: "24 months",
    lockInEnd: "03 Aug 2026",
    votingDate: "04 Aug 2026",
  },
  {
    id: 3,
    name: "Urban Crest",
    ref: "URC-009",
    location: "Outer Ring Road, Chennai",
    area: "3.1 Acres",
    status: "Under Verification",
    tokens: 1200,
    tokensSold: 0,
    investors: 0,
    lockIn: "12 months",
    lockInEnd: "-",
    votingDate: "-",
  },
];

const getStatusClasses = (status: string) => {
  if (status === "Live for Investment") {
    return "bg-green-100 text-green-700 border border-green-200";
  }
  if (status === "Sold / Closed") {
    return "bg-zinc-900 text-zinc-50 border border-zinc-900";
  }
  return "bg-secondary/80 text-foreground border border-border/80";
};

const OwnerLands = () => {
  const navigate = useNavigate();
  const hasLands = ownerLands.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Lands</h1>
            <p className="text-sm text-muted-foreground">
              Track the status, investment progress, and lifecycle of your listed land parcels.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 rounded-full text-xs">
              <Filter className="w-3 h-3" />
              Filters
            </Button>
            <Button
              className="rounded-full h-9 px-5 text-sm"
              onClick={() => navigate("/dashboard/owner/lands/new")}
            >
              + Add New Land
            </Button>
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-card border border-border rounded-2xl p-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Total Lands</span>
            <span className="font-semibold text-foreground">{landSummary.total}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Active Lands</span>
            <span className="font-semibold text-foreground">{landSummary.active}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Lands in Voting</span>
            <span className="font-semibold text-foreground">{landSummary.voting}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Sold Lands</span>
            <span className="font-semibold text-foreground">{landSummary.sold}</span>
          </div>
        </div>

        {/* List / Empty state */}
        {hasLands ? (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <div className="hidden lg:grid grid-cols-9 gap-3 text-[11px] text-muted-foreground border-b border-border/80 pb-2 mb-2">
              <span className="col-span-2">Land</span>
              <span className="col-span-2">Location</span>
              <span className="col-span-1">Status</span>
              <span className="col-span-1 text-right">Tokens</span>
              <span className="col-span-1 text-right">Sold</span>
              <span className="col-span-2 text-right">Lock-in / Voting</span>
            </div>

            <div className="space-y-3 text-sm">
              {ownerLands.map((land) => {
                const pct =
                  land.tokens > 0 ? Math.round((land.tokensSold / land.tokens) * 100) : 0;

                return (
                  <motion.div
                    key={land.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-border/70 rounded-xl p-3 lg:p-4 space-y-2"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground flex items-center gap-2 text-sm">
                          {land.name}
                          <span className="text-[11px] text-muted-foreground">({land.ref})</span>
                        </p>
                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{land.location}</span>
                          <span>•</span>
                          <span>{land.area}</span>
                        </p>
                      </div>
                      <span
                        className={
                          "inline-flex items-center px-2 py-1 rounded-full text-[11px] " +
                          getStatusClasses(land.status)
                        }
                      >
                        {land.status}
                      </span>
                    </div>

                    {/* Token & investment progress */}
                    <div className="grid lg:grid-cols-4 gap-3 items-center">
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Total tokens</span>
                          <span className="font-medium text-foreground">
                            {land.tokens.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tokens sold</span>
                          <span className="font-medium text-foreground">
                            {land.tokensSold.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Investment progress</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full bg-foreground rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Investors: {land.investors}
                        </p>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Lock-in period</span>
                          <span className="font-medium text-foreground">{land.lockIn}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lock-in ends</span>
                          <span className="font-medium text-foreground">{land.lockInEnd}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Voting eligible from</span>
                          <span className="font-medium text-foreground">{land.votingDate}</span>
                        </div>
                      </div>
                      <div className="flex lg:justify-end items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs rounded-full"
                          onClick={() => navigate(`/dashboard/owner/land/${land.id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs rounded-full"
                          onClick={() => navigate(`/dashboard/owner/land/${land.id}?tab=docs`)}
                        >
                          Manage Docs
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-3">
            <p className="text-base font-semibold text-foreground">No lands added yet</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You haven’t added any land yet. Start by submitting your first land parcel for
              tokenization.
            </p>
            <Button
              className="rounded-full mt-2"
              onClick={() => navigate("/dashboard/owner/lands/new")}
            >
              + Add New Land
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OwnerLands;


