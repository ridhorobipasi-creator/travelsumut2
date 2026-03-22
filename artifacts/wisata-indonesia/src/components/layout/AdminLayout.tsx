import { useState } from "react";
import { Link, useRoute } from "wouter";
import { 
  LayoutDashboard, ShoppingCart, Compass, Map, 
  CarFront, Image as ImageIcon, FileText, LayoutTemplate, 
  MessageSquare, Menu, LogOut, X, PenTool, Star, User
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_LINKS = [
  {
    section: "Utama",
    links: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    section: "Pesanan & Trip",
    links: [
      { name: "Semua Pesanan", href: "/admin/all-orders", icon: ShoppingCart },
      { name: "Laporan Pesanan", href: "/admin/order-report", icon: FileText },
      { name: "Pesanan & Jadwal", href: "/admin/order-schedule", icon: FileText },
      { name: "Custom Trip Requests", href: "/admin/custom-trip-requests", icon: PenTool },
      { name: "Jadwal Trip", href: "/admin/trip-schedule", icon: FileText },
      { name: "Jadwal Rental", href: "/admin/rental-schedule", icon: FileText },
    ],
  },
  {
    section: "Produk & Layanan",
    links: [
      { name: "Paket Wisata", href: "/admin/packages", icon: Compass },
      { name: "Kategori", href: "/admin/category", icon: FileText },
      { name: "Partner", href: "/admin/partner", icon: FileText },
      { name: "Hotel", href: "/admin/hotel", icon: FileText },
      { name: "Kendaraan", href: "/admin/vehicles", icon: CarFront },
    ],
  },
  {
    section: "Konten & Media",
    links: [
      { name: "Galeri", href: "/admin/gallery", icon: ImageIcon },
      { name: "Blog", href: "/admin/blog", icon: FileText },
      { name: "Banners", href: "/admin/banners", icon: LayoutTemplate },
      { name: "Instagram Feeds", href: "/admin/instagram-feeds", icon: ImageIcon },
      { name: "Halaman Statis", href: "/admin/static-pages", icon: FileText },
    ],
  },
  {
    section: "Testimoni & Pesan",
    links: [
      { name: "Testimoni", href: "/admin/testimonials", icon: MessageSquare },
      { name: "Pesan Kontak", href: "/admin/contact-messages", icon: MessageSquare },
      { name: "Ulasan / Review", href: "/admin/user-review", icon: Star },
    ],
  },
  {
    section: "Pengguna & Admin",
    links: [
      { name: "Manajemen Pengguna", href: "/admin/admin-user", icon: User },
    ],
  },
  {
    section: "Pengaturan",
    links: [
      { name: "Sistem & Pengaturan", href: "/admin/settings", icon: Menu },
      { name: "Kelola Pengaturan", href: "/admin/manage-settings", icon: Menu },
      { name: "Bahasa & Kurs", href: "/admin/language-currency", icon: Menu },
      { name: "Pengaturan Umum", href: "/admin/setting/general", icon: Menu },
      { name: "Profil Bisnis", href: "/admin/setting/business-profile", icon: Menu },
      { name: "Data Trip", href: "/admin/setting/trip-data", icon: Menu },
      { name: "Log Aktivitas", href: "/admin/setting/log-activity", icon: Menu },
    ],
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminAuthenticated");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col border-r border-sidebar-border shadow-soft-lg lg:shadow-none",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-24 flex items-center px-8 border-b border-sidebar-border justify-between shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft">
              <Compass className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight leading-none text-white">
                Wisata<span className="text-secondary">Sumut</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 font-bold mt-1">
                Admin Panel
              </span>
            </div>
          </Link>
          <button className="lg:hidden text-sidebar-foreground/70 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-6">
          {ADMIN_LINKS.map((group) => (
            <div key={group.section}>
              <div className="text-xs font-bold uppercase text-sidebar-foreground/40 px-2 mb-2 tracking-widest">
                {group.section}
              </div>
              <div className="space-y-1">
                {group.links.map((link) => {
                  const [isActive] = useRoute(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all",
                        isActive 
                          ? "bg-primary text-white shadow-soft" 
                          : "text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent"
                      )}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-sidebar-border shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-xl font-bold text-sidebar-foreground hover:text-white bg-sidebar-accent hover:bg-destructive/90 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-card border-b border-border flex items-center px-8 sticky top-0 z-30 shadow-sm">
          <button 
            className="lg:hidden mr-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-display font-bold text-foreground">Sistem Manajemen Platform</h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
            >
              <LogOut className="w-4 h-4" /> Keluar
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground">Administrator</p>
                <p className="text-xs text-muted-foreground">Admin Sumut</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/20">
                AD
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
