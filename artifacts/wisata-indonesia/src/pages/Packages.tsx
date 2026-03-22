import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Link, useSearch } from "wouter";
import { MapPin, Star, Filter, Calendar, Compass, ArrowRight, Search as SearchIcon, X, Heart } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { motion } from "framer-motion";
import { useGetPackages, useGetCities } from "@workspace/api-client-react";
import { formatRupiah } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MOCK_PACKAGES, MOCK_CITIES } from "@/lib/mockData";
import { SEO } from "@/components/ui/SEO";

export default function Packages() {
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(useSearch());
  const initialSearch = searchParams.get("search") || "";
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [cityId, setCityId] = useState<number | undefined>();
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  // Get packages based on filters
  const { data: fetchedPackages, isLoading } = useGetPackages({ 
    cityId, 
    minPrice: minPrice !== "" ? Number(minPrice) : undefined,
    maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
    // search: searchTerm || undefined // API might not support search yet, so we filter on frontend for now
  });
  
  // Get all cities in Sumatera Utara (assuming they are retrieved without province filter for now or we filter on frontend)
  const { data: fetchedCities } = useGetCities();

  const cities = fetchedCities && fetchedCities.length > 0 ? fetchedCities : MOCK_CITIES;
  
  // Custom filter for data
  const filterPackages = (pkgs: any[]) => {
    return pkgs.filter(pkg => {
      if (cityId && pkg.city?.id !== cityId) return false;
      if (minPrice !== "" && pkg.price < Number(minPrice)) return false;
      if (maxPrice !== "" && pkg.price > Number(maxPrice)) return false;
      if (searchTerm && !pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) && !pkg.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  };

  const displayPackages = filterPackages(fetchedPackages && fetchedPackages.length > 0 ? fetchedPackages : MOCK_PACKAGES);

  const { wishlist, add, remove, loading } = useWishlist();

  // Helper: apakah paket sudah di wishlist
  const isWishlisted = (packageId: number) => wishlist.some((w) => w.packageId === packageId);
  const getWishlistId = (packageId: number) => wishlist.find((w) => w.packageId === packageId)?.id;

  return (
    <PublicLayout>
      <SEO 
        title={t('packages.seo.title')}
        description={t('packages.seo.description')}
        keywords={t('packages.seo.keywords')}
      />
      <div className="bg-primary py-20 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">{t('packages.hero.title')}</h1>
          <p className="text-primary-foreground/80 text-xl max-w-3xl mx-auto font-light mb-10">
            {t('packages.hero.desc')}
          </p>
          
          <div className="max-w-xl mx-auto relative group">
            <input 
              type="text" 
              placeholder={t('packages.hero.searchPlaceholder')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20 focus:ring-4 focus:ring-white/10 transition-all font-medium pr-14"
            />
            {searchTerm ? (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            ) : null}
            <SearchIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 shrink-0 space-y-8">
          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border sticky top-28">
            <div className="flex items-center gap-3 font-bold text-xl mb-8 pb-6 border-b border-border/50 text-foreground">
              <Filter className="w-6 h-6 text-primary" /> {t('packages.filter.title')}
            </div>
            
            <div className="space-y-8">
              <div>
                <label className="text-sm font-bold text-foreground mb-4 block uppercase tracking-wider">{t('packages.filter.city')}</label>
                <div className="space-y-2">
                  <button 
                    onClick={() => setCityId(undefined)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors font-medium ${!cityId ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground'}`}
                  >
                    {t('packages.filter.allCities')}
                  </button>
                  {cities?.map(city => (
                    <button 
                      key={city.id}
                      onClick={() => setCityId(city.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors font-medium ${cityId === city.id ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground'}`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-foreground mb-4 block uppercase tracking-wider">{t('packages.filter.priceRange')}</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">{t('packages.filter.minPrice')}</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">{t('packages.filter.maxPrice')}</label>
                    <input 
                      type="number" 
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Package Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : displayPackages?.length === 0 ? (
            <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed border-border/60">
              <Compass className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-30" />
              <h3 className="text-2xl font-bold mb-3 text-foreground">{t('packages.empty.title')}</h3>
              <p className="text-muted-foreground text-lg">{t('packages.empty.desc')}</p>
              <button 
                onClick={() => { setCityId(undefined); setMinPrice(""); setMaxPrice(""); }}
                className="mt-8 bg-primary/10 text-primary px-6 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors"
              >
                {t('packages.empty.reset')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayPackages?.map((pkg, i) => (
                <motion.div 
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-soft group hover:shadow-soft-lg transition-all flex flex-col border border-transparent hover:border-border/50"
                >
                  <div className="relative h-64 overflow-hidden shrink-0">
                    <img 
                      src={pkg.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800"} 
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <button
                      className={`absolute top-4 left-4 bg-white/80 hover:bg-white text-secondary rounded-full p-2 shadow transition-colors ${isWishlisted(pkg.id) ? "ring-2 ring-secondary" : ""}`}
                      aria-label={isWishlisted(pkg.id) ? t('packages.wishlist.remove') : t('packages.wishlist.add')}
                      disabled={loading}
                      onClick={async (e) => {
                        e.preventDefault();
                        if (isWishlisted(pkg.id)) {
                          await remove(getWishlistId(pkg.id));
                        } else {
                          await add(pkg.id);
                        }
                      }}
                    >
                      <Heart className={`w-6 h-6 transition-all ${isWishlisted(pkg.id) ? "fill-secondary text-secondary" : "text-secondary"}`} />
                    </button>
                    <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm text-foreground">
                      <Star className="w-4 h-4 text-secondary fill-secondary" />
                      {pkg.rating || 'Baru'}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5 text-sm text-secondary font-bold uppercase tracking-wider">
                        <MapPin className="w-4 h-4" /> {pkg.city?.name || 'Destinasi'}
                      </div>
                      <div className="bg-muted px-3 py-1 rounded-lg text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {pkg.duration} Hari
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors">{pkg.title}</h3>
                    <p className="text-muted-foreground line-clamp-2 mb-8 text-base flex-1">{pkg.description}</p>
                    
                    <div className="flex items-end justify-between mt-auto pt-6 border-t border-border/50">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Harga per pax</p>
                        <p className="text-2xl font-extrabold text-primary">{formatRupiah(pkg.price)}</p>
                      </div>
                      <Link href={`/paket-wisata/${pkg.slug || pkg.id}`} className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:gap-3">
                        Detail <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
