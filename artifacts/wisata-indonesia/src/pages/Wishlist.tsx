import { useWishlist } from "@/hooks/use-wishlist";
import { Link } from "wouter";
import { Heart, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function WishlistPage() {
  const { wishlist, remove, loading } = useWishlist();
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <Heart className="w-8 h-8 text-secondary fill-secondary" />
        {t('wishlist.title', 'Wishlist Saya')}
      </h1>
      {wishlist.length === 0 ? (
        <div className="bg-muted/40 border border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground">
          <p className="text-lg mb-2">{t('wishlist.empty', 'Belum ada paket di wishlist.')}</p>
          <Link href="/paket-wisata" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all">
            {t('wishlist.browse', 'Jelajahi Paket')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-card border border-border rounded-xl p-6">
              <div>
                <div className="font-bold text-lg mb-1">{item.package?.title || `Paket #${item.packageId}`}</div>
                <div className="text-muted-foreground text-sm">ID: {item.packageId}</div>
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-lg font-bold hover:bg-secondary/20 transition-all"
                onClick={() => remove(item.id)}
                disabled={loading}
              >
                <Heart className="w-5 h-5 fill-secondary text-secondary" /> {t('wishlist.remove', 'Hapus')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
