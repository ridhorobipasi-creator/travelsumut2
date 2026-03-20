import { PublicLayout } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { Search, MapPin, Calendar, Users, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useGetPackages, useGetBanners, useGetTestimonials } from "@workspace/api-client-react";
import { formatRupiah } from "@/lib/utils";

export default function Home() {
  const { data: featuredPackages } = useGetPackages({ featured: true });
  const { data: testimonials } = useGetTestimonials({ approved: true });

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 -mt-20 overflow-hidden">
        {/* landing page hero scenic mountain landscape */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80&w=2000" 
            alt="Bali Landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 backdrop-blur-md border border-primary/50 text-primary-foreground font-medium text-sm mb-6">
              Jelajahi Keajaiban Nusantara
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Temukan <span className="text-secondary">Surga Tersembunyi</span> di Indonesia
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
              Dari puncak gunung berapi hingga kedalaman terumbu karang. Kami menyediakan pengalaman perjalanan terbaik untuk mengeksplorasi keindahan alam dan budaya Indonesia.
            </p>

            {/* Floating Search Bar */}
            <div className="glass p-4 rounded-2xl flex flex-col md:flex-row gap-4 shadow-2xl">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl">
                <MapPin className="text-secondary w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Mau kemana?" 
                  className="bg-transparent border-none outline-none text-white placeholder:text-white/60 w-full"
                />
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl">
                <Calendar className="text-secondary w-5 h-5" />
                <input 
                  type="date" 
                  className="bg-transparent border-none outline-none text-white placeholder:text-white/60 w-full [color-scheme:dark]"
                />
              </div>
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Cari
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Destinasi Pilihan</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">Paket wisata terpopuler yang wajib Anda kunjungi tahun ini.</p>
            </div>
            <Link href="/paket-wisata" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
              Lihat Semua <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages?.slice(0, 3).map((pkg, i) => (
              <motion.div 
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border group hover:shadow-xl transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={pkg.imageUrl || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800"} 
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    {pkg.rating || 4.8}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 font-medium">
                    <MapPin className="w-4 h-4 text-primary" /> {pkg.city?.name || 'Bali'}, {pkg.province?.name}
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{pkg.title}</h3>
                  <p className="text-muted-foreground line-clamp-2 mb-4 text-sm">{pkg.description}</p>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Mulai dari</p>
                      <p className="text-lg font-bold text-primary">{formatRupiah(pkg.price)}</p>
                    </div>
                    <Link href={`/paket-wisata/${pkg.slug}`} className="bg-secondary/10 text-secondary hover:bg-secondary hover:text-white px-4 py-2 rounded-lg font-bold transition-colors">
                      Detail
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={`${import.meta.env.BASE_URL}images/hero-pattern.png`} alt="Pattern" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Mengapa Memilih Wisata Indonesia?</h2>
              <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
                Kami berkomitmen memberikan pengalaman perjalanan yang aman, nyaman, dan tak terlupakan. 
                Dengan pemandu lokal berpengalaman dan fasilitas premium.
              </p>
              <div className="space-y-4">
                {[
                  "Pemandu wisata lokal tersertifikasi",
                  "Harga transparan tanpa biaya tersembunyi",
                  "Fasilitas transportasi eksklusif",
                  "Dukungan pelanggan 24/7"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-secondary" />
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative z-10 border-4 border-white/20">
                {/* balinese dancer cultural performance */}
                <img 
                  src="https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=800" 
                  alt="Culture" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-secondary rounded-full blur-3xl opacity-50 z-0"></div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
