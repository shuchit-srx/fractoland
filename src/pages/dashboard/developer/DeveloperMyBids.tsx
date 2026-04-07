import { Button } from "@/components/ui/button";
import { formatInr } from "@/lib/dashboardApi";
import { getMyDeveloperBids, type DeveloperBidItem } from "@/lib/developerBidsApi";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const DeveloperMyBids = () => {
  const [items, setItems] = useState<DeveloperBidItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMyDeveloperBids({ limit: 100 });
      setItems(res.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load bids");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My bids</h1>
          <p className="text-muted-foreground mt-1">Track pending, approved, and rejected offers</p>
        </div>
        <Button variant="outline" size="sm" type="button" onClick={() => void load()}>
          Refresh
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No bids yet. Browse lands to place your first offer.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-left text-xs text-muted-foreground">
                  <th className="p-3 font-medium">Land</th>
                  <th className="p-3 font-medium">Bid</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {items.map((b) => (
                  <tr key={b.id} className="border-b border-border/70">
                    <td className="p-3">
                      <p className="font-medium text-foreground">{b.venture_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{b.location || b.venture_id.slice(0, 8)}</p>
                    </td>
                    <td className="p-3">{formatInr(b.bid_amount)}</td>
                    <td className="p-3 capitalize">{b.status || "—"}</td>
                    <td className="p-3 text-xs text-muted-foreground">{new Date(b.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperMyBids;
