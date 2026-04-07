import AdminResaleQueue from "@/pages/dashboard/AdminResaleQueue";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAdminAnalytics,
  getAdminAuditLogs,
  getAdminDeveloperBids,
  getAdminPayments,
  getAdminPolls,
  getAdminVentures,
  patchAdminDeveloperBid,
  patchAdminVenture,
  type AdminAnalytics,
  type AdminAuditRow,
  type AdminBidRow,
  type AdminPaymentRow,
  type AdminPollRow,
  type AdminVentureRow,
} from "@/lib/adminApi";
import { formatInr } from "@/lib/dashboardApi";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TAB_VALUES = ["overview", "ventures", "resale", "polls", "bids", "payments", "audit"] as const;
type AdminTab = (typeof TAB_VALUES)[number];

const BID_STATUSES = ["pending", "approved", "rejected", "outbid"] as const;

const AdminConsole = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabRaw = searchParams.get("tab") || "overview";
  const tab: AdminTab = TAB_VALUES.includes(tabRaw as AdminTab) ? (tabRaw as AdminTab) : "overview";

  const setTab = (v: string) => {
    if (v === "overview") {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ tab: v }, { replace: true });
    }
  };

  const storedRole = (() => {
    try {
      const raw = localStorage.getItem("fractoland_user");
      if (!raw) return null;
      return (JSON.parse(raw) as { role?: string }).role ?? null;
    } catch {
      return null;
    }
  })();
  const effectiveRole = user?.role ?? storedRole;

  useEffect(() => {
    if (effectiveRole && effectiveRole !== "admin") {
      toast.error("Admin access only");
      navigate("/dashboard/user");
    }
  }, [effectiveRole, navigate]);

  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const a = await getAdminAnalytics();
      setAnalytics(a);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin control plane</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ventures, resale queue, polls, developer bids, payment reconciliation, analytics, and audit trail. All{" "}
          <code className="text-xs bg-secondary px-1 rounded">/admin/*</code> API routes require the admin role.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-secondary/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ventures">Ventures</TabsTrigger>
          <TabsTrigger value="resale">Resale queue</TabsTrigger>
          <TabsTrigger value="polls">Polls</TabsTrigger>
          <TabsTrigger value="bids">Developer bids</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-4">
          {analyticsLoading ? (
            <div className="py-16 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : analytics ? (
            <OverviewCards analytics={analytics} onRefresh={() => void loadAnalytics()} />
          ) : null}
        </TabsContent>

        <TabsContent value="ventures" className="mt-6">
          <VenturesPanel onVentureUpdated={() => void loadAnalytics()} />
        </TabsContent>

        <TabsContent value="resale" className="mt-6">
          <AdminResaleQueue />
        </TabsContent>

        <TabsContent value="polls" className="mt-6">
          <PollsPanel />
        </TabsContent>

        <TabsContent value="bids" className="mt-6">
          <BidsPanel />
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <PaymentsPanel />
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <AuditPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

function OverviewCards({ analytics, onRefresh }: { analytics: AdminAnalytics; onRefresh: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onRefresh}>
          Refresh metrics
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Users" value={String(analytics.users_total)} sub={Object.entries(analytics.users_by_role).map(([k, v]) => `${k}: ${v}`).join(" · ") || "—"} />
        <MetricCard title="Ventures" value={String(analytics.ventures_total)} sub={Object.entries(analytics.ventures_by_status).map(([k, v]) => `${k}: ${v}`).join(" · ") || "—"} />
        <MetricCard title="Payments (completed volume)" value={formatInr(analytics.payment_volume_completed_inr)} sub={`${analytics.payments_total} rows`} />
        <MetricCard title="Investments" value={String(analytics.investments_total)} sub={Object.entries(analytics.investments_by_status).map(([k, v]) => `${k}: ${v}`).join(" · ") || "—"} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard title="Resale requests" value={String(analytics.resale_requests_total)} sub={Object.entries(analytics.resale_by_status).map(([k, v]) => `${k}: ${v}`).join(" · ") || "—"} />
        <MetricCard title="Developer bids" value={String(analytics.developer_bids_total)} sub={Object.entries(analytics.developer_bids_by_status).map(([k, v]) => `${k}: ${v}`).join(" · ") || "—"} />
        <MetricCard title="Polls" value={String(analytics.polls_total)} sub={Object.entries(analytics.polls_by_status).map(([k, v]) => `${k}: ${v}`).join(" · ") || "—"} />
      </div>
    </div>
  );
}

function MetricCard({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{sub}</p>
    </div>
  );
}

const VENTURE_STATUSES = ["draft", "under_verification", "live", "voting", "sold", "closed"] as const;

function VenturesPanel({ onVentureUpdated }: { onVentureUpdated: () => void }) {
  const [items, setItems] = useState<AdminVentureRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminVentures({
        limit: 80,
        status: filter === "all" ? undefined : filter,
      });
      setItems(res.items as AdminVentureRow[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load ventures");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: string, status: string) => {
    setActing(id);
    try {
      await patchAdminVenture(id, { status });
      toast.success("Venture updated");
      await load();
      onVentureUpdated();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {VENTURE_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No ventures.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-left text-xs text-muted-foreground">
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Ref</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Location</th>
                  <th className="p-3 font-medium">Value</th>
                  <th className="p-3 font-medium">Set status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((v) => (
                  <tr key={v.id} className="border-b border-border/70">
                    <td className="p-3 font-medium text-foreground">{v.name}</td>
                    <td className="p-3 text-xs font-mono">{v.ref}</td>
                    <td className="p-3 capitalize">{v.status}</td>
                    <td className="p-3 text-muted-foreground">{[v.district, v.state].filter(Boolean).join(", ") || "—"}</td>
                    <td className="p-3">{v.total_value != null ? formatInr(v.total_value) : "—"}</td>
                    <td className="p-3">
                      <Select
                        disabled={acting === v.id}
                        value={v.status}
                        onValueChange={(s) => setStatus(v.id, s)}
                      >
                        <SelectTrigger className="w-[160px] h-8 text-xs">
                          <SelectValue placeholder="Set status" />
                        </SelectTrigger>
                        <SelectContent>
                          {(VENTURE_STATUSES as readonly string[]).includes(v.status)
                            ? null
                            : (
                                <SelectItem value={v.status}>{v.status}</SelectItem>
                              )}
                          {VENTURE_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
}

function PollsPanel() {
  const [items, setItems] = useState<AdminPollRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminPolls({
        limit: 80,
        status: filter === "all" ? undefined : filter,
      });
      setItems(res.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load polls");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">Status:</span>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">active</SelectItem>
            <SelectItem value="closed">closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No polls.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-left text-xs text-muted-foreground">
                  <th className="p-3 font-medium">Question</th>
                  <th className="p-3 font-medium">Venture</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Yes / No</th>
                  <th className="p-3 font-medium">Ends</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b border-border/70">
                    <td className="p-3 max-w-xs truncate" title={p.question}>
                      {p.question}
                    </td>
                    <td className="p-3 text-muted-foreground">{p.venture_name || p.venture_id.slice(0, 8)}</td>
                    <td className="p-3 capitalize">{p.status}</td>
                    <td className="p-3">
                      {p.yes_count} / {p.no_count}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{p.ends_at ? new Date(p.ends_at).toLocaleString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function BidsPanel() {
  const [items, setItems] = useState<AdminBidRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminDeveloperBids({ limit: 100 });
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

  const setBidStatus = async (id: string, status: string) => {
    setActing(id);
    try {
      await patchAdminDeveloperBid(id, { status });
      toast.success(`Bid ${status}`);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-card">
      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No developer bids yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-left text-xs text-muted-foreground">
                <th className="p-3 font-medium">Developer</th>
                <th className="p-3 font-medium">Land</th>
                <th className="p-3 font-medium">Bid</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-b border-border/70">
                  <td className="p-3">
                    <p className="font-medium">{b.developer_name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{b.developer_phone || b.developer_id.slice(0, 8)}</p>
                  </td>
                  <td className="p-3">
                    <p>{b.venture_name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{b.location || ""}</p>
                  </td>
                  <td className="p-3">{formatInr(b.bid_amount)}</td>
                  <td className="p-3 capitalize">{b.status || "—"}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {BID_STATUSES.map((s) => (
                        <Button
                          key={s}
                          type="button"
                          size="sm"
                          variant={b.status === s ? "default" : "outline"}
                          className="h-7 text-xs capitalize"
                          disabled={acting === b.id}
                          onClick={() => setBidStatus(b.id, s)}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PaymentsPanel() {
  const [items, setItems] = useState<AdminPaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminPayments({
        limit: 100,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setItems(res.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">Status:</span>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">pending</SelectItem>
            <SelectItem value="completed">completed</SelectItem>
            <SelectItem value="failed">failed</SelectItem>
            <SelectItem value="refunded">refunded</SelectItem>
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" size="sm" onClick={() => void load()}>
          Refresh
        </Button>
      </div>
      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No payments.</p>
        ) : (
          <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-secondary/90 backdrop-blur">
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="p-3 font-medium">When</th>
                  <th className="p-3 font-medium">User</th>
                  <th className="p-3 font-medium">Type</th>
                  <th className="p-3 font-medium">Amount</th>
                  <th className="p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b border-border/70">
                    <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(p.created_at).toLocaleString()}</td>
                    <td className="p-3">
                      <p className="text-xs font-mono truncate max-w-[120px]" title={p.user_id || ""}>
                        {p.user_name || p.user_id?.slice(0, 8) || "—"}
                      </p>
                    </td>
                    <td className="p-3 capitalize">{p.type}</td>
                    <td className="p-3">{formatInr(p.amount)}</td>
                    <td className="p-3 capitalize">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AuditPanel() {
  const [items, setItems] = useState<AdminAuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminAuditLogs({ limit: 100 });
      setItems(res.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load audit log");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      <Button type="button" variant="outline" size="sm" onClick={() => void load()}>
        Refresh
      </Button>
      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No audit entries yet.</p>
        ) : (
          <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-secondary/90 backdrop-blur">
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="p-3 font-medium">Time</th>
                  <th className="p-3 font-medium">Action</th>
                  <th className="p-3 font-medium">Actor</th>
                  <th className="p-3 font-medium">Resource</th>
                  <th className="p-3 font-medium">IP</th>
                  <th className="p-3 font-medium">Payload</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="border-b border-border/70 align-top">
                    <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(row.created_at).toLocaleString()}</td>
                    <td className="p-3 font-mono text-xs">{row.action}</td>
                    <td className="p-3 text-xs font-mono truncate max-w-[100px]" title={row.user_id || ""}>
                      {row.user_id ? row.user_id.slice(0, 8) + "…" : "—"}
                    </td>
                    <td className="p-3 text-xs">
                      {row.resource_type || "—"}
                      {row.resource_id ? (
                        <span className="block font-mono truncate max-w-[120px]" title={row.resource_id}>
                          {row.resource_id.slice(0, 8)}…
                        </span>
                      ) : null}
                    </td>
                    <td className="p-3 text-xs font-mono">{row.ip || "—"}</td>
                    <td className="p-3 text-xs font-mono max-w-[240px] truncate" title={JSON.stringify(row.payload)}>
                      {JSON.stringify(row.payload)}
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
}

export default AdminConsole;
