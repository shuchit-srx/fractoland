import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatInr } from "@/lib/dashboardApi";
import {
  createReferralLink,
  deactivateReferralLink,
  listMyReferralLinks,
  type ReferralLinkRow,
} from "@/lib/referralsApi";
import { motion } from "framer-motion";
import { CheckCircle, Copy, Eye, Link2, Plus, QrCode, Share2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const ReferralLinks = () => {
  const [links, setLinks] = useState<ReferralLinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [selectedLink, setSelectedLink] = useState<ReferralLinkRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listMyReferralLinks();
      setLinks(res.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load links");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const copyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Link copied");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const createLink = async () => {
    if (!newLinkName.trim()) {
      toast.error("Please enter a link name");
      return;
    }
    try {
      const row = await createReferralLink(newLinkName.trim());
      setLinks((prev) => [row, ...prev]);
      setShowCreateModal(false);
      setNewLinkName("");
      toast.success("Referral link created");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Create failed");
    }
  };

  const deleteLink = async (id: string) => {
    try {
      await deactivateReferralLink(id);
      setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, is_active: false } : l)));
      toast.success("Link deactivated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not deactivate");
    }
  };

  const shareLink = (url: string) => {
    if (navigator.share) {
      void navigator.share({
        title: "Join FractoLand",
        text: "Invest in fractional land ownership with FractoLand",
        url,
      });
    } else {
      copyLink("share", url);
    }
  };

  const totalStats = {
    clicks: links.reduce((sum, l) => sum + (l.clicks || 0), 0),
    signups: links.reduce((sum, l) => sum + (l.signups || 0), 0),
    conversions: links.reduce((sum, l) => sum + (l.conversions || 0), 0),
  };
  const convRate = totalStats.signups > 0 ? Math.round((totalStats.conversions / totalStats.signups) * 100) : 0;

  const displayLinks = links.filter((l) => l.is_active);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Referral Links</h1>
          <p className="text-muted-foreground mt-1">Create and manage your referral links</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Link
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Clicks</p>
          <p className="text-2xl font-bold text-foreground">{loading ? "—" : totalStats.clicks}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Signups</p>
          <p className="text-2xl font-bold text-foreground">{loading ? "—" : totalStats.signups}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Conversion rate</p>
          <p className="text-2xl font-bold text-green-600">{loading ? "—" : `${convRate}%`}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading links…</p>
      ) : (
        <div className="space-y-4">
          {displayLinks.map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl border border-border p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Link2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{link.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(link.created_at).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2 mt-3">
                    <code className="text-sm text-muted-foreground flex-1 truncate">{link.full_url}</code>
                    <Button size="sm" variant="ghost" type="button" onClick={() => copyLink(link.id, link.full_url || "")}>
                      {copiedId === link.id ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Clicks</p>
                    <p className="font-semibold text-foreground">{link.clicks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Signups</p>
                    <p className="font-semibold text-foreground">{link.signups}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Conversions</p>
                    <p className="font-semibold text-foreground">{link.conversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Earnings</p>
                    <p className="font-semibold text-green-600">{formatInr(link.earnings_from_link ?? 0)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" type="button" onClick={() => shareLink(link.full_url || "")}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" type="button" onClick={() => setSelectedLink(link)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    type="button"
                    onClick={() => deleteLink(link.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
          {displayLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No active links. Create one to start tracking.</p>
          ) : null}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Create New Referral Link</h2>
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-2 block">Link name</label>
              <Input
                placeholder="e.g. Instagram campaign"
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" type="button" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" type="button" onClick={createLink}>
                Create
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {selectedLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-foreground mb-2">{selectedLink.name}</h2>
            <p className="text-sm text-muted-foreground mb-6">Link analytics</p>
            <div className="bg-secondary/50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-32 h-32 bg-background rounded-xl flex items-center justify-center border border-border">
                  <QrCode className="w-16 h-16 text-muted-foreground" />
                </div>
              </div>
              <code className="text-sm text-muted-foreground block text-center break-all">{selectedLink.full_url}</code>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Clicks</p>
                <p className="text-xl font-bold text-foreground">{selectedLink.clicks}</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Signups</p>
                <p className="text-xl font-bold text-foreground">{selectedLink.signups}</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Conversions</p>
                <p className="text-xl font-bold text-foreground">{selectedLink.conversions}</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Earnings</p>
                <p className="text-xl font-bold text-green-600">{formatInr(selectedLink.earnings_from_link ?? 0)}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" type="button" onClick={() => copyLink(selectedLink.id, selectedLink.full_url || "")}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button className="flex-1" type="button" onClick={() => setSelectedLink(null)}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReferralLinks;
