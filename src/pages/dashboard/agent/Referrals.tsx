import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listReferredUsers, type ReferredUserRow } from "@/lib/referralsApi";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const Referrals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<ReferredUserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listReferredUsers({ limit: 200 });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load referrals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredReferrals = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return items.filter((r) => {
      const idMatch = r.user_id.toLowerCase().includes(q);
      const nameMatch = (r.name || "").toLowerCase().includes(q);
      return !q || idMatch || nameMatch;
    });
  }, [items, searchTerm]);

  const stats = useMemo(
    () => ({
      total,
      active: total,
      pending: 0,
      inactive: 0,
    }),
    [total]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Referrals</h1>
        <p className="text-muted-foreground mt-1">Users who signed up with your referral links</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total referrals</p>
          <p className="text-2xl font-bold text-foreground">{loading ? "—" : stats.total}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">With link attribution</p>
          <p className="text-2xl font-bold text-green-600">{loading ? "—" : stats.active}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-amber-600">—</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Conversion</p>
          <p className="text-2xl font-bold text-foreground">—</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or user id…"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <p className="col-span-full text-sm text-muted-foreground py-8 text-center">Loading…</p>
        ) : (
          filteredReferrals.map((referral, index) => (
            <motion.div
              key={referral.user_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{referral.user_id.slice(0, 4)}</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide bg-green-50 text-green-600">
                  active
                </span>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">User</p>
                <h3 className="text-lg font-bold text-foreground">{referral.name || "—"}</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono truncate" title={referral.user_id}>
                  {referral.user_id}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Joined {new Date(referral.created_at).toLocaleDateString("en-IN")}
                </p>
                {referral.phone ? <p className="text-xs text-muted-foreground mt-1">{referral.phone}</p> : null}
              </div>

              <Button variant="outline" size="sm" className="w-full mt-4" type="button" disabled>
                Per-investor stats (coming soon)
              </Button>
            </motion.div>
          ))
        )}
        {!loading && filteredReferrals.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">No referrals found.</div>
        ) : null}
      </div>
    </div>
  );
};

export default Referrals;
