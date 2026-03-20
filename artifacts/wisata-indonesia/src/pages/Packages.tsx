import { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { MapPin, Star, Filter, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useGetPackages, useGetProvinces } from "@workspace/api-client-react";
import { formatRupiah } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Packages() {
  const [provinceId, setProvinceId] = useState<number | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();

  const { data: packages, isLoading } = useGetPackages({ provinceId, minPrice });
  const { data: provinces } = useGetProvinces();

  return (
    <PublicLayout>
      <div className="bg-primary/5 py-12 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold mb-4">Temukan Paket Wisata</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Berbagai pilihan paket liburan menarik ke seluruh penjuru Nusantara yang disesuaikan dengan kebutuhan Anda.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0 space-y-8">
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <div className="flex items-center gap-2 font-bold text-lg mb-6 pb-4 border-b border-border">
              <Filter className="w-5 h-5 text-primary" /> Filter Pencarian
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-muted-foreground mb-3 block">Pilih Provinsi</label>
                <div className="space-y-2">
                  <button 
                    onClick={() => setProvinceId(undefined)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!provinceId ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted text-foreground'}`}
                  >
                    Semua Provinsi
                  </button>
                  {provinces?.map(prov => (
                    <button 
                      key={prov.id}
                      onClick={() => setProvinceId(prov.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${provinceId === prov.id ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted text-foreground'}`}
                    >
                      {prov.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-muted-foreground mb-3 block">Harga Minimum</label>
                <input 
                  type="range" 
                  min="0" 
                  max="10000000" 
                  step="500000"
                  className="w-full accent-primary"
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                />
                <div className="text-sm font-medium mt-2 text-primary">
                  {minPrice ? `> ${formatRupiah(minPrice)}` : 'Semua Harga'}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Package Grid */}
        <div className="flex-1">
          {isLoading ? (
            <LoadingSpinner />
          ) : packages?.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
              <Compass className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Tidak ada paket ditemukan</h3>
              <p className="text-muted-foreground">Coba ubah kriteria filter Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {packages?.map((pkg, i) => (
                <motion.div 
                  key={pkg.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-md border border-border group hover:shadow-xl transition-all flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden shrink-0">
                    <img 
                      src={pkg.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800"} 
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
                      {pkg.rating || 'Baru'}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {pkg.duration} Hari
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-primary mb-2 font-semibold">
                      <MapPin className="w-3.5 h-3.5" /> {pkg.city?.name || 'Destinasi'}, {pkg.province?.name}
                    </div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">{pkg.title}</h3>
                    <p className="text-muted-foreground line-clamp-2 mb-4 text-sm flex-1">{pkg.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                      <div>
                        <p className="text-lg font-extrabold text-foreground">{formatRupiah(pkg.price)}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Per Pax</p>
                      </div>
                      <Link href={`/paket-wisata/${pkg.slug || pkg.id}`} className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                        Lihat Detail
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
