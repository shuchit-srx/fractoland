import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { placeDeveloperBid } from "@/lib/developerBidsApi";
import { formatInr } from "@/lib/dashboardApi";
import { getVentures, ventureToExploreCard, type VentureListItem } from "@/lib/venturesApi";
import { motion } from "framer-motion";
import { Loader2, MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const MIN_BID = 100000;

const DeveloperBrowseLands = () => {
  const [lands, setLands] = useState<VentureListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidLand, setBidLand] = useState<VentureListItem | null>(null);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getVentures({ mature_for_bid: "true", limit: 60 });
      setLands(res.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load lands");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openBid = (v: VentureListItem) => {
    setBidLand(v);
    setAmount(v.total_value != null ? String(Math.max(MIN_BID, Math.round(Number(v.total_value) * 0.05))) : String(MIN_BID));
    setNotes("");
  };

  const submitBid = async () => {
    if (!bidLand) return;
    const n = Number(amount);
    if (!Number.isFinite(n) || n < MIN_BID) {
      toast.error(`Minimum bid is ${formatInr(MIN_BID)}`);
      return;
    }
    setSubmitting(true);
    try {
      await placeDeveloperBid({
        venture_id: bidLand.id,
        bid_amount: n,
        notes: notes.trim() || undefined,
      });
      toast.success("Bid submitted");
      setBidLand(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bid failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Browse lands</h1>
        <p className="text-muted-foreground mt-1">
          Parcels open for developer bidding (live, voting, or sold). Minimum offer {formatInr(MIN_BID)}.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : lands.length === 0 ? (
        <p className="text-sm text-muted-foreground py-10 text-center border border-border rounded-2xl bg-card">No parcels are open for bidding right now.</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {lands.map((v, index) => {
            const card = ventureToExploreCard(v);
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-card flex flex-col"
              >
                <img src={card.image} alt="" className="h-40 w-full object-cover" />
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <h2 className="font-semibold text-foreground">{card.name}</h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {card.location}
                  </p>
                  <p className="text-xs capitalize text-muted-foreground">Status: {v.status}</p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Indicative value: </span>
                    {card.totalValue}
                  </p>
                  <Button className="mt-auto rounded-full" type="button" onClick={() => openBid(v)}>
                    Place bid
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Dialog open={!!bidLand} onOpenChange={(o) => !o && setBidLand(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit developer bid</DialogTitle>
          </DialogHeader>
          {bidLand ? (
            <div className="space-y-4 py-2 text-sm">
              <p className="font-medium">{bidLand.name}</p>
              <div className="space-y-2">
                <Label>Bid amount (INR)</Label>
                <Input type="number" min={MIN_BID} value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Timeline, plan summary…" />
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setBidLand(null)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="button" onClick={() => void submitBid()} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit bid"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeveloperBrowseLands;
