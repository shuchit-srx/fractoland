import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Clock, Vote, CheckCircle2, AlertCircle, Plus } from "lucide-react";

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
    color: "bg-blue-500",
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
    color: "bg-green-500",
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
    color: "bg-red-500",
  },
];

// Dummy lands for the dropdown
const myLands = [
  { id: "GVH-001", name: "Green Valley Hills" },
  { id: "SKY-014", name: "Skyline Meadows" },
  { id: "URC-009", name: "Urban Crest" },
];

const OwnerVoting = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateVote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDialogOpen(false);
      toast.success("Voting session initiated successfully", {
        description: "Investors will be notified to cast their votes.",
      });
    }, 1500);
  };

  const hasVotes = ownerVotes.length > 0;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Vote className="w-6 h-6 text-primary" />
            Voting & Decisions
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Monitor voting activity and outcomes for your listed lands. All votes are recorded
            transparently and governed by FractoLand rules.
          </p>
        </div>

        {/* Create Voting Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full px-5 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Start New Voting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Initiate New Voting Session</DialogTitle>
              <DialogDescription>
                Create a proposal for investors to vote on. This will lock the land status during the voting period.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateVote} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="land">Select Land Property</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a land..." />
                  </SelectTrigger>
                  <SelectContent>
                    {myLands.map((land) => (
                      <SelectItem key={land.id} value={land.id}>
                        {land.name} ({land.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Voting Type</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select voting type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resale">Resale / Liquidation Proposal</SelectItem>
                    <SelectItem value="lockin">Lock-in Period Extension</SelectItem>
                    <SelectItem value="development">Development Decision</SelectItem>
                    <SelectItem value="other">Other Policy Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" required className="block" />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="5">5 Days</SelectItem>
                      <SelectItem value="7">7 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Proposal Description</Label>
                <Textarea
                  id="description"
                  placeholder="Explain why this vote is necessary..."
                  className="resize-none h-24"
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Initiating..." : "Start Voting"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Vote className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Total Sessions</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{summary.totalSessions}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Active Now</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{summary.active}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Approved</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{summary.approved}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-600">
              <AlertCircle className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Rejected</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{summary.rejected}</p>
        </motion.div>
      </div>

      {/* Voting list */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-lg font-semibold text-foreground">Recent Voting Sessions</h2>
        </div>

        {hasVotes ? (
          <div className="divide-y divide-border/60">
            {ownerVotes.map((vote) => {
              const participation =
                vote.eligibleVoters > 0
                  ? Math.round((vote.votesCast / vote.eligibleVoters) * 100)
                  : 0;

              return (
                <motion.div
                  key={vote.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between lg:justify-start lg:gap-3">
                        <h3 className="font-medium text-foreground">{vote.land}</h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${vote.status === "Active"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-secondary text-muted-foreground border-border"
                          }`}>
                          {vote.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground mt-2">
                        <div>
                          <span className="block text-[10px] uppercase opacity-70">Type</span>
                          <span className="font-medium text-foreground">{vote.type}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase opacity-70">Rule</span>
                          <span className="font-medium text-foreground">{vote.rule}</span>
                        </div>
                        <div className="col-span-2 md:col-span-2">
                          <span className="block text-[10px] uppercase opacity-70">Period</span>
                          <span className="font-medium text-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {vote.period}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Progress/Outcome */}
                    <div className="flex-1 lg:max-w-md bg-secondary/30 rounded-xl p-4 border border-border/50">
                      {vote.status === "Active" ? (
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Participation</span>
                            <span className="font-medium text-foreground">{participation}% ({vote.votesCast}/{vote.eligibleVoters})</span>
                          </div>

                          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                              style={{ width: `${participation}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-blue-600 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {vote.timeLeft}
                            </span>
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">View Details</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between h-full">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase mb-1">Final Outcome</p>
                            <p className={`text-lg font-bold flex items-center gap-2 ${vote.outcome === "Approved" ? "text-green-600" : "text-red-600"
                              }`}>
                              {vote.outcome === "Approved" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                              {vote.outcome}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="text-xs h-8">View Report</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground">
              <Vote className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-medium text-foreground">No voting sessions yet</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                You haven't initiated any votes. Start a new voting session to make decisions about your lands.
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Note: Certain major decisions may require final approval from the FractoLand governance board even after investor voting.
      </p>
    </div>
  );
};

export default OwnerVoting;