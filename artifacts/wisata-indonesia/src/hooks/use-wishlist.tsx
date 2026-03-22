import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "@/lib/wishlistApi";

export interface WishlistItem {
  id: number;
  userId: number;
  packageId: number;
  createdAt: string;
}

interface WishlistContextValue {
  wishlist: WishlistItem[];
  loading: boolean;
  error: string | null;
  add: (packageId: number) => Promise<void>;
  remove: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
  isInWishlist: (packageId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextValue>({
  wishlist: [],
  loading: false,
  error: null,
  add: async () => {},
  remove: async () => {},
  refresh: async () => {},
  isInWishlist: () => false,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWishlist();
      setWishlist(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat wishlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (packageId: number) => {
    await addToWishlist(packageId);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: number) => {
    await removeFromWishlist(id);
    setWishlist(prev => prev.filter(item => item.id !== id));
  }, []);

  const isInWishlist = useCallback((packageId: number) => {
    return wishlist.some(item => item.packageId === packageId);
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, loading, error, add, remove, refresh, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
