import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface WishlistItem {
    id: string; // Unique ID for the wishlist item
    landId: string; // ID of the land from LandData
    landName: string;
    location: string;
    image: string;
    selectedPieces: number[]; // Array of selected piece IDs
    pricePerPiece: number;
    totalAmount: number;
    status: "pending" | "approved" | "rejected";
    dateAdded: string;
    // Snapshot of other details to show in the fresh page without re-fetching if data changes
    area: string;
    tokenPrice: string;
    expectedROI: string;
}

interface WishlistContextType {
    items: WishlistItem[];
    addToWishlist: (item: Omit<WishlistItem, "id" | "dateAdded" | "status">) => void;
    removeFromWishlist: (id: string) => void;
    checkStatus: (id: string) => void; // Simulates admin approval
    getItem: (id: string) => WishlistItem | undefined;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<WishlistItem[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem("fractoland_wishlist");
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse wishlist", e);
            }
        }
    }, []);

    // Save to local storage whenever items change
    useEffect(() => {
        localStorage.setItem("fractoland_wishlist", JSON.stringify(items));
    }, [items]);

    const addToWishlist = (newItem: Omit<WishlistItem, "id" | "dateAdded" | "status">) => {
        // Check if already exists for this land
        const existing = items.find((i) => i.landId === newItem.landId);
        if (existing) {
            // For simplicity in this demo, we'll replace the existing one or just notify
            // Let's update it to the new selection
            setItems((prev) =>
                prev.map((i) =>
                    i.landId === newItem.landId
                        ? {
                            ...i,
                            ...newItem,
                            selectedPieces: newItem.selectedPieces,
                            totalAmount: newItem.totalAmount,
                            dateAdded: new Date().toLocaleDateString(),
                            status: "pending", // Reset status on update
                        }
                        : i
                )
            );
            toast.success("Wishlist updated with new selection!");
        } else {
            const item: WishlistItem = {
                ...newItem,
                id: crypto.randomUUID(),
                status: "pending",
                dateAdded: new Date().toLocaleDateString(),
            };
            setItems((prev) => [item, ...prev]);
            toast.success("Added to Wishlist successfully!");
        }
    };

    const removeFromWishlist = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
        toast.success("Removed from wishlist");
    };

    const checkStatus = (id: string) => {
        // Simulate Admin Approval after a toggle/check
        setItems((prev) =>
            prev.map((i) =>
                i.id === id
                    ? { ...i, status: i.status === "pending" ? "approved" : "pending" }
                    : i
            )
        );
    };

    const getItem = (id: string) => items.find((i) => i.id === id);

    return (
        <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, checkStatus, getItem }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
