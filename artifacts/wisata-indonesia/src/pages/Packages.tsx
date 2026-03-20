import { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { MapPin, Star, Filter, Calendar, Compass, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useGetPackages, useGetCities } from "@workspace/api-client-react";
import { formatRupiah } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Packages() {
  const [cityId, setCityId] = useState<number | undefined>();
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  // Get packages based on filters
  const { data: packages, isLoading } = useGetPackages({ 
    cityId, 
    minPrice: minPrice !== "" ? Number(minPrice) : undefined,
    maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined
  });
  
  // Get all cities in Sumatera Utara (assuming they are retrieved without province filter for now or we filter on frontend)
  const { data: cities } = useGetCities();

  return (
    <PublicLayout>
      <div className="bg-primary py-20 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Paket Wisata Sumatera Utara</h1>
          <p className="text-primary-foreground/80 text-xl max-w-3xl mx-auto font-light">
            Eksplorasi keindahan Danau Toba, dataran tinggi Berastagi, hingga pesona Nias dalam satu perjalanan tak terlupakan.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 shrink-0 space-y-8">
          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border sticky top-28">
            <div className="flex items-center gap-3 font-bold text-xl mb-8 pb-6 border-b border-border/50 text-foreground">
              <Filter className="w-6 h-6 text-primary" /> Filter Pencarian
            </div>
            
            <div className="space-y-8">
              <div>
                <label className="text-sm font-bold text-foreground mb-4 block uppercase tracking-wider">Pilih Wilayah</label>
                <div className="space-y-2">
                  <button 
                    onClick={() => setCityId(undefined)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors font-medium ${!cityId ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground'}`}
                  >
                    Semua Wilayah Sumut
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
                <label className="text-sm font-bold text-foreground mb-4 block uppercase tracking-wider">Rentang Harga</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Minimum (Rp)</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Maksimum (Rp)</label>
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
          ) : packages?.length === 0 ? (
            <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed border-border/60">
              <Compass className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-30" />
              <h3 className="text-2xl font-bold mb-3 text-foreground">Tidak ada paket ditemukan</h3>
              <p className="text-muted-foreground text-lg">Coba ubah kriteria filter Anda untuk melihat paket lainnya.</p>
              <button 
                onClick={() => { setCityId(undefined); setMinPrice(""); setMaxPrice(""); }}
                className="mt-8 bg-primary/10 text-primary px-6 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {packages?.map((pkg, i) => (
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
