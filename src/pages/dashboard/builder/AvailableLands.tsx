import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Ruler, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const lands = [
  {
    id: 1,
    name: "Industrial Zone A",
    location: "Bangalore, Karnataka",
    size: "5.2 acres",
    minBid: "₹2,50,00,000",
    currentBid: "₹2,75,00,000",
    deadline: "15 days",
    bidders: 8,
    description: "Prime industrial land with excellent road connectivity. Suitable for manufacturing or warehousing.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Commercial Plot B",
    location: "Mumbai, Maharashtra",
    size: "3.8 acres",
    minBid: "₹4,20,00,000",
    currentBid: "₹4,50,00,000",
    deadline: "8 days",
    bidders: 12,
    description: "Premium commercial land in Mumbai's business district. Ideal for office complex or shopping mall.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Residential Block C",
    location: "Pune, Maharashtra",
    size: "7.1 acres",
    minBid: "₹1,80,00,000",
    currentBid: "₹1,95,00,000",
    deadline: "22 days",
    bidders: 5,
    description: "Large residential plot near IT parks. Perfect for apartment complex or gated community development.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Tech Park Zone D",
    location: "Hyderabad, Telangana",
    size: "10 acres",
    minBid: "₹5,00,00,000",
    currentBid: "₹5,25,00,000",
    deadline: "30 days",
    bidders: 3,
    description: "Large plot designated for tech park development. Adjacent to HITEC City with all infrastructure.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"
  },
];

const AvailableLands = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLand, setSelectedLand] = useState<typeof lands[0] | null>(null);
  const [bidAmount, setBidAmount] = useState("");

  const filteredLands = lands.filter(land =>
    land.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    land.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBid = () => {
    if (!bidAmount) {
      toast.error("Please enter a bid amount");
      return;
    }
    toast.success("Bid submitted successfully! You'll be notified of any updates.");
    setSelectedLand(null);
    setBidAmount("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Available Lands</h1>
        <p className="text-muted-foreground mt-1">Browse and bid on tokenized land parcels</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by name or location..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Land Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredLands.map((land, index) => (
          <motion.div
            key={land.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-card"
          >
            <div className="relative h-48">
              <img
                src={land.image}
                alt={land.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-xs font-medium text-amber-600">
                  {land.deadline} left
                </span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-foreground text-lg mb-1">{land.name}</h3>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                <MapPin className="w-4 h-4" />
                {land.location}
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{land.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Size</p>
                  <p className="font-semibold text-foreground flex items-center gap-1">
                    <Ruler className="w-3 h-3" />
                    {land.size}
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Bidders</p>
                  <p className="font-semibold text-foreground">{land.bidders} active</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Min Bid</p>
                  <p className="font-semibold text-foreground">{land.minBid}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Current Bid</p>
                  <p className="font-semibold text-green-600">{land.currentBid}</p>
                </div>
              </div>

              <Button className="w-full" onClick={() => setSelectedLand(land)}>
                Place Bid
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bid Modal */}
      {selectedLand && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-foreground mb-2">Place Bid</h2>
            <p className="text-muted-foreground text-sm mb-6">{selectedLand.name}</p>

            <div className="bg-secondary/50 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Minimum Bid</span>
                <span className="text-sm font-medium">{selectedLand.minBid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Current Highest</span>
                <span className="text-sm font-medium text-green-600">{selectedLand.currentBid}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-2 block">Your Bid Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  type="text"
                  placeholder="Enter your bid"
                  className="pl-8"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Bid must be higher than {selectedLand.currentBid}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedLand(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleBid}>
                Submit Bid
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AvailableLands;
