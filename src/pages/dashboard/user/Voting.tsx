import { Button } from "@/components/ui/button";
import { castPollVote, daysUntilEnd, formatDate, getPolls, type PollItem } from "@/lib/dashboardApi";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Loader2, ThumbsDown, ThumbsUp, Vote } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function yesPercent(yes: number, no: number): number {
  const t = yes + no;
  if (t <= 0) return 0;
  return Math.round((yes / t) * 100);
}

const Voting = () => {
  const [activePolls, setActivePolls] = useState<PollItem[]>([]);
  const [pastPolls, setPastPolls] = useState<PollItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);

  const loadPolls = useCallback(async () => {
    const [activeRes, closedRes] = await Promise.all([
      getPolls({ status: "active", limit: 50 }),
      getPolls({ status: "closed", limit: 50 }),
    ]);
    setActivePolls(activeRes.items);
    setPastPolls(closedRes.items);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadPolls()
      .then(() => {
        if (cancelled) return;
      })
      .catch((err) => {
        if (!cancelled) toast.error(err instanceof Error ? err.message : "Failed to load polls");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadPolls]);

  const handleVote = async (pollId: string, vote: "yes" | "no") => {
    setVotingId(pollId);
    try {
      await castPollVote(pollId, { vote });
      toast.success(`Vote recorded: ${vote === "yes" ? "Yes" : "No"}`);
      await loadPolls();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to cast vote");
    } finally {
      setVotingId(null);
    }
  };

  const needYourVote = activePolls.filter((p) => !p.voted).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Voting</h1>
        <p className="text-muted-foreground mt-1">Participate in decisions for your land investments</p>
        <p className="text-xs text-muted-foreground mt-2">
          Polls appear only for ventures where you hold completed token investments. Tallies use token-weighted voting power.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Vote className="w-5 h-5 text-primary" />
          Active Polls ({activePolls.length})
          {needYourVote > 0 && (
            <span className="text-sm font-normal text-amber-600">· {needYourVote} need your vote</span>
          )}
        </h2>

        <div className="space-y-4">
          {loading ? (
            <div className="py-10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : activePolls.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No active polls for your portfolio. Invest in a live venture to participate when its polls go live.
            </p>
          ) : (
            activePolls.map((poll, index) => {
              const yesW = poll.yes_count;
              const noW = poll.no_count;
              const pct = yesPercent(yesW, noW);
              const busy = votingId === poll.id;
              return (
                <motion.div
                  key={poll.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {poll.venture_name || "Venture"}
                      </span>
                      {poll.rule ? (
                        <span className="ml-2 text-xs text-muted-foreground">Rule: {poll.rule}</span>
                      ) : null}
                      <h3 className="text-lg font-semibold text-foreground mt-2">{poll.question}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{poll.description || "—"}</p>
                    </div>
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg shrink-0">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Ends in {daysUntilEnd(poll.ends_at)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-secondary/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground">Yes (tokens)</p>
                      <p className="font-semibold text-foreground">{yesW}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground">No (tokens)</p>
                      <p className="font-semibold text-foreground">{noW}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground">Your power</p>
                      <p className="font-semibold text-foreground">
                        {poll.voted ? poll.your_token_weight ?? "—" : poll.eligible_token_weight} tokens
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground">Yes share</p>
                      <p className="font-semibold text-green-600">{pct}%</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-green-600 font-medium">Yes ({yesW})</span>
                      <span className="text-red-600 font-medium">No ({noW})</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden flex">
                      <div
                        className="bg-green-500 h-full transition-all"
                        style={{ width: `${yesW + noW > 0 ? (yesW / (yesW + noW)) * 100 : 50}%` }}
                      />
                      <div
                        className="bg-red-500 h-full transition-all"
                        style={{ width: `${yesW + noW > 0 ? (noW / (yesW + noW)) * 100 : 50}%` }}
                      />
                    </div>
                  </div>

                  {poll.voted ? (
                    <div className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-xl text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">
                        You voted{" "}
                        <strong className="uppercase">{poll.your_vote}</strong>
                        {poll.your_token_weight != null ? ` (${poll.your_token_weight} tokens)` : ""}
                      </span>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={busy}
                        onClick={() => void handleVote(poll.id, "yes")}
                      >
                        {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ThumbsUp className="w-4 h-4 mr-2" />}
                        Vote Yes
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        disabled={busy}
                        onClick={() => void handleVote(poll.id, "no")}
                      >
                        {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ThumbsDown className="w-4 h-4 mr-2" />}
                        Vote No
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-muted-foreground" />
          Past Polls
        </h2>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {pastPolls.length === 0 ? (
            <p className="text-sm text-muted-foreground p-6">No closed polls yet for your ventures.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Land</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Question</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Result</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Your Vote</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ended</th>
                  </tr>
                </thead>
                <tbody>
                  {pastPolls.map((poll) => {
                    const yp = yesPercent(poll.yes_count, poll.no_count);
                    const resLabel =
                      poll.result === "approved"
                        ? "Approved"
                        : poll.result === "rejected"
                          ? "Rejected"
                          : "—";
                    const your =
                      poll.voted && poll.your_vote ? (poll.your_vote === "yes" ? "Yes" : "No") : "—";
                    return (
                      <tr key={poll.id} className="border-b border-border last:border-0">
                        <td className="p-4 text-sm font-medium text-foreground">{poll.venture_name || "—"}</td>
                        <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{poll.question}</td>
                        <td className="p-4">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              poll.result === "approved"
                                ? "bg-green-50 text-green-600"
                                : poll.result === "rejected"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {resLabel} ({yp}% Yes)
                          </span>
                        </td>
                        <td className="p-4 text-sm text-foreground">{your}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {poll.ends_at ? formatDate(poll.ends_at) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Voting;
