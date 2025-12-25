import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const OwnerAddLand = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In a real app this would call an API. For now we just simulate and redirect.
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Land submitted for verification as a draft.");
      navigate("/dashboard/owner/lands");
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add New Land</h1>
            <p className="text-sm text-muted-foreground">
              Provide basic details about your land parcel to start the tokenization process. You can
              edit and upload documents later before final submission.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-card">
            <h2 className="text-sm font-semibold text-foreground">Land details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Land name</label>
                <Input placeholder="e.g. Green Valley Hills" required className="h-10 rounded-full" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Reference ID (optional)</label>
                <Input placeholder="Internal reference" className="h-10 rounded-full" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">City</label>
                <Input placeholder="City" required className="h-10 rounded-full" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">State</label>
                <Input placeholder="State" required className="h-10 rounded-full" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-medium text-foreground">Full address / survey details</label>
                <Input
                  placeholder="Survey number, village, taluk, district"
                  required
                  className="h-10 rounded-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Total area (Acres or sq.ft)</label>
                <Input placeholder="e.g. 2.5 Acres" required className="h-10 rounded-full" />
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-card">
            <h2 className="text-sm font-semibold text-foreground">Tokenization configuration</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Price per token (₹)</label>
                <Input type="number" min={0} placeholder="25000" className="h-10 rounded-full" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Total tokens</label>
                <Input type="number" min={0} placeholder="2000" className="h-10 rounded-full" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Lock-in period (months)</label>
                <Input type="number" min={0} placeholder="18" className="h-10 rounded-full" />
              </div>
            </div>
          </section>

          <section className="bg-card border border-dashed border-border rounded-2xl p-6 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Documents (optional for now)</h2>
            <p className="text-xs text-muted-foreground">
              After creating this land record you can upload RTC, Patta, EC, tax receipts and other
              ownership documents from the land details page.
            </p>
          </section>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-full h-9 px-5 text-sm"
              onClick={() => navigate("/dashboard/owner/lands")}
            >
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="rounded-full h-9 px-6 text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </Button>
            </motion.div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default OwnerAddLand;

