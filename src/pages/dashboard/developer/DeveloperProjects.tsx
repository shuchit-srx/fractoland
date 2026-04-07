import { formatInr } from "@/lib/dashboardApi";
import { getMyDeveloperProjects, type DeveloperProjectItem } from "@/lib/developerBidsApi";
import { Loader2, MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const DeveloperProjects = () => {
  const [items, setItems] = useState<DeveloperProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMyDeveloperProjects({ limit: 50 });
      setItems(res.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My projects</h1>
        <p className="text-muted-foreground mt-1">Lands where your bid was approved by administration</p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-10 text-center border border-border rounded-2xl bg-card">
          No approved projects yet. Winning bids appear here after admin approval.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{p.venture_name || "Land parcel"}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-4 h-4 shrink-0" />
                {p.location || p.full_address || "—"}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Approved bid: </span>
                <span className="font-medium">{formatInr(p.bid_amount)}</span>
              </p>
              {p.total_value != null ? (
                <p className="text-sm text-muted-foreground">Parcel value (reference): {formatInr(p.total_value)}</p>
              ) : null}
              {p.area_acres != null ? <p className="text-sm text-muted-foreground">{p.area_acres} acres</p> : null}
              <p className="text-xs text-muted-foreground pt-2">Venture status: {p.venture_status || "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeveloperProjects;
