import { Button } from "@/components/ui/button";
import { formatLockIn, getVentureById, type VentureDetail } from "@/lib/venturesApi";
import { FileText, MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
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

const OwnerLandDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [search] = useSearchParams();
  const activeTab = search.get("tab") === "docs" ? "docs" : "overview";

  const [venture, setVenture] = useState<VentureDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const v = await getVentureById(id);
      setVenture(v);
      if (!v) toast.error("Land not found or you don’t have access.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load land");
      setVenture(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Loading land…</p>
      </div>
    );
  }

  if (!venture) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Land not found.</p>
      </div>
    );
  }

  const location = [venture.district, venture.state].filter(Boolean).join(", ") || venture.full_address || "—";
  const area = venture.area_acres != null ? `${venture.area_acres} Acres` : "—";
  const totalTok = venture.tokens?.total_tokens ?? 0;
  const avail = venture.tokens?.available_tokens ?? 0;
  const sold = totalTok - avail;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground uppercase tracking-[0.18em]">Land Details</p>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          {venture.name}
          <span className="text-xs font-normal text-muted-foreground">({venture.ref})</span>
        </h1>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {location} • {area}
        </p>
        <p className="text-xs text-muted-foreground">Status: {statusLabel(venture.status)}</p>
      </div>

      <div className="flex gap-2 text-xs border-b border-border">
        <Link
          to={`/dashboard/owner/land/${id}`}
          className={`px-3 pb-2 ${activeTab === "overview" ? "text-foreground border-b-2 border-foreground font-medium" : "text-muted-foreground"}`}
        >
          Overview
        </Link>
        <Link
          to={`/dashboard/owner/land/${id}?tab=docs`}
          className={`px-3 pb-2 ${activeTab === "docs" ? "text-foreground border-b-2 border-foreground font-medium" : "text-muted-foreground"}`}
        >
          Documents
        </Link>
      </div>

      {activeTab === "overview" ? (
        <div className="space-y-4">
          <section className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-card text-sm">
            <h2 className="text-sm font-semibold text-foreground">Tokenization & investment</h2>
            <div className="grid md:grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div>
                <p>Total tokens</p>
                <p className="font-semibold text-foreground">{totalTok.toLocaleString()}</p>
              </div>
              <div>
                <p>Tokens sold</p>
                <p className="font-semibold text-foreground">{sold.toLocaleString()}</p>
              </div>
              <div>
                <p>Available</p>
                <p className="font-semibold text-foreground">{avail.toLocaleString()}</p>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-card text-sm">
            <h2 className="text-sm font-semibold text-foreground">Lock-in & ROI</h2>
            <div className="grid md:grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div>
                <p>Lock-in period</p>
                <p className="font-semibold text-foreground">{formatLockIn(venture.lock_in_months)}</p>
              </div>
              <div>
                <p>Expected ROI</p>
                <p className="font-semibold text-foreground">
                  {venture.expected_roi_percent != null ? `${venture.expected_roi_percent}%` : "—"}
                </p>
              </div>
              <div>
                <p>Token price</p>
                <p className="font-semibold text-foreground">
                  {venture.tokens?.token_price != null
                    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(venture.tokens.token_price)
                    : "—"}
                </p>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <section className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-card text-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground">Documents</h2>
            <Button variant="outline" size="sm" className="h-8 text-xs rounded-full" type="button">
              <FileText className="w-3 h-3 mr-1" />
              Upload / Manage Docs
            </Button>
          </div>
          {(venture.documents || []).length === 0 ? (
            <p className="text-xs text-muted-foreground">No documents uploaded yet.</p>
          ) : (
            <ul className="space-y-2 text-xs">
              {(venture.documents || []).map((d) => (
                <li key={d.id} className="flex justify-between gap-2 border-b border-border/60 pb-2">
                  <span className="text-foreground">{d.name || "Document"}</span>
                  <span className="text-muted-foreground">{d.verified ? "Verified" : "Pending"}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
};

export default OwnerLandDetail;
