import { Button } from "@/components/ui/button";
import { formatInr } from "@/lib/dashboardApi";
import { adminUpdateResaleRequest, getAdminResaleQueue, type AdminResaleRow, type ResaleStatus } from "@/lib/resaleApi";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const STATUS_FILTERS: (ResaleStatus | "all")[] = ["all", "pending", "listed", "matched", "completed", "cancelled"];

const AdminResaleQueue = () => {
  const [filter, setFilter] = useState<ResaleStatus | "all">("pending");
  const [items, setItems] = useState<AdminResaleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminResaleQueue({
        status: filter === "all" ? undefined : filter,
        limit: 100,
      });
      setItems(res.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load queue");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (id: string, status: ResaleStatus) => {
    setActingId(id);
    try {
      await adminUpdateResaleRequest(id, { status });
      toast.success(`Updated to ${status}`);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Resale queue</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Move requests through listing, matching, and completion. Cancellations are allowed from any non-terminal state per policy.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filter === s ? "default" : "outline"}
            type="button"
            onClick={() => setFilter(s)}
            className="capitalize"
          >
            {s}
          </Button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No requests in this view.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-left text-xs text-muted-foreground">
                  <th className="p-3 font-medium">Investor</th>
                  <th className="p-3 font-medium">Land</th>
                  <th className="p-3 font-medium">Tokens</th>
                  <th className="p-3 font-medium">Ask</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Queue</th>
                  <th className="p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="border-b border-border/70 hover:bg-secondary/20">
                    <td className="p-3">
                      <p className="font-medium text-foreground">{row.user_name || "—"}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate max-w-[140px]" title={row.user_id}>
                        {row.user_phone || row.user_id.slice(0, 8)}…
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="text-foreground">{row.venture_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{row.location || row.venture_id.slice(0, 8)}</p>
                    </td>
                    <td className="p-3">{row.token_count}</td>
                    <td className="p-3">{row.requested_amount != null ? formatInr(row.requested_amount) : "—"}</td>
                    <td className="p-3">
                      <span className="text-xs font-medium capitalize px-2 py-0.5 rounded-full bg-secondary">{row.status}</span>
                    </td>
                    <td className="p-3">{row.queue_position ?? "—"}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {row.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              disabled={actingId === row.id}
                              type="button"
                              onClick={() => act(row.id, "listed")}
                            >
                              List
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs text-destructive"
                              disabled={actingId === row.id}
                              type="button"
                              onClick={() => act(row.id, "cancelled")}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : null}
                        {row.status === "listed" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              disabled={actingId === row.id}
                              type="button"
                              onClick={() => act(row.id, "matched")}
                            >
                              Match
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs text-destructive"
                              disabled={actingId === row.id}
                              type="button"
                              onClick={() => act(row.id, "cancelled")}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : null}
                        {row.status === "matched" ? (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="h-7 text-xs"
                              disabled={actingId === row.id}
                              type="button"
                              onClick={() => act(row.id, "completed")}
                            >
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs text-destructive"
                              disabled={actingId === row.id}
                              type="button"
                              onClick={() => act(row.id, "cancelled")}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : null}
                        {["completed", "cancelled"].includes(row.status) ? (
                          <span className="text-xs text-muted-foreground">Terminal</span>
                        ) : null}
                      </div>
                    </td>
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

export default AdminResaleQueue;
