import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { generateLandPieces, getLandData } from "@/data/mockLandData"; // UPDATED IMPORT
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, AlertTriangle, ArrowLeft, Check, CheckCircle2, ChevronLeft, ChevronRight, CreditCard, Download, FileText, MapPin, Maximize2, Shield, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const WishlistDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getItem, checkStatus } = useWishlist();
    const [showPayment, setShowPayment] = useState(false);

    // Get the specific wishlist item using the ID from the URL
    const item = id ? getItem(id) : undefined;

    // Use dynamic helper to get land data, using the saved item's landId if available
    // note: item.landId stores the LAND ID (e.g. "1"), item.id is the wishlist entry ID
    const landIdToFetch = item ? item.landId : "1";
    // Using string "1" from mock data usually corresponds to numeric 1 in the helper logic, 
    // but our helper parses id. If item.landId is "LND...", we might need to be careful.
    // Looking at mockLandData: landId is string "LND...", but helper uses numeric ID param.
    // In LandDetail, we use URL param "id". In Wishlist, we saved "landData.id" (numeric 1).
    const land = useMemo(() => getLandData(String(landIdToFetch)), [landIdToFetch]);

    // Generate pieces based on land ID seed
    const landPieces = useMemo(() => generateLandPieces(String(landIdToFetch)), [landIdToFetch]);

    // Gallery State
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [hoveredPieceId, setHoveredPieceId] = useState<number | null>(null);

    if (!item) {
        return (
            <div className="flex flex-col items-center justify-center p-10 space-y-4">
                <h2 className="text-xl font-semibold">Wishlist Item Not Found</h2>
                <Button onClick={() => navigate("/dashboard/user/wishlist")}>Back to Wishlist</Button>
            </div>
        );
    }

    const selectedPiecesSet = new Set(item.selectedPieces);
    const selectedPiecesCount = item.selectedPieces.length;
    const totalAmount = item.totalAmount;
    const hoveredPiece = landPieces.find(p => p.id === hoveredPieceId);

    // Calculate stats
    const availablePiecesCount = landPieces.filter(p => p.available).length;
    const totalPiecesCount = landPieces.length;


    const openGallery = (index: number) => {
        setCurrentImageIndex(index);
        setIsGalleryOpen(true);
    };

    const closeGallery = () => setIsGalleryOpen(false);

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % land.galleryImages.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + land.galleryImages.length) % land.galleryImages.length);
    };

    const handlePayment = (method: string) => {
        toast.success(`Payment initiated via ${method} for ${selectedPiecesCount} piece(s). Redirecting...`);
        setTimeout(() => {
            toast.success(`Investment successful! ${selectedPiecesCount} piece(s) added to your portfolio.`);
            navigate("/dashboard/user/portfolio");
        }, 2000);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate("/dashboard/user/wishlist")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Wishlist
                </Button>

                <div className="flex items-center gap-4">
                    {/* Admin Simulation Toggle */}
                    <Button variant="outline" size="sm" onClick={() => checkStatus(item.id)} className="text-xs">
                        {item.status === 'approved' ? 'Simulate Unapprove' : 'Simulate Admin Approve'}
                    </Button>
                    <div className={`px-4 py-1.5 rounded-full text-sm font-medium border flex items-center gap-2 ${item.status === "approved"
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : item.status === "rejected"
                            ? "bg-red-500/10 text-red-600 border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                        }`}>
                        {item.status === "approved" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {item.status === "approved" ? "Approved" : item.status === "rejected" ? "Rejected" : "Pending Approval"}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left - Land Map & Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Image with Overlay & Map */}
                    <motion.div
                        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white to-muted border border-border"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                        {/* We show the map directly here, assuming they want to see what they selected */}
                        <img
                            src={land.images[0]}
                            alt={land.name}
                            className="w-full h-[500px] object-cover opacity-30"
                        />
                        {/* Interactive Grid Overlay (ReadOnly) */}
                        <div className="absolute inset-0 p-4">
                            <div className="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-xl border-2 border-primary/20">
                                <div className="relative w-full h-full">
                                    {landPieces.map((piece) => {
                                        const isSelected = selectedPiecesSet.has(piece.id);
                                        const isUnavailable = !piece.available;

                                        return (
                                            <motion.div
                                                key={piece.id}
                                                className="absolute border border-border/50 transition-colors"
                                                style={{
                                                    left: `${piece.x}%`,
                                                    top: `${piece.y}%`,
                                                    width: `${piece.width}%`,
                                                    height: `${piece.height}%`,
                                                }}
                                                // No interactive toggle here, just visual feedback
                                                onMouseEnter={() => setHoveredPieceId(piece.id)}
                                                onMouseLeave={() => setHoveredPieceId(null)}
                                                animate={{
                                                    backgroundColor: isSelected
                                                        ? "rgba(0, 0, 0, 0.85)" // Selected by user
                                                        : isUnavailable
                                                            ? "rgba(0, 0, 0, 0.35)"
                                                            : "rgba(255, 255, 255, 0.08)",
                                                    borderColor: isSelected
                                                        ? "rgba(0, 0, 0, 1)"
                                                        : "rgba(0, 0, 0, 0.3)",
                                                }}
                                            >
                                                {isSelected && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                                                        <div className="w-4 h-4 bg-foreground rounded-full flex items-center justify-center">
                                                            <Check className="w-3 h-3 text-background" />
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Land Info & Stats */}
                    <div className="bg-card rounded-2xl border border-border p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">{land.name}</h1>
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <MapPin className="w-4 h-4" />
                                    {land.location}
                                </div>
                            </div>
                            <div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-semibold">
                                {land.landId}
                            </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed mb-6">{land.description}</p>

                        {/* Detailed Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Value</p>
                                <p className="font-semibold text-foreground">{land.totalValue}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Area</p>
                                <p className="font-semibold text-foreground">{land.area}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Expected ROI</p>
                                <p className="font-semibold text-green-600">{land.expectedROI}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Mandal</p>
                                <p className="font-semibold text-foreground">{land.mandal}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">District</p>
                                <p className="font-semibold text-foreground">{land.district}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">State</p>
                                <p className="font-semibold text-foreground">{land.state}</p>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="bg-card rounded-2xl border border-border p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Features & Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {land.features.map((feature, i) => (
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
                            {land.documents.map((doc, i) => (
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
                            {land.galleryImages.slice(0, 4).map((img, i) => (
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
                                    {i === 3 && land.galleryImages.length > 4 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white font-semibold text-lg">+{land.galleryImages.length - 4} More</span>
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
                                        src={land.galleryImages[currentImageIndex]}
                                        alt="Full view"
                                        className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
                                        onClick={(e) => e.stopPropagation()}
                                    />

                                    <div className="absolute bottom-6 left-0 right-0 text-center text-white/50 text-sm">
                                        Image {currentImageIndex + 1} of {land.galleryImages.length}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Notes (Lit & Owner) */}
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center flex-none">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Litigation Check</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{land.litigations}</p>
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
                                    <p className="text-muted-foreground">Owner Name: <span className="text-foreground font-medium">{land.landOwner.name}</span></p>
                                    <p className="text-muted-foreground">Type: <span className="text-foreground font-medium">{land.landOwner.type}</span></p>
                                    <p className="text-muted-foreground">Contact Representative: <span className="text-foreground font-medium">{land.landOwner.contactPerson}</span></p>
                                    <p className="text-muted-foreground flex items-center gap-1">Status: <span className="text-green-600 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Verified Owner</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right - Summary & Actions */}
                <div className="space-y-6">
                    <div className="bg-card rounded-2xl border border-border p-6 sticky top-6">
                        <h2 className="text-xl font-bold text-foreground mb-6">Select Land Pieces</h2>

                        <div className="space-y-6">

                            {/* Price Per Piece */}
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Price per Piece</p>
                                <p className="text-lg font-semibold text-foreground">{land.tokenPrice}</p>
                            </div>

                            {/* Stats Flex */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Available Pieces</p>
                                    <p className="text-base font-medium text-foreground">{availablePiecesCount}/{totalPiecesCount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Selected Pieces</p>
                                    <p className="text-base font-medium text-primary">{selectedPiecesCount}</p>
                                </div>
                            </div>

                            {/* Investors & Selected List */}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Current Investors</p>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">{land.investors}</span>
                                    </div>
                                </div>

                                <div className="border rounded-xl p-3 bg-secondary/20">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Selected Pieces:</p>
                                    <div className="flex flex-col gap-1 max-h-32 overflow-y-auto custom-scrollbar">
                                        {Array.from(selectedPiecesSet).map(pid => (
                                            <div key={pid} className="text-sm font-medium text-foreground flex items-center justify-between">
                                                <span>Piece #{pid}</span>
                                                {/* <span className="text-xs text-muted-foreground">₹25,000</span> */}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm text-muted-foreground font-medium">Total Investment</span>
                                    <span className="text-2xl font-bold text-primary">₹{totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-dashed border-border/50">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="space-y-0.5">
                                            <p className="text-muted-foreground">Request Date</p>
                                            <p className="font-medium text-foreground">{item.dateAdded}</p>
                                        </div>
                                        <div className="space-y-0.5 text-right">
                                            <p className="text-muted-foreground">Time</p>
                                            <p className="font-medium text-foreground">10:45 AM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Payment / Status Logic */}
                        <div className="mt-6 pt-6 border-t border-border">
                            {showPayment ? (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="space-y-4"
                                >
                                    <p className="text-sm font-medium">Select Payment Method:</p>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => handlePayment("UPI")}
                                            className="w-full p-3 bg-secondary/50 rounded-xl flex items-center gap-3 hover:bg-secondary transition-colors text-left"
                                        >
                                            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center flex-none">
                                                <span className="text-green-600 font-bold text-xs">UPI</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Pay with UPI</p>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => handlePayment("Card")}
                                            className="w-full p-3 bg-secondary/50 rounded-xl flex items-center gap-3 hover:bg-secondary transition-colors text-left"
                                        >
                                            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center flex-none">
                                                <CreditCard className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Credit/Debit Card</p>
                                            </div>
                                        </button>
                                    </div>
                                    <Button variant="ghost" className="w-full text-xs" onClick={() => setShowPayment(false)}>Cancel Payment</Button>
                                </motion.div>
                            ) : (
                                <>
                                    {item.status === 'approved' ? (
                                        <div className="space-y-4">
                                            <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg text-xs text-green-700 flex items-start gap-2">
                                                <Check className="w-4 h-4 flex-none mt-0.5" />
                                                <div>
                                                    <strong>Approved!</strong><br />
                                                    Your interest has been approved. Identify yourself via payment to complete the process.
                                                </div>
                                            </div>
                                            <Button className="w-full" size="lg" onClick={() => setShowPayment(true)}>
                                                <CreditCard className="w-4 h-4 mr-2" />
                                                Proceed to Payment
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg text-sm text-yellow-700">
                                            <p className="font-medium mb-1">Pending Approval</p>
                                            <p className="text-xs opacity-90">
                                                Your expression of interest is currently being reviewed. Once approved, the payment option will appear here.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WishlistDetail;
