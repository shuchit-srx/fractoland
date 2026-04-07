import {
  createWishlistItem,
  deleteWishlistItem,
  formatDate,
  formatInr,
  getWishlist,
  type WishlistApiItem,
} from "@/lib/dashboardApi";
import { getAccessToken } from "@/lib/api";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop";

export interface WishlistItem {
  id: string;
  landId: string;
  landName: string;
  location: string;
  image: string;
  selectedPieces: number[];
  pricePerPiece: number;
  totalAmount: number;
  status: "pending" | "approved" | "rejected";
  dateAdded: string;
  area: string;
  tokenPrice: string;
  expectedROI: string;
}

function mapApiToItem(row: WishlistApiItem): WishlistItem {
  const v = row.venture;
  const tokenPrice = v.token_price ?? 0;
  const status =
    row.status === "approved" || row.status === "rejected" || row.status === "pending"
      ? row.status
      : "pending";
  const area =
    v.area_acres != null && Number.isFinite(v.area_acres)
      ? `${v.area_acres} acres`
      : "—";
  return {
    id: row.id,
    landId: row.venture_id,
    landName: v.name || "Venture",
    location: v.location || "—",
    image: row.image_url || DEFAULT_IMAGE,
    selectedPieces: row.selected_piece_ids,
    pricePerPiece: tokenPrice,
    totalAmount: row.total_amount,
    status,
    dateAdded: formatDate(row.created_at),
    area,
    tokenPrice: formatInr(tokenPrice),
    expectedROI: v.expected_roi_percent != null ? `${v.expected_roi_percent}%` : "—",
  };
}

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  refreshWishlist: () => Promise<void>;
  addToWishlist: (item: Omit<WishlistItem, "id" | "dateAdded" | "status">) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  getItem: (id: string) => WishlistItem | undefined;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshWishlist = useCallback(async () => {
    if (!getAccessToken()) {
      setItems([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { items: rows } = await getWishlist({ limit: 100 });
      setItems(rows.map(mapApiToItem));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load wishlist";
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshWishlist();
  }, [refreshWishlist]);

  const addToWishlist = async (newItem: Omit<WishlistItem, "id" | "dateAdded" | "status">) => {
    if (!getAccessToken()) {
      toast.error("Please sign in to save your wishlist.");
      return;
    }
    try {
      await createWishlistItem({
        venture_id: newItem.landId,
        selected_piece_ids: newItem.selectedPieces,
        total_amount: newItem.totalAmount,
      });
      await refreshWishlist();
      toast.success("Saved to your wishlist.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save wishlist");
      throw e;
    }
  };

  const removeFromWishlist = async (id: string) => {
    if (!getAccessToken()) {
      toast.error("Please sign in to manage your wishlist.");
      return;
    }
    try {
      await deleteWishlistItem(id);
      await refreshWishlist();
      toast.success("Removed from wishlist");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not remove item");
    }
  };

  const getItem = (id: string) => items.find((i) => i.id === id);

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        error,
        refreshWishlist,
        addToWishlist,
        removeFromWishlist,
        getItem,
      }}
    >
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
