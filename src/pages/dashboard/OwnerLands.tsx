import { Button } from "@/components/ui/button";
import { getVentures, type VentureListItem } from "@/lib/venturesApi";
import { motion } from "framer-motion";
import { Filter, MapPin } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function statusLabel(status: string) {
  const m: Record<string, string> = {
    draft: "Draft",
    under_verification: "Under Verification",
    live: "Live for Investment",
    voting: "Voting in Progress",
    sold: "Sold / Closed",
    closed: "Closed",
  };
  return m[status] || status;
}

function getStatusClasses(status: string) {
  if (status === "live") return "bg-green-100 text-green-700 border border-green-200";
  if (status === "sold" || status === "closed") return "bg-zinc-900 text-zinc-50 border border-zinc-900";
  return "bg-secondary/80 text-foreground border border-border/80";
}

const OwnerLands = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<VentureListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getVentures({ owner_id: "me", limit: 100 });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load your lands");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const summary = useMemo(() => {
    const active = items.filter((v) => v.status === "live").length;
    const voting = items.filter((v) => v.status === "voting").length;
    const sold = items.filter((v) => v.status === "sold" || v.status === "closed").length;
    return { total: items.length, active, voting, sold };
  }, [items]);

  const hasLands = items.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Lands</h1>
          <p className="text-sm text-muted-foreground">
            Track the status, investment progress, and lifecycle of your listed land parcels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 rounded-full text-xs" type="button">
            <Filter className="w-3 h-3" />
            Filters
          </Button>
          <Button className="rounded-full h-9 px-5 text-sm" onClick={() => navigate("/dashboard/owner/lands/new")}>
            + Add New Land
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-card border border-border rounded-2xl p-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">Total Lands</span>
          <span className="font-semibold text-foreground">{loading ? "—" : summary.total}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">Active (live)</span>
          <span className="font-semibold text-foreground">{loading ? "—" : summary.active}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">In voting</span>
          <span className="font-semibold text-foreground">{loading ? "—" : summary.voting}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">Sold / closed</span>
          <span className="font-semibold text-foreground">{loading ? "—" : summary.sold}</span>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading your lands…</p>
      ) : hasLands ? (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="hidden lg:grid grid-cols-9 gap-3 text-[11px] text-muted-foreground border-b border-border/80 pb-2 mb-2">
            <span className="col-span-2">Land</span>
            <span className="col-span-2">Location</span>
            <span className="col-span-1">Status</span>
            <span className="col-span-1 text-right">Tokens</span>
            <span className="col-span-1 text-right">Sold</span>
            <span className="col-span-2 text-right">Progress</span>
          </div>

          <div className="space-y-3 text-sm">
            {items.map((land) => {
              const tokens = land.total_tokens ?? 0;
              const sold = tokens - (land.available_tokens ?? 0);
              const pct = tokens > 0 ? Math.round((sold / tokens) * 100) : 0;
              const location = [land.district, land.state].filter(Boolean).join(", ") || land.full_address || "—";
              const area = land.area_acres != null ? `${land.area_acres} Acres` : "—";

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
                        <span className="truncate">{location}</span>
                        <span>•</span>
                        <span>{area}</span>
                      </p>
                    </div>
                    <span
                      className={
                        "inline-flex items-center px-2 py-1 rounded-full text-[11px] " + getStatusClasses(land.status)
                      }
                    >
                      {statusLabel(land.status)}
                    </span>
                  </div>

                  <div className="grid lg:grid-cols-4 gap-3 items-center">
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Total tokens</span>
                        <span className="font-medium text-foreground">{tokens.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tokens sold</span>
                        <span className="font-medium text-foreground">{sold.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-1 lg:col-span-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Investment progress</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-foreground rounded-full" style={{ width: `${pct}%` }} />
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
            You haven’t added any land yet. Start by submitting your first land parcel for tokenization.
          </p>
          <Button className="rounded-full mt-2" onClick={() => navigate("/dashboard/owner/lands/new")}>
            + Add New Land
          </Button>
        </div>
      )}

      {!loading && total > items.length ? (
        <p className="text-xs text-muted-foreground">Showing {items.length} of {total} lands.</p>
      ) : null}
    </div>
  );
};

export default OwnerLands;
