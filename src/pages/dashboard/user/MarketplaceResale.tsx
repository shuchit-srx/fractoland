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
import { useAuth } from "@/contexts/AuthContext";
import { formatInr, paymentCallback } from "@/lib/dashboardApi";
import { getMarketplaceListings, purchaseResaleListing, type MarketplaceListing } from "@/lib/resaleApi";
import { motion } from "framer-motion";
import { Loader2, MapPin, RefreshCw, ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop";

const MarketplaceResale = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MarketplaceListing | null>(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [paying, setPaying] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMarketplaceListings({ limit: 80 });
      setItems(res.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openBuy = (row: MarketplaceListing) => {
    if (!isAuthenticated) {
      toast.error("Sign in to buy");
      navigate("/login");
      return;
    }
    setSelected(row);
    setOfferAmount(row.requested_amount != null ? String(row.requested_amount) : "");
  };

  const pay = async (method: "wallet" | "gateway") => {
    if (!selected) return;
    const payload: { payment_method: "wallet" | "gateway"; amount?: number } = { payment_method: method };
    if (selected.requested_amount == null) {
      const n = Number(offerAmount);
      if (!Number.isFinite(n) || n < 1000) {
        toast.error("Enter a valid offer (min ₹1,000) for open-priced listings");
        return;
      }
      payload.amount = n;
    }

    setPaying(true);
    try {
      const result = await purchaseResaleListing(selected.id, payload);
      if (result.status === "completed") {
        toast.success("Purchase complete. Tokens are in your portfolio.");
        setSelected(null);
        await load();
        navigate("/dashboard/user/portfolio");
        return;
      }
      if (method === "gateway" && result.payment_gateway_order_id) {
        await paymentCallback({
          gateway_order_id: result.payment_gateway_order_id,
          gateway_payment_id: `pay_${Date.now()}`,
          status: "completed",
        });
        toast.success("Purchase complete. Tokens are in your portfolio.");
        setSelected(null);
        await load();
        navigate("/dashboard/user/portfolio");
        return;
      }
      toast.message("Complete payment via your bank / gateway when integrated.");
      setSelected(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Purchase failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resale marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Buy tokens other investors have listed (admin-approved listings only). Seller proceeds are credited to their wallet net of a small platform fee; all movements appear in Payments.
          </p>
        </div>
        <Button variant="outline" size="sm" type="button" onClick={() => void load()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center rounded-2xl border border-border bg-card">
          No listings right now. Sellers submit resale requests from Portfolio; admins move them to listed.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((row, i) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-card flex flex-col"
            >
              <img
                src={row.image_url || DEFAULT_IMAGE}
                alt=""
                className="h-40 w-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col gap-2">
                <h2 className="font-semibold text-foreground line-clamp-2">{row.venture_name || "Land parcel"}</h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {row.location || "—"}
                </p>
                <div className="text-sm space-y-1 mt-2">
                  <p>
                    <span className="text-muted-foreground">Tokens: </span>
                    <span className="font-medium">{row.token_count}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Ask: </span>
                    <span className="font-medium">
                      {row.requested_amount != null ? formatInr(row.requested_amount) : "Make an offer (min ₹1,000)"}
                    </span>
                  </p>
                  {row.queue_position != null ? (
                    <p className="text-xs text-muted-foreground">Queue #{row.queue_position}</p>
                  ) : null}
                </div>
                <Button className="mt-auto rounded-full gap-2" type="button" onClick={() => openBuy(row)}>
                  <ShoppingCart className="w-4 h-4" />
                  Buy
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm purchase</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-4 py-2 text-sm">
              <p className="text-muted-foreground">{selected.venture_name}</p>
              <p>
                {selected.token_count} token(s)
                {selected.requested_amount != null ? (
                  <> · Total {formatInr(selected.requested_amount)}</>
                ) : null}
              </p>
              {selected.requested_amount == null ? (
                <div className="space-y-2">
                  <Label>Your offer (INR)</Label>
                  <Input type="number" min={1000} value={offerAmount} onChange={(e) => setOfferAmount(e.target.value)} />
                </div>
              ) : null}
              <p className="text-xs text-muted-foreground">
                Pay with wallet balance or test gateway flow (dev callback). Seller receives funds net of platform fee; see your Payments history for audit.
              </p>
            </div>
          ) : null}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" type="button" onClick={() => setSelected(null)} disabled={paying}>
              Cancel
            </Button>
            <Button type="button" disabled={paying} onClick={() => pay("wallet")}>
              {paying ? "…" : "Pay with wallet"}
            </Button>
            <Button variant="secondary" type="button" disabled={paying} onClick={() => pay("gateway")}>
              Pay via gateway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketplaceResale;
