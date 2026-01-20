import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { generateLandPieces, getLandData } from "@/data/mockLandData"; // CORRECTED IMPORT
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Check, ChevronLeft, ChevronRight, Download, FileText, MapPin, Maximize2, Shield, TrendingUp, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

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
  const [showPieceSelector, setShowPieceSelector] = useState(true);

  // Dynamic Land Data
  const landData = useMemo(() => getLandData(id), [id]);

  // EOI Context
  const { addToWishlist, items: wishlistItems } = useWishlist();

  // Check if this land is already in wishlist
  const existingWishlistItem = wishlistItems.find(i => i.landId === landData.id);
  const isInterested = !!existingWishlistItem;

  // Gallery State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => setIsGalleryOpen(false);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % landData.galleryImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + landData.galleryImages.length) % landData.galleryImages.length);
  };

  // Generate land pieces in a grid layout (10x10 grid = 100 pieces)
  // Use id for seed
  const landPieces = useMemo(() => generateLandPieces(id), [id]);

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

  const handleExpressionOfInterest = () => {
    if (selectedPieces.size === 0) {
      toast.error("Please select at least one piece of land");
      return;
    }
    if (!acceptExitConditions || !acceptPlatformTerms) {
      toast.error("Please accept the exit conditions and terms.");
      return;
    }

    addToWishlist({
      landId: landData.id,
      landName: landData.name,
      location: landData.location,
      image: landData.images[0],
      selectedPieces: Array.from(selectedPieces),
      pricePerPiece: 25000,
      totalAmount: selectedPieces.size * 25000,
      area: landData.area,
      tokenPrice: landData.tokenPrice,
      expectedROI: landData.expectedROI,
    });

    setSelectedPieces(new Set());
    setAcceptExitConditions(false);
    setAcceptPlatformTerms(false);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate("/dashboard/user/explore")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Explore
      </Button>

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
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{landData.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4" />
                  {landData.location}
                </div>
              </div>
              <div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-semibold">
                {landData.landId}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">{landData.description}</p>

            {/* Detailed Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {/* Row 1 - Core Details */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Value</p>
                <p className="font-semibold text-foreground">{landData.totalValue}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Area</p>
                <p className="font-semibold text-foreground">{landData.area}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Price per Sq.ft</p>
                <p className="font-semibold text-foreground">{landData.pricePerSqFt}</p>
              </div>

              {/* Row 2 - Identifiers */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Survey Number</p>
                <p className="font-semibold text-foreground">{landData.surveyNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Village</p>
                <p className="font-semibold text-foreground">{landData.village}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Hobli</p>
                <p className="font-semibold text-foreground">{landData.hobli}</p>
              </div>

              {/* Row 3 - Admin Boundaries */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Mandal</p>
                <p className="font-semibold text-foreground">{landData.mandal}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">District</p>
                <p className="font-semibold text-foreground">{landData.district}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">State</p>
                <p className="font-semibold text-foreground">{landData.state}</p>
              </div>

              {/* Row 4 - Others */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Country</p>
                <p className="font-semibold text-foreground">{landData.country}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Lock-in Period</p>
                <p className="font-semibold text-foreground">{landData.lockIn}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Expected ROI</p>
                <p className="font-semibold text-green-600">{landData.expectedROI}</p>
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

          {/* Documents Block */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Official Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {landData.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 border border-border/50 rounded-xl hover:bg-secondary/50 transition-colors group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-none">
                      <FileText className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{doc.type} • {doc.size}</span>
                        {doc.verified && (
                          <span className="flex items-center gap-1 text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded text-[10px]">
                            <Check className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Block */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Site Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {landData.galleryImages.slice(0, 4).map((img, i) => (
                <motion.div
                  key={i}
                  className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => openGallery(i)}
                  whileHover={{ scale: 1.02 }}
                >
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
                  </div>
                  {i === 3 && landData.galleryImages.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">+{landData.galleryImages.length - 4} More</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
              {isGalleryOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                  onClick={closeGallery}
                >
                  <button className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full bg-white/10" onClick={closeGallery}>
                    <X className="w-6 h-6" />
                  </button>

                  <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors hidden md:block" onClick={prevImage}>
                    <ChevronLeft className="w-8 h-8" />
                  </button>

                  <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors hidden md:block" onClick={nextImage}>
                    <ChevronRight className="w-8 h-8" />
                  </button>

                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={landData.galleryImages[currentImageIndex]}
                    alt="Full view"
                    className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />

                  <div className="absolute bottom-6 left-0 right-0 text-center text-white/50 text-sm">
                    Image {currentImageIndex + 1} of {landData.galleryImages.length}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notes Block (Litigations & Owner) */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center flex-none">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Litigation Check</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{landData.litigations}</p>
              </div>
            </div>

            <div className="h-px bg-amber-500/20 w-full" />

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center flex-none">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Land Owner Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <p className="text-muted-foreground">Owner Name: <span className="text-foreground font-medium">{landData.landOwner.name}</span></p>
                  <p className="text-muted-foreground">Type: <span className="text-foreground font-medium">{landData.landOwner.type}</span></p>
                  <p className="text-muted-foreground">Contact Representative: <span className="text-foreground font-medium">{landData.landOwner.contactPerson}</span></p>
                  <p className="text-muted-foreground flex items-center gap-1">Status: <span className="text-green-600 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Verified Owner</span></p>
                </div>
              </div>
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

            {isInterested ? (
              <Button
                className="w-full"
                size="lg"
                variant="outline"
                onClick={() => navigate(`/dashboard/user/wishlist/${existingWishlistItem?.id}`)}
              >
                <Check className="w-4 h-4 mr-2" />
                View in Wishlist
              </Button>
            ) : (
              <Button
                className="w-full"
                size="lg"
                onClick={handleExpressionOfInterest}
                disabled={selectedPieces.size === 0 || !acceptExitConditions || !acceptPlatformTerms}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Expression of Interest
              </Button>
            )}

            <p className="text-xs text-muted-foreground text-center mt-4">
              {isInterested
                ? "You have already expressed interest. Check your wishlist."
                : "Select pieces to express interest"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandDetail;
