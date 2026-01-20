import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock, MapPin, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";



import { useWishlist } from "@/contexts/WishlistContext";

const Wishlist = () => {
    const navigate = useNavigate();
    const { items, removeFromWishlist } = useWishlist();

    const removeItem = (id: string) => {
        removeFromWishlist(id);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved":
                return "bg-green-500/10 text-green-600 border-green-500/20";
            case "rejected":
                return "bg-red-500/10 text-red-600 border-red-500/20";
            default:
                return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "approved":
                return "Approved";
            case "rejected":
                return "Rejected";
            default:
                return "Waiting for Approval";
        }
    };

    return (
        <div className="space-y-8 max-w-5xl">
            <div>
                <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
                <p className="text-sm text-muted-foreground">
                    Track your Expressions of Interest and saved lands.
                </p>
            </div>

            <div className="grid gap-4">
                {items.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border">
                        <p className="text-muted-foreground">Your wishlist is empty.</p>
                        <Button
                            variant="link"
                            onClick={() => navigate("/dashboard/user/explore")}
                            className="mt-2"
                        >
                            Explore Lands
                        </Button>
                    </div>
                ) : (
                    items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center group"
                        >
                            <div className="w-full md:w-48 h-32 md:h-28 rounded-lg overflow-hidden flex-none">
                                <img
                                    src={item.image}
                                    alt={item.landName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-semibold text-foreground text-lg">{item.landName}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-3 h-3" />
                                            {item.location}
                                        </div>
                                    </div>
                                    <div
                                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                            item.status
                                        )}`}
                                    >
                                        {getStatusLabel(item.status)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>ID: {item.landId}</span>
                                    <span>Area: {item.area}</span>
                                    <span>Est. Value: {item.tokenPrice}</span>
                                </div>

                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    Added on {item.dateAdded}
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full md:w-32"
                                    onClick={() => navigate(`/dashboard/user/wishlist/${item.id}`)}
                                >
                                    View Details
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="w-full md:w-32 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => removeItem(item.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remove
                                </Button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div >
    );
};

export default Wishlist;
