import { Link } from "wouter";
import { Compass, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <Compass className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-2xl tracking-tight text-white leading-none">
                  Wisata<span className="text-secondary">Sumut</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60">
                  Sumatera Utara
                </span>
              </div>
            </Link>
            <p className="text-white/70 leading-relaxed font-light">
              Platform pariwisata terpercaya untuk menjelajahi pesona alam dan keunikan budaya Sumatera Utara. Jadikan perjalanan Anda tak terlupakan bersama kami.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-xl mb-8">Tautan Cepat</h3>
            <ul className="space-y-4">
              <li><Link href="/paket-wisata" className="text-white/70 hover:text-secondary font-medium transition-colors">Paket Wisata</Link></li>
              <li><Link href="/rental-mobil" className="text-white/70 hover:text-secondary font-medium transition-colors">Rental Mobil</Link></li>
              <li><Link href="/galeri" className="text-white/70 hover:text-secondary font-medium transition-colors">Galeri Destinasi</Link></li>
              <li><Link href="/blog" className="text-white/70 hover:text-secondary font-medium transition-colors">Blog & Artikel</Link></li>
              <li><Link href="/custom-trip" className="text-white/70 hover:text-secondary font-medium transition-colors">Custom Trip</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-xl mb-8">Destinasi Populer</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/70 hover:text-secondary font-medium transition-colors">Danau Toba</a></li>
              <li><a href="#" className="text-white/70 hover:text-secondary font-medium transition-colors">Berastagi</a></li>
              <li><a href="#" className="text-white/70 hover:text-secondary font-medium transition-colors">Bukit Lawang</a></li>
              <li><a href="#" className="text-white/70 hover:text-secondary font-medium transition-colors">Pulau Nias</a></li>
              <li><a href="#" className="text-white/70 hover:text-secondary font-medium transition-colors">Samosir</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-xl mb-8">Hubungi Kami</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-white/70">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <span className="pt-2">Jl. Kesawan No. 88, Medan Barat, Medan, Sumatera Utara 20111</span>
              </li>
              <li className="flex items-center gap-4 text-white/70">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-secondary" />
                </div>
                <span>+62 811 6000 789</span>
              </li>
              <li className="flex items-center gap-4 text-white/70">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-secondary" />
                </div>
                <span>hello@wisatasumut.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/50 text-sm">&copy; {new Date().getFullYear()} Wisata Sumatera Utara. Hak Cipta Dilindungi.</p>
          <div className="flex gap-8 text-sm text-white/50">
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
