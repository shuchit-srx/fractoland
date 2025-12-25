import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, TrendingUp, ArrowLeft, Shield, FileText, Users, Minus, Plus, CreditCard, Check, X } from "lucide-react";
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
  exitConditions: [
    "Minimum lock-in period of 18 months before any exit request.",
    "Exit window opens once every quarter, subject to buyer availability.",
    "Exit price will be based on latest government guidance value and platform valuation.",
    "Platform fee of 1.5% will be charged on the exit amount.",
  ],
  images: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800&h=500&fit=crop",
  ],
  investors: 50,
};

interface LandPiece {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  available: boolean;
  owner?: string;
  price: number;
}

const LandDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedPieces, setSelectedPieces] = useState<Set<number>>(new Set());
  const [hoveredPieceId, setHoveredPieceId] = useState<number | null>(null);
  const [acceptExitConditions, setAcceptExitConditions] = useState(false);
  const [acceptPlatformTerms, setAcceptPlatformTerms] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPieceSelector, setShowPieceSelector] = useState(true);

  // Generate land pieces in a grid layout (10x10 grid = 100 pieces)
  const landPieces: LandPiece[] = useMemo(() => {
    const pieces: LandPiece[] = [];
    const gridSize = 10;
    const pieceSize = 100 / gridSize; // Percentage
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const id = row * gridSize + col + 1;
        // Randomly mark some pieces as unavailable (already sold)
        const available = Math.random() > 0.3; // 70% available
        
        pieces.push({
          id,
          x: col * pieceSize,
          y: row * pieceSize,
          width: pieceSize,
          height: pieceSize,
          available,
          price: 25000, // Price per piece
        });
      }
    }
    return pieces;
  }, []);

  const totalAmount = selectedPieces.size * 25000;
  const availablePieces = landPieces.filter(p => p.available).length;
  const selectedPiecesCount = selectedPieces.size;
  const hoveredPiece = useMemo(
    () => landPieces.find(p => p.id === hoveredPieceId) ?? null,
    [hoveredPieceId, landPieces],
  );

  const togglePiece = (pieceId: number) => {
    const piece = landPieces.find(p => p.id === pieceId);
    if (!piece || !piece.available) return;

    setSelectedPieces(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pieceId)) {
        newSet.delete(pieceId);
      } else {
        newSet.add(pieceId);
      }
      return newSet;
    });
  };

  const handleProceedToPayment = () => {
    if (selectedPieces.size === 0) {
      toast.error("Please select at least one piece of land");
      return;
    }
    if (!acceptExitConditions || !acceptPlatformTerms) {
      toast.error("Please accept the exit conditions and terms before proceeding.");
      return;
    }
    setShowPieceSelector(false);
    setShowPayment(true);
  };

  const handlePayment = (method: string) => {
    toast.success(`Payment initiated via ${method} for ${selectedPiecesCount} piece(s). Redirecting...`);
    setTimeout(() => {
      toast.success(`Investment successful! ${selectedPiecesCount} piece(s) added to your portfolio.`);
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

        {showPayment ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Complete Payment</h2>
              <p className="text-muted-foreground text-center mb-4">
                Pay ₹{totalAmount.toLocaleString()} for {selectedPiecesCount} piece(s)
              </p>

              <div className="mb-4 border border-dashed border-border rounded-2xl p-3 bg-secondary/30 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground text-center">
                  Exit &amp; terms summary
                </p>
                <p className="text-center">
                  You confirmed the exit conditions set by the land owner and accepted the
                  FractoLand platform terms before proceeding to this payment step.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handlePayment("UPI")}
                  className="w-full p-4 bg-secondary/50 rounded-full flex items-center gap-4 hover:bg-secondary transition-colors"
                >
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">UPI</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Pay with UPI</p>
                    <p className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                  </div>
                </button>

                <button
                  onClick={() => handlePayment("Card")}
                  className="w-full p-4 bg-secondary/50 rounded-full flex items-center gap-4 hover:bg-secondary transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                  </div>
                </button>

                <button
                  onClick={() => handlePayment("Net Banking")}
                  className="w-full p-4 bg-secondary/50 rounded-full flex items-center gap-4 hover:bg-secondary transition-colors"
                >
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
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
                onClick={() => {
                  setShowPayment(false);
                  setShowPieceSelector(true);
                }}
              >
                Back to Selection
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Interactive Land Piece Selector */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left - Interactive Land Map */}
              <div className="lg:col-span-2 space-y-6">
                {/* Main Image with Overlay */}
                <motion.div
                  className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white to-muted border border-border"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 120, damping: 15 }}
                >
                  <img
                    src={landData.images[0]}
                    alt={landData.name}
                    className="w-full h-[500px] object-cover opacity-30"
                  />
                  
                  {/* Interactive Grid Overlay */}
                  <div className="absolute inset-0 p-4">
                    <div className="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-xl border-2 border-primary/20">
                      {/* Grid Container */}
                      <div className="relative w-full h-full">
                        {landPieces.map((piece) => {
                          const isSelected = selectedPieces.has(piece.id);
                          const isUnavailable = !piece.available;
                          
                          return (
                            <motion.div
                              key={piece.id}
                              className="absolute border border-border/50 cursor-pointer group"
                              style={{
                                left: `${piece.x}%`,
                                top: `${piece.y}%`,
                                width: `${piece.width}%`,
                                height: `${piece.height}%`,
                              }}
                              onClick={() => togglePiece(piece.id)}
                              onMouseEnter={() => setHoveredPieceId(piece.id)}
                              onMouseLeave={() => setHoveredPieceId((current) => (current === piece.id ? null : current))}
                              whileHover={{ scale: 1.1, zIndex: 10 }}
                              whileTap={{ scale: 0.95 }}
                              animate={{
                                backgroundColor: isSelected
                                  ? "rgba(0, 0, 0, 0.85)"
                                  : isUnavailable
                                  ? "rgba(0, 0, 0, 0.35)"
                                  : "rgba(255, 255, 255, 0.08)",
                                borderColor: isSelected
                                  ? "rgba(0, 0, 0, 1)"
                                  : "rgba(0, 0, 0, 0.3)",
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              {/* Selection Indicator */}
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="absolute inset-0 flex items-center justify-center bg-primary/20"
                                >
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center"
                                  >
                                    <Check className="w-4 h-4 text-background" />
                                  </motion.div>
                                </motion.div>
                              )}
                              
                              {/* Unavailable Indicator */}
                              {isUnavailable && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <X className="w-4 h-4 text-foreground/70" />
                                </div>
                              )}
                              
                              {/* Hover Tooltip */}
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="bg-foreground text-background text-xs px-2 py-1 rounded-full whitespace-nowrap shadow-sm">
                                  Piece #{piece.id} - ₹{piece.price.toLocaleString()}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-4 justify-center">
                    <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full flex gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: "rgba(255,255,255,0.2)", borderColor: "rgba(0,0,0,0.4)" }}
                        ></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: "rgba(0,0,0,0.85)", borderColor: "rgba(0,0,0,1)" }}
                        ></div>
                        <span>Selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(0,0,0,0.7)" }}
                        ></div>
                        <span>Sold</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Hovered piece details */}
                <AnimatePresence>
                  {hoveredPiece && (
                    <motion.div
                      key={hoveredPiece.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between text-sm"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          Piece #{hoveredPiece.id}
                        </p>
                        <p className="text-muted-foreground">
                          Approx. {(100 / landPieces.length).toFixed(2)}% of total land
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-semibold text-foreground">
                          ₹{hoveredPiece.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedPieces.has(hoveredPiece.id)
                            ? "Selected"
                            : hoveredPiece.available
                            ? "Available"
                            : "Sold"}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
                    <div className="bg-secondary/50 rounded-full p-4 text-center">
                      <p className="text-xs text-muted-foreground">Total Value</p>
                      <p className="font-bold text-foreground">{landData.totalValue}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-full p-4 text-center">
                      <p className="text-xs text-muted-foreground">Area</p>
                      <p className="font-bold text-foreground">{landData.area}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-full p-4 text-center">
                      <p className="text-xs text-muted-foreground">Lock-in</p>
                      <p className="font-bold text-foreground">{landData.lockIn}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-full p-4 text-center">
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
                      <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-full">
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

              {/* Right - Selection Summary & Actions */}
              <div className="space-y-6">
                <div className="bg-card rounded-2xl border border-border p-6 sticky top-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Select Land Pieces</h2>

                  {/* Selection Stats */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Price per Piece</span>
                      <span className="font-semibold">{landData.tokenPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Available Pieces</span>
                      <span className="font-semibold">{availablePieces}/{landPieces.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Selected Pieces</span>
                      <span className="font-semibold text-primary">{selectedPiecesCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Current Investors</span>
                      <span className="font-semibold flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {landData.investors}
                      </span>
                    </div>
                  </div>

                  {/* Selected Pieces List */}
                  {selectedPieces.size > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-6"
                    >
                      <p className="text-sm font-medium text-foreground mb-3">Selected Pieces:</p>
                      <div className="max-h-32 overflow-y-auto space-y-2">
                        {Array.from(selectedPieces).map((pieceId) => (
                          <motion.div
                            key={pieceId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-2 bg-primary/10 rounded-full text-sm"
                          >
                            <span className="text-foreground">Piece #{pieceId}</span>
                            <button
                              onClick={() => togglePiece(pieceId)}
                              className="w-5 h-5 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center transition-colors"
                            >
                              <X className="w-3 h-3 text-red-600" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Total */}
                  <div className="bg-secondary/50 rounded-full p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Investment</span>
                      <span className="text-2xl font-bold text-foreground">
                        ₹{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Exit Conditions from land owner */}
                  <div className="mb-4 border border-dashed border-border rounded-2xl p-3 bg-secondary/40">
                    <p className="text-xs font-semibold text-foreground mb-2">
                      Exit conditions (uploaded by land owner)
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                      {landData.exitConditions.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Acknowledgements */}
                  <div className="space-y-2 mb-4 text-xs text-foreground">
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded border border-border accent-black"
                        checked={acceptExitConditions}
                        onChange={(e) => setAcceptExitConditions(e.target.checked)}
                      />
                      <span>
                        I have read and understood the exit conditions shared by the land owner.
                      </span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded border border-border accent-black"
                        checked={acceptPlatformTerms}
                        onChange={(e) => setAcceptPlatformTerms(e.target.checked)}
                      />
                      <span>
                        I accept the FractoLand platform terms &amp; conditions and privacy policy.
                      </span>
                    </label>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleProceedToPayment}
                    disabled={
                      selectedPieces.size === 0 ||
                      !acceptExitConditions ||
                      !acceptPlatformTerms
                    }
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Proceed to Payment ({selectedPiecesCount})
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Click on available pieces to select them
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LandDetail;
