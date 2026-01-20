import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { CheckCircle, Copy, Eye, Link2, Plus, QrCode, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const initialLinks = [
  {
    id: 1,
    name: "Main Campaign",
    code: "AGENT123",
    url: "https://fractoland.com/ref/AGENT123",
    clicks: 156,
    signups: 48,
    conversions: 32,
    earnings: "₹64,000",
    createdOn: "Oct 15, 2024",
    isActive: true,
  },
  {
    id: 2,
    name: "Social Media",
    code: "AGENT123-SM",
    url: "https://fractoland.com/ref/AGENT123-SM",
    clicks: 89,
    signups: 25,
    conversions: 15,
    earnings: "₹30,000",
    createdOn: "Nov 1, 2024",
    isActive: true,
  },
  {
    id: 3,
    name: "WhatsApp Group",
    code: "AGENT123-WA",
    url: "https://fractoland.com/ref/AGENT123-WA",
    clicks: 234,
    signups: 67,
    conversions: 42,
    earnings: "₹84,000",
    createdOn: "Nov 10, 2024",
    isActive: true,
  },
];

const ReferralLinks = () => {
  const [links, setLinks] = useState(initialLinks);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [selectedLink, setSelectedLink] = useState<typeof links[0] | null>(null);

  const copyLink = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const createLink = () => {
    if (!newLinkName.trim()) {
      toast.error("Please enter a link name");
      return;
    }
    const newLink = {
      id: links.length + 1,
      name: newLinkName,
      code: `AGENT123-${newLinkName.toUpperCase().replace(/\s+/g, "").slice(0, 4)}`,
      url: `https://fractoland.com/ref/AGENT123-${Date.now()}`,
      clicks: 0,
      signups: 0,
      conversions: 0,
      earnings: "₹0",
      createdOn: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      isActive: true,
    };
    setLinks([...links, newLink]);
    setShowCreateModal(false);
    setNewLinkName("");
    toast.success("New referral link created!");
  };

  const deleteLink = (id: number) => {
    setLinks(links.filter(l => l.id !== id));
    toast.success("Link deleted");
  };

  const shareLink = (url: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Join FractoLand",
        text: "Invest in fractional land ownership with FractoLand",
        url: url,
      });
    } else {
      copyLink(0, url);
    }
  };

  const totalStats = {
    clicks: links.reduce((sum, l) => sum + l.clicks, 0),
    signups: links.reduce((sum, l) => sum + l.signups, 0),
    conversions: links.reduce((sum, l) => sum + l.conversions, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Clicks</p>
          <p className="text-2xl font-bold text-foreground">{totalStats.clicks}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Signups</p>
          <p className="text-2xl font-bold text-foreground">{totalStats.signups}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Conversion Rate</p>
          <p className="text-2xl font-bold text-green-600">
            {Math.round((totalStats.conversions / totalStats.signups) * 100) || 0}%
          </p>
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-4">
        {links.map((link, index) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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
                    <p className="text-xs text-muted-foreground">Created {link.createdOn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2 mt-3">
                  <code className="text-sm text-muted-foreground flex-1 truncate">{link.url}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyLink(link.id, link.url)}
                  >
                    {copiedId === link.id ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
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
                  <p className="font-semibold text-green-600">{link.earnings}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => shareLink(link.url)}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedLink(link)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => deleteLink(link.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Create New Referral Link</h2>

            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-2 block">Link Name</label>
              <Input
                placeholder="e.g., Instagram Campaign"
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use a descriptive name to track performance
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={createLink}>
                Create Link
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Link Details Modal */}
      {selectedLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-foreground mb-2">{selectedLink.name}</h2>
            <p className="text-sm text-muted-foreground mb-6">Link Analytics</p>

            <div className="bg-secondary/50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-32 h-32 bg-background rounded-xl flex items-center justify-center border border-border">
                  <QrCode className="w-16 h-16 text-muted-foreground" />
                </div>
              </div>
              <code className="text-sm text-muted-foreground block text-center break-all">
                {selectedLink.url}
              </code>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Total Clicks</p>
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
                <p className="text-xl font-bold text-green-600">{selectedLink.earnings}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => copyLink(selectedLink.id, selectedLink.url)}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button className="flex-1" onClick={() => setSelectedLink(null)}>
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
