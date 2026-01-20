import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const summary = {
  totalSessions: 3,
  active: 1,
  approved: 1,
  rejected: 1,
};

const ownerVotes = [
  {
    id: 1,
    land: "Green Valley Hills (GVH-001)",
    type: "Resale Approval",
    rule: "51% Majority",
    status: "Active",
    period: "01 Dec 2026 – 05 Dec 2026",
    eligibleVoters: 100,
    votesCast: 72,
    timeLeft: "1 day 6 hours remaining",
  },
  {
    id: 2,
    land: "Skyline Meadows (SKY-014)",
    type: "Lock-in Extension",
    rule: "100% Required",
    status: "Closed",
    period: "10 Nov 2026 – 14 Nov 2026",
    eligibleVoters: 84,
    votesCast: 80,
    outcome: "Approved",
  },
  {
    id: 3,
    land: "Urban Crest (URC-009)",
    type: "Policy Decision",
    rule: "Board Decision",
    status: "Closed",
    period: "01 Oct 2026 – 03 Oct 2026",
    eligibleVoters: 60,
    votesCast: 48,
    outcome: "Rejected",
  },
];

const OwnerVoting = () => {
  const hasVotes = ownerVotes.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Voting & Decisions</h1>
          <p className="text-sm text-muted-foreground">
            Monitor voting activity and outcomes for your listed lands. All votes are recorded
            transparently and governed by FractoLand rules.
          </p>
        </div>
        <Button
          className="rounded-full h-9 px-5 text-sm"
          variant="default"
          type="button"
        >
          + Start New Voting
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
          <p className="text-xs text-muted-foreground mb-1">Total Voting Sessions</p>
          <p className="text-2xl font-semibold text-foreground">{summary.totalSessions}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Total votes conducted for your lands
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
          <p className="text-xs text-muted-foreground mb-1">Active Voting</p>
          <p className="text-2xl font-semibold text-foreground">{summary.active}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Voting currently in progress
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
          <p className="text-xs text-muted-foreground mb-1">Approved Decisions</p>
          <p className="text-2xl font-semibold text-foreground">{summary.approved}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Votes that passed approval
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
          <p className="text-xs text-muted-foreground mb-1">Rejected Decisions</p>
          <p className="text-2xl font-semibold text-foreground">{summary.rejected}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Votes that did not meet approval criteria
          </p>
        </div>
      </div>

      {/* Voting list or empty state */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Voting Sessions</h2>
        </div>

        {hasVotes ? (
          <div className="space-y-3 text-sm">
            {ownerVotes.map((vote) => {
              const participation =
                vote.eligibleVoters > 0
                  ? Math.round((vote.votesCast / vote.eligibleVoters) * 100)
                  : 0;

              return (
                <motion.div
                  key={vote.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-border/70 rounded-xl p-4 space-y-3"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground text-sm">{vote.land}</p>
                      <p className="text-xs text-muted-foreground">
                        {vote.type} · Rule: {vote.rule}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Voting period: {vote.period}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full border border-border text-muted-foreground">
                      {vote.status}
                    </span>
                  </div>

                  {vote.status === "Active" && (
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>
                          Eligible voters:{" "}
                          <span className="font-medium text-foreground">
                            {vote.eligibleVoters}
                          </span>
                        </span>
                        <span>
                          Votes cast:{" "}
                          <span className="font-medium text-foreground">
                            {vote.votesCast}
                          </span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-foreground rounded-full"
                          style={{ width: `${participation}%` }}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span>{participation}% participation</span>
                        <span>{vote.timeLeft}</span>
                      </div>
                    </div>
                  )}

                  {vote.status === "Closed" && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Outcome: {vote.outcome}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2">
            <p className="text-sm font-semibold text-foreground">
              No voting sessions have been initiated yet.
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Voting will be available once the lock-in period ends.
            </p>
          </div>
        )}
      </div>

      {/* Info note */}
      <p className="text-xs text-muted-foreground">
        Certain decisions may be finalized by the FractoLand board in exceptional situations.
      </p>
    </div>
  );
};

export default OwnerVoting;
