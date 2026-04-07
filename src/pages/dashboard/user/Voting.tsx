import { Button } from "@/components/ui/button";
import { daysUntilEnd, getActivePolls, type PollItem } from "@/lib/dashboardApi";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Loader2, ThumbsDown, ThumbsUp, Vote } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const pastPolls = [
  {
    id: 3,
    land: "Metro Park C3",
    question: "Accept offer from ABC Builders at ₹42,00,000?",
    result: "Approved",
    yesPercentage: 78,
    yourVote: "Yes",
    completedOn: "Dec 5, 2024",
  },
  {
    id: 4,
    land: "Lake View D9",
    question: "Extend lock-in by 3 months?",
    result: "Rejected",
    yesPercentage: 34,
    yourVote: "No",
    completedOn: "Nov 28, 2024",
  },
];

const Voting = () => {
  const [polls, setPolls] = useState<PollItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getActivePolls({ limit: 50 })
      .then((res) => {
        if (!cancelled) setPolls(res.items);
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to load polls");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleVote = (_pollId: string, vote: "yes" | "no") => {
    toast.info(`Vote API not implemented yet. Selected: ${vote.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Voting</h1>
        <p className="text-muted-foreground mt-1">Participate in decisions for your land investments</p>
      </div>

      {/* Active Polls */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Vote className="w-5 h-5 text-primary" />
          Active Polls ({polls.length})
        </h2>

        <div className="space-y-4">
          {loading ? (
            <div className="py-10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : polls.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No active polls.</p>
          ) : polls.map((poll, index) => (
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
                  <h3 className="text-lg font-semibold text-foreground mt-2">{poll.question}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{poll.description || "—"}</p>
                </div>
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg shrink-0">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Ends in {daysUntilEnd(poll.ends_at)}</span>
                </div>
              </div>

              {/* Voting Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-secondary/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total Votes</p>
                  <p className="font-semibold text-foreground">{poll.yes_count + poll.no_count}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">Yes</p>
                  <p className="font-semibold text-foreground">{poll.yes_count}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">No</p>
                  <p className="font-semibold text-foreground">{poll.no_count}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">Current Result</p>
                  <p className="font-semibold text-green-600">
                    {Math.round((poll.yes_count / (poll.yes_count + poll.no_count || 1)) * 100)}% Yes
                  </p>
                </div>
              </div>

              {/* Vote Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-green-600 font-medium">Yes ({poll.yes_count})</span>
                  <span className="text-red-600 font-medium">No ({poll.no_count})</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden flex">
                  <div
                    className="bg-green-500 h-full"
                    style={{ width: `${(poll.yes_count / (poll.yes_count + poll.no_count || 1)) * 100}%` }}
                  />
                  <div
                    className="bg-red-500 h-full"
                    style={{ width: `${(poll.no_count / (poll.yes_count + poll.no_count || 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Vote Buttons */}
              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleVote(poll.id, "yes")}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Vote Yes
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => handleVote(poll.id, "no")}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Vote No
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Past Polls */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-muted-foreground" />
          Past Polls
        </h2>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Land</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Question</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Result</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Your Vote</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Completed</th>
                </tr>
              </thead>
              <tbody>
                {pastPolls.map((poll) => (
                  <tr key={poll.id} className="border-b border-border last:border-0">
                    <td className="p-4 text-sm font-medium text-foreground">{poll.land}</td>
                    <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{poll.question}</td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${poll.result === "Approved"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                        }`}>
                        {poll.result} ({poll.yesPercentage}%)
                      </span>
                    </td>
                    <td className="p-4 text-sm text-foreground">{poll.yourVote}</td>
                    <td className="p-4 text-sm text-muted-foreground">{poll.completedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voting;
