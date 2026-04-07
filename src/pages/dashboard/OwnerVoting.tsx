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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createOwnerPoll, listOwnerPolls, type OwnerPollItem } from "@/lib/ownersApi";
import { getVentures, type VentureListItem } from "@/lib/venturesApi";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Calendar, CheckCircle2, Clock, Plus, Vote } from "lucide-react";

function formatPeriod(p: OwnerPollItem) {
  const a = p.starts_at ? new Date(p.starts_at).toLocaleDateString("en-IN") : "—";
  const b = p.ends_at ? new Date(p.ends_at).toLocaleDateString("en-IN") : "—";
  return `${a} – ${b}`;
}

const OwnerVoting = () => {
  const [polls, setPolls] = useState<OwnerPollItem[]>([]);
  const [lands, setLands] = useState<VentureListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [ventureId, setVentureId] = useState("");
  const [voteType, setVoteType] = useState("resale");
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [rule, setRule] = useState("51% Majority");
  const [startsAt, setStartsAt] = useState("");
  const [durationDays, setDurationDays] = useState("5");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, vRes] = await Promise.all([
        listOwnerPolls({ status: "all", limit: 50 }),
        getVentures({ owner_id: "me", limit: 100 }),
      ]);
      setPolls(pRes.items);
      setLands(vRes.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load voting data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const summary = useMemo(() => {
    const active = polls.filter((p) => p.status === "active").length;
    const approved = polls.filter((p) => p.status === "closed" && p.result === "approved").length;
    const rejected = polls.filter((p) => p.status === "closed" && p.result === "rejected").length;
    return { total: polls.length, active, approved, rejected };
  }, [polls]);

  const handleCreateVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ventureId) {
      toast.error("Select a land");
      return;
    }
    if (!question.trim()) {
      toast.error("Enter a proposal question");
      return;
    }
    setIsSubmitting(true);
    try {
      await createOwnerPoll({
        venture_id: ventureId,
        type: voteType,
        question: question.trim(),
        description: description.trim() || undefined,
        rule: rule || undefined,
        starts_at: startsAt ? new Date(startsAt).toISOString() : undefined,
        duration_days: Number(durationDays) || 5,
      });
      toast.success("Voting session started. Investors holding tokens can vote.");
      setIsDialogOpen(false);
      setQuestion("");
      setDescription("");
      setVentureId("");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start voting");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasVotes = polls.length > 0;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Vote className="w-6 h-6 text-primary" />
            Voting & Decisions
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Start polls on your live lands. Eligible investors vote with token-weighted power (same rules as the investor voting app).
          </p>
        </div>

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
                Creates an active poll for the selected land. Live lands move to voting status while the session runs.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateVote} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="land">Land</Label>
                <Select value={ventureId || undefined} onValueChange={setVentureId}>
                  <SelectTrigger id="land">
                    <SelectValue placeholder="Select a land…" />
                  </SelectTrigger>
                  <SelectContent>
                    {lands.map((land) => (
                      <SelectItem key={land.id} value={land.id}>
                        {land.name} ({land.ref})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {lands.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Add a live land first.</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={voteType} onValueChange={setVoteType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resale">Resale / Liquidation</SelectItem>
                    <SelectItem value="lockin">Lock-in extension</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="q">Question</Label>
                <Input
                  id="q"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Short proposal title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the proposal"
                  className="resize-none h-24"
                />
              </div>

              <div className="space-y-2">
                <Label>Rule (informational)</Label>
                <Input value={rule} onChange={(e) => setRule(e.target.value)} placeholder="e.g. 51% Majority" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start (optional)</Label>
                  <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Duration (days)</Label>
                  <Select value={durationDays} onValueChange={setDurationDays}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="14">14</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Starting…" : "Start Voting"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Vote className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Total Sessions</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{loading ? "—" : summary.total}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Active</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{loading ? "—" : summary.active}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Approved</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{loading ? "—" : summary.approved}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-600">
              <AlertCircle className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Rejected</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{loading ? "—" : summary.rejected}</p>
        </motion.div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-lg font-semibold text-foreground">Voting sessions</h2>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading…</p>
        ) : hasVotes ? (
          <div className="divide-y divide-border/60">
            {polls.map((vote) => {
              const votesCast = (vote.yes_count ?? 0) + (vote.no_count ?? 0);
              const eligible = vote.total_eligible_tokens ?? 0;
              const participation = eligible > 0 ? Math.round((votesCast / eligible) * 100) : 0;
              const isActive = vote.status === "active";

              return (
                <motion.div
                  key={vote.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between lg:justify-start lg:gap-3">
                        <h3 className="font-medium text-foreground">
                          {vote.venture_name || "Land"} — {vote.question}
                        </h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                            isActive
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-secondary text-muted-foreground border-border"
                          }`}
                        >
                          {vote.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground mt-2">
                        <div>
                          <span className="block text-[10px] uppercase opacity-70">Type</span>
                          <span className="font-medium text-foreground">{vote.type || "—"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase opacity-70">Rule</span>
                          <span className="font-medium text-foreground">{vote.rule || "—"}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[10px] uppercase opacity-70">Period</span>
                          <span className="font-medium text-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatPeriod(vote)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 lg:max-w-md bg-secondary/30 rounded-xl p-4 border border-border/50">
                      {isActive ? (
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Weighted votes (yes+no)</span>
                            <span className="font-medium text-foreground">
                              {participation}% ({votesCast}/{eligible || "—"})
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(participation, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between h-full">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase mb-1">Result</p>
                            <p
                              className={`text-lg font-bold flex items-center gap-2 ${
                                vote.result === "approved" ? "text-green-600" : vote.result === "rejected" ? "text-red-600" : "text-muted-foreground"
                              }`}
                            >
                              {vote.result === "approved" ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : vote.result === "rejected" ? (
                                <AlertCircle className="w-5 h-5" />
                              ) : null}
                              {vote.result || "Pending"}
                            </p>
                          </div>
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
            <p className="text-base font-medium text-foreground">No voting sessions yet</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Start a session when a land is live or in voting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerVoting;
