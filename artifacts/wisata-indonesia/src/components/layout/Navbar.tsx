import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { Menu, X, Compass, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Beranda", href: "/" },
  { name: "Paket Wisata", href: "/paket-wisata" },
  { name: "Rental Mobil", href: "/rental-mobil" },
  { name: "Galeri", href: "/galeri" },
  { name: "Blog", href: "/blog" },
  { name: "Custom Trip", href: "/custom-trip" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "glass py-3" : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <span className={cn("font-display font-bold text-2xl tracking-tight transition-colors", isScrolled ? "text-foreground" : "text-white lg:text-foreground")}>
              Wisata<span className="text-primary">Indo</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} isScrolled={isScrolled}>
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link 
              href="/admin" 
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all hover:shadow-lg",
                isScrolled 
                  ? "bg-primary text-white hover:bg-primary/90 hover:shadow-primary/25" 
                  : "bg-white text-primary hover:bg-white/90"
              )}
            >
              <UserCircle className="w-5 h-5" />
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn("lg:hidden p-2 rounded-md", isScrolled ? "text-foreground" : "text-white")}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-border lg:hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-primary/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              <Link
                href="/admin"
                className="flex items-center gap-2 text-lg font-medium text-primary px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserCircle className="w-5 h-5" />
                Admin Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, children, isScrolled }: { href: string; children: React.ReactNode; isScrolled: boolean }) {
  const [isActive] = useRoute(href);
  
  return (
    <Link
      href={href}
      className={cn(
        "relative font-medium transition-colors text-sm uppercase tracking-wider",
        isActive 
          ? (isScrolled ? "text-primary" : "text-white lg:text-primary") 
          : (isScrolled ? "text-foreground/70 hover:text-primary" : "text-white/80 hover:text-white lg:text-foreground/70 lg:hover:text-primary")
      )}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full"
        />
      )}
    </Link>
  );
}
