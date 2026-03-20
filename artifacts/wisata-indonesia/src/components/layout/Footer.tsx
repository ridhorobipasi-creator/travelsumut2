import { Link } from "wouter";
import { Compass, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Wisata<span className="text-primary">Indo</span>
              </span>
            </Link>
            <p className="text-white/60 leading-relaxed">
              Platform pariwisata terbaik untuk menjelajahi keindahan alam dan budaya Indonesia. Temukan pengalaman tak terlupakan bersama kami.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-xl mb-6">Tautan Cepat</h3>
            <ul className="space-y-4">
              <li><Link href="/paket-wisata" className="text-white/60 hover:text-primary transition-colors">Paket Wisata</Link></li>
              <li><Link href="/rental-mobil" className="text-white/60 hover:text-primary transition-colors">Rental Mobil</Link></li>
              <li><Link href="/galeri" className="text-white/60 hover:text-primary transition-colors">Galeri Destinasi</Link></li>
              <li><Link href="/blog" className="text-white/60 hover:text-primary transition-colors">Blog & Artikel</Link></li>
              <li><Link href="/custom-trip" className="text-white/60 hover:text-primary transition-colors">Custom Trip</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-xl mb-6">Destinasi Populer</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Bali & Nusa Tenggara</a></li>
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Raja Ampat</a></li>
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Labuan Bajo</a></li>
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Danau Toba</a></li>
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Yogyakarta & Bromo</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-xl mb-6">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Jl. Pariwisata No. 123, Jakarta Selatan, Indonesia 12345</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>hello@wisataindo.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center text-white/40 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Wisata Indonesia. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
