
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { generateLandPieces, getLandData } from "@/data/mockLandData";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Check, ChevronLeft, ChevronRight, Copy, Download, Facebook, FileText, Link2, Linkedin, MapPin, Maximize2, MessageCircle, Shield, Twitter, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const AgentLandDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();

    // Dynamic Land Data
    const landData = useMemo(() => getLandData(id), [id]);
    const landPieces = useMemo(() => generateLandPieces(id), [id]);
    const availablePieces = landPieces.filter(p => p.available).length;

    // Grid Interaction State
    const [hoveredPieceId, setHoveredPieceId] = useState<number | null>(null);
    const hoveredPiece = useMemo(
        () => landPieces.find(p => p.id === hoveredPieceId) ?? null,
        [hoveredPieceId, landPieces],
    );

    // Gallery State
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

    // Referral Link Logic
    const referralLink = `${window.location.origin}/dashboard/user/land/${id}?ref=${user?.id || 'agent'}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink);
        toast.success("Referral link copied to clipboard!");
    };

    // Native Share Logic (File Share)
    const handleNativeShare = async () => {
        const shareData = {
            title: `Invest in ${landData.name} `,
            text: `Check out this premium land in ${landData.location}. Expected ROI: ${landData.expectedROI}.`,
            url: referralLink,
        };

        try {
            if (navigator.share) {
                try {
                    toast.info("Preparing image for share...");
                    const response = await fetch(landData.images[0]);
                    const blob = await response.blob();
                    const file = new File([blob], "land-preview.jpg", { type: "image/jpeg" });

                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            ...shareData,
                            files: [file],
                        });
                        toast.success("Shared successfully!");
                        return;
                    }
                } catch (e) {
                    console.log("Image sharing failed/cancelled", e);
                }

                // Fallback if file share declined or not supported
                await navigator.share(shareData);
            } else {
                toast.error("System share not supported on this device. Use the buttons below.");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    const handleCopyImage = async () => {
        try {
            const response = await fetch(landData.images[0]);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob,
                }),
            ]);
            toast.success("Image copied! Paste it in WhatsApp.");
            // Optional: You could ask user if they want to open WhatsApp now
        } catch (err) {
            console.error(err);
            toast.error("Failed to copy image.");
        }
    };

    const handleShare = async (platform: string) => {
        // Just open the link. We rely on the user having copied the image manually via the button.

        const title = encodeURIComponent(`* Invest in ${landData.name}* `);
        const desc = encodeURIComponent(`Check out this premium land in ${landData.location}. Expected ROI: ${landData.expectedROI}.`);
        const url = encodeURIComponent(referralLink);

        let shareUrl = "";
        switch (platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${title}%0A%0A${desc}%0A%0A${url}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${desc}&url=${url}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank');
        }
    };


    return (
        <div className="space-y-6 pb-20">
            <Helmet>
                <title>{landData.name} | Investment Opportunity</title>
                <meta name="description" content={`Check out this premium land in ${landData.location}. Expected ROI: ${landData.expectedROI}.`} />

                {/* Facebook / WhatsApp / LinkedIn Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:title" content={`Invest in ${landData.name}`} />
                <meta property="og:description" content={`Premium land in ${landData.location} with ${landData.expectedROI} expected ROI.`} />
                <meta property="og:image" content={landData.images[0]} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={window.location.href} />
                <meta name="twitter:title" content={`Invest in ${landData.name}`} />
                <meta name="twitter:description" content={`Premium land in ${landData.location} with ${landData.expectedROI} expected ROI.`} />
                <meta name="twitter:image" content={landData.images[0]} />
            </Helmet>

            {/* Back Button */}
            <Button variant="ghost" onClick={() => navigate("/dashboard/agent/explore")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
            </Button>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left - Land Info (Read Only Map) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Image with Interactive Grid */}
                    <motion.div
                        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white to-muted border border-border"
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 120, damping: 15 }}
                    >
                        <img
                            src={landData.images[0]}
                            alt={landData.name}
                            className="w-full h-[500px] object-cover opacity-30"
                            crossOrigin="anonymous"
                        />

                        {/* Interactive Grid Overlay */}
                        <div className="absolute inset-0 p-4">
                            <div className="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-xl border-2 border-primary/20">
                                {/* Grid Container */}
                                <div className="relative w-full h-full">
                                    {landPieces.map((piece) => {
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
                                                // No onClick for selection in Agent view
                                                onMouseEnter={() => setHoveredPieceId(piece.id)}
                                                onMouseLeave={() => setHoveredPieceId((current) => (current === piece.id ? null : current))}
                                                whileHover={{ scale: 1.1, zIndex: 10 }}
                                                animate={{
                                                    backgroundColor: isUnavailable
                                                        ? "rgba(0, 0, 0, 0.35)"
                                                        : "rgba(255, 255, 255, 0.08)",
                                                    borderColor: "rgba(0, 0, 0, 0.3)",
                                                }}
                                                transition={{ duration: 0.2 }}
                                            >
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
                                        {hoveredPiece.available
                                            ? "Available"
                                            : "Sold"}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Land Stats */}
                    <div className="bg-card rounded-2xl border border-border p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">{landData.name}</h1>
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <MapPin className="w-4 h-4" />
                                    {landData.location}
                                </div>
                            </div>
                        </div>

                        <h2 className="text-lg font-semibold text-foreground mb-4 mt-6">Investment Highlights</h2>
                        <p className="text-muted-foreground leading-relaxed mb-6">{landData.description}</p>

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

                {/* Right - Referral Actions */}
                <div className="space-y-6">
                    <div className="bg-card rounded-2xl border border-border p-6 sticky top-6">
                        <h2 className="text-lg font-bold text-foreground mb-4">Refer & Earn</h2>
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Commission Rate</span>
                                <span className="text-lg font-bold text-primary">2.0%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Est. Earning per Piece</span>
                                <span className="text-sm font-bold text-foreground">₹500</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-primary/10">
                                Commission is credited once the referred investor completes the payment.
                            </p>
                        </div>

                        <Button className="w-full mb-3" size="lg" onClick={() => setIsShareModalOpen(true)}>
                            <Link2 className="w-4 h-4 mr-2" />
                            Share Referral Link
                        </Button>

                        <div className="text-center text-xs text-muted-foreground">
                            Generate a unique link to track your leads.
                        </div>

                        {/* Exit Conditions from land owner (Read Only) */}
                        <div className="mt-6 border border-dashed border-border rounded-xl p-3 bg-secondary/40 text-left">
                            <p className="text-xs font-semibold text-foreground mb-2">
                                Exit conditions (Investor Terms)
                            </p>
                            <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                                {landData.exitConditions.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white/50 rounded-2xl border border-border p-6">
                        <h3 className="font-semibold mb-4">Your Activity for this Land</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Unique Clicks</span>
                                <span className="font-medium">24</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Expressions of Interest</span>
                                <span className="font-medium">3</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Converted</span>
                                <span className="font-medium">1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal - PREMIUM REDESIGN */}
            <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
                <DialogContent className="sm:max-w-xl w-[95vw] md:w-full p-0 gap-0 overflow-hidden bg-background border border-border shadow-2xl rounded-2xl [&>button]:hidden">
                    {/* Header */}
                    <div className="p-5 pb-4 bg-gradient-to-b from-secondary/50 to-background border-b border-border/40">
                        <div className="flex items-center justify-between mb-1.5">
                            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                                <span className="bg-primary/10 p-1.5 rounded-full">
                                    <Link2 className="w-4 h-4 text-primary" />
                                </span>
                                Share Opportunity
                            </h2>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary -mr-2" onClick={() => setIsShareModalOpen(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Invite investors to <span className="font-medium text-foreground">{landData.name}</span>.
                        </p>
                    </div>

                    <div className="p-5 space-y-5">
                        {/* PREVIEW CARD SECTION */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Preview</span>
                                <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/30">
                                </div>
                            </div>

                            <div className="relative group rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-all hover:shadow-md">
                                <div className="aspect-[1.91/1] relative w-full bg-muted">
                                    <img
                                        src={landData.images[0]}
                                        alt="Preview"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        crossOrigin="anonymous"
                                    />
                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="font-medium shadow-lg hover:scale-105 transition-transform"
                                            onClick={handleCopyImage}
                                        >
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy Image
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-3.5 border-t border-border/50 bg-card">
                                    <p className="font-semibold text-sm text-foreground truncate">{`Invest in ${landData.name}`}</p>
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">{`Premium land in ${landData.location} • ${landData.expectedROI} ROI`}</p>
                                    <p className="text-[10px] text-muted-foreground/60 mt-2 uppercase tracking-widest font-medium">fractoland.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Actions */}
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-3">Share via</p>
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', color: 'bg-[#25D366]', text: 'text-[#25D366]' },
                                    { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'bg-[#1877F2]', text: 'text-[#1877F2]' },
                                    { id: 'twitter', icon: Twitter, label: 'Twitter', color: 'bg-[#1DA1F2]', text: 'text-[#1DA1F2]' },
                                    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'bg-[#0A66C2]', text: 'text-[#0A66C2]' },
                                ].map((platform) => (
                                    <button
                                        key={platform.id}
                                        onClick={() => handleShare(platform.id)}
                                        className="flex flex-col items-center gap-2 group p-2.5 rounded-xl hover:bg-secondary/50 transition-all border border-transparent hover:border-border"
                                    >
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm group-hover:shadow-md group-hover:scale-110 ${platform.text} bg-background border border-border group-hover:border-transparent group-hover:text-white group-hover:${platform.color}`}>
                                            <platform.icon className="w-4 h-4 fill-current" />
                                        </div>
                                        <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{platform.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Copy Link Input */}
                        <div className="bg-secondary/30 p-1 pl-1 rounded-xl border border-border focus-within:ring-2 focus-within:ring-primary/20 transition-all flex items-center gap-2">
                            <div className="h-9 w-9 bg-background rounded-lg flex items-center justify-center shadow-sm border border-border shrink-0 ml-1">
                                <Link2 className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-mono text-muted-foreground truncate select-all px-1">{referralLink}</p>
                            </div>
                            <Button
                                size="sm"
                                onClick={handleCopyLink}
                                className="h-8 px-4"
                            >
                                Copy Link
                            </Button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-3 bg-muted/30 border-t border-border text-center">
                        <button
                            onClick={handleNativeShare}
                            className="text-[10px] font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-colors py-1.5 px-3 rounded-lg hover:bg-secondary/50 mx-auto"
                        >
                            More options
                            <Maximize2 className="w-3 h-3" />
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AgentLandDetail;
