import { PublicLayout } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { Search, MapPin, Calendar, Star, ArrowRight, Compass, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useGetPackages, useGetTestimonials } from "@workspace/api-client-react";
import { formatRupiah } from "@/lib/utils";

const REGIONS = [
  { name: "Danau Toba", image: "https://images.unsplash.com/photo-1599408913599-71e0ea9283fa?w=600" },
  { name: "Berastagi", image: "https://images.unsplash.com/photo-1601152264065-0cbf24fc4820?w=600" },
  { name: "Nias", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600" },
  { name: "Bukit Lawang", image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=600" },
  { name: "Samosir", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600" },
  { name: "Medan", image: "https://images.unsplash.com/photo-1591301490041-d527bc63b07c?w=600" }
];

export default function Home() {
  const { data: featuredPackages } = useGetPackages({ featured: true });
  const { data: testimonials } = useGetTestimonials({ approved: true });

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 -mt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1599408913599-71e0ea9283fa?auto=format&fit=crop&q=80&w=2000" 
            alt="Danau Toba" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-block py-1 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-sm mb-6 tracking-wide uppercase">
              Surga Tersembunyi Sumatera Utara
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold leading-tight mb-6">
              Jelajahi <span className="text-secondary">Sumatera Utara</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/90 mb-12 max-w-2xl leading-relaxed font-light">
              Dari keagungan Danau Toba hingga rimba Bukit Lawang. Temukan keajaiban alam dan kekayaan budaya di ujung utara Sumatera.
            </p>

            {/* Clean Search Bar */}
            <div className="bg-white p-3 rounded-2xl md:rounded-full flex flex-col md:flex-row gap-2 shadow-soft-lg max-w-3xl">
              <div className="flex-1 flex items-center gap-3 px-6 py-3 md:py-0 border-b md:border-b-0 md:border-r border-border">
                <MapPin className="text-primary w-5 h-5 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Mau kemana di Sumut?" 
                  className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-full font-medium"
                />
              </div>
              <div className="flex-1 flex items-center gap-3 px-6 py-3 md:py-0">
                <Calendar className="text-primary w-5 h-5 shrink-0" />
                <input 
                  type="date" 
                  className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-full font-medium"
                />
              </div>
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 md:py-3 rounded-xl md:rounded-full font-bold transition-colors flex items-center justify-center gap-2 shrink-0">
                <Search className="w-5 h-5" />
                Cari Destinasi
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Region Category Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-primary">Jelajahi Per Wilayah</h2>
            <p className="text-muted-foreground text-lg">Setiap sudut Sumatera Utara menawarkan pesona dan petualangan yang berbeda. Pilih destinasi impian Anda.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REGIONS.map((region, i) => (
              <Link key={region.name} href={`/paket-wisata`}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <img 
                    src={region.image} 
                    alt={region.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-3xl font-display font-bold text-white mb-2">{region.name}</h3>
                    <div className="flex items-center gap-2 text-white/80 font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <span>Lihat Paket</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-primary">Paket Pilihan</h2>
              <p className="text-muted-foreground text-lg">Pengalaman terbaik yang kami kurasi khusus untuk petualangan Anda di Sumatera Utara.</p>
            </div>
            <Link href="/paket-wisata" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all uppercase tracking-wide text-sm">
              Semua Paket <ArrowRight className="w-5 h-5" />
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
                className="bg-card rounded-2xl overflow-hidden shadow-soft group hover:shadow-soft-lg transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={pkg.imageUrl || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800"} 
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm text-foreground">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    {pkg.rating || 4.8}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-sm text-secondary font-bold uppercase tracking-wider mb-3">
                    <MapPin className="w-4 h-4" /> {pkg.city?.name || 'Destinasi'}, Sumut
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">{pkg.title}</h3>
                  <p className="text-muted-foreground line-clamp-2 mb-6 text-base">{pkg.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Mulai dari</p>
                      <p className="text-xl font-bold text-primary">{formatRupiah(pkg.price)}</p>
                    </div>
                    <Link href={`/paket-wisata/${pkg.slug}`} className="bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-xl font-medium transition-colors">
                      Detail
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-primary-foreground/10">
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-display font-bold mb-2">156+</div>
              <div className="text-primary-foreground/80 font-medium">Wisatawan</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-display font-bold mb-2">6</div>
              <div className="text-primary-foreground/80 font-medium">Destinasi Utama</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-display font-bold mb-2">4.8</div>
              <div className="text-primary-foreground/80 font-medium">Rating Rata-rata</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-display font-bold mb-2">24/7</div>
              <div className="text-primary-foreground/80 font-medium">Dukungan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-primary">Kata Mereka</h2>
            <p className="text-muted-foreground text-lg">Pengalaman tak terlupakan dari para wisatawan yang telah menjelajahi Sumatera Utara bersama kami.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials?.slice(0, 3).map((testimonial, i) => (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 rounded-2xl shadow-soft border border-border/50"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-secondary fill-secondary" />
                  ))}
                </div>
                <p className="text-foreground text-lg leading-relaxed mb-8 font-medium">"{testimonial.comment}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl overflow-hidden">
                    {testimonial.customerAvatar
                      ? <img src={testimonial.customerAvatar} alt={testimonial.customerName} className="w-full h-full object-cover" />
                      : testimonial.customerName?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{testimonial.customerName}</h4>
                    <p className="text-sm text-muted-foreground">Wisatawan</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-primary">Rencanakan Perjalanan Anda</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Punya destinasi impian di Sumatera Utara yang belum ada di paket kami? Mari buat rencana perjalanan khusus untuk Anda.
          </p>
          <Link href="/custom-trip" className="inline-flex items-center justify-center bg-secondary text-white hover:bg-secondary/90 px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-soft-lg">
            Buat Custom Trip Sekarang
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
