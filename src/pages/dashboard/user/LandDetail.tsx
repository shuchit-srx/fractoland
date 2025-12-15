import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, TrendingUp, ArrowLeft, Shield, FileText, Users, Minus, Plus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const landData = {
  id: 1,
  name: "Green Valley Plot A12",
  location: "Bangalore, Karnataka",
  fullAddress: "Survey No. 45/2, Green Valley Township, Whitefield, Bangalore - 560066",
  totalValue: "₹50,00,000",
  tokenPrice: "₹25,000",
  minTokens: 1,
  maxTokens: 10,
  availableTokens: 150,
  totalTokens: 200,
  lockIn: "18 months",
  expectedROI: "12-15%",
  area: "2.5 Acres",
  description: "Prime residential land located in the rapidly developing Whitefield area. Government verified and blockchain registered. Ideal for residential development with excellent connectivity to IT hubs.",
  features: [
    "Government Verified",
    "Blockchain Registered",
    "Clear Title",
    "Road Access",
    "Water Connection",
    "Electricity Available"
  ],
  documents: [
    { name: "Title Deed", verified: true },
    { name: "Land Survey Report", verified: true },
    { name: "Encumbrance Certificate", verified: true },
    { name: "Tax Receipts", verified: true },
  ],
  images: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800&h=500&fit=crop",
  ],
  investors: 50,
};

const LandDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tokenCount, setTokenCount] = useState(1);
  const [showPayment, setShowPayment] = useState(false);

  const totalAmount = tokenCount * 25000;

  const handleInvest = () => {
    setShowPayment(true);
  };

  const handlePayment = (method: string) => {
    toast.success(`Payment initiated via ${method}. Redirecting...`);
    setTimeout(() => {
      toast.success("Investment successful! Tokens added to your portfolio.");
      navigate("/dashboard/user/portfolio");
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/dashboard/user/explore")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Explore
        </Button>

        {!showPayment ? (
          <>
            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left - Images and Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Main Image */}
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src={landData.images[0]}
                    alt={landData.name}
                    className="w-full h-[400px] object-cover"
                  />
                </div>

                {/* Land Info */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h1 className="text-2xl font-bold text-foreground mb-2">{landData.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    {landData.fullAddress}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{landData.description}</p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground">Total Value</p>
                      <p className="font-bold text-foreground">{landData.totalValue}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground">Area</p>
                      <p className="font-bold text-foreground">{landData.area}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground">Lock-in</p>
                      <p className="font-bold text-foreground">{landData.lockIn}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground">Expected ROI</p>
                      <p className="font-bold text-green-600">{landData.expectedROI}</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {landData.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 bg-green-500/10 rounded-full flex items-center justify-center">
                          <Shield className="w-3 h-3 text-green-600" />
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Verified Documents</h2>
                  <div className="space-y-3">
                    {landData.documents.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm font-medium">{doc.name}</span>
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Investment Panel */}
              <div className="space-y-6">
                <div className="bg-card rounded-2xl border border-border p-6 sticky top-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Invest in this Land</h2>

                  {/* Token Info */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token Price</span>
                      <span className="font-semibold">{landData.tokenPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available Tokens</span>
                      <span className="font-semibold">{landData.availableTokens}/{landData.totalTokens}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Investors</span>
                      <span className="font-semibold flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {landData.investors}
                      </span>
                    </div>
                  </div>

                  {/* Token Selector */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Number of Tokens
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTokenCount(Math.max(1, tokenCount - 1))}
                        disabled={tokenCount <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={tokenCount}
                        onChange={(e) => setTokenCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                        className="text-center"
                        min={1}
                        max={10}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTokenCount(Math.min(10, tokenCount + 1))}
                        disabled={tokenCount >= 10}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Investment</span>
                      <span className="text-2xl font-bold text-foreground">
                        ₹{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleInvest}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Invest Now
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By investing, you agree to our terms and conditions
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Payment Screen */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Complete Payment</h2>
              <p className="text-muted-foreground text-center mb-6">
                Pay ₹{totalAmount.toLocaleString()} for {tokenCount} token(s)
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handlePayment("UPI")}
                  className="w-full p-4 bg-secondary/50 rounded-xl flex items-center gap-4 hover:bg-secondary transition-colors"
                >
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <span className="text-green-600 font-bold">UPI</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Pay with UPI</p>
                    <p className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                  </div>
                </button>

                <button
                  onClick={() => handlePayment("Card")}
                  className="w-full p-4 bg-secondary/50 rounded-xl flex items-center gap-4 hover:bg-secondary transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                  </div>
                </button>

                <button
                  onClick={() => handlePayment("Net Banking")}
                  className="w-full p-4 bg-secondary/50 rounded-xl flex items-center gap-4 hover:bg-secondary transition-colors"
                >
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-xs">BANK</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Net Banking</p>
                    <p className="text-sm text-muted-foreground">All major banks supported</p>
                  </div>
                </button>
              </div>

              <Button
                variant="ghost"
                className="w-full mt-6"
                onClick={() => setShowPayment(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LandDetail;
