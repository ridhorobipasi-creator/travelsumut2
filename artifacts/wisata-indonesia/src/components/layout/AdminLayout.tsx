import { useState } from "react";
import { Link, useRoute } from "wouter";
import { 
  LayoutDashboard, ShoppingCart, Compass, Map, 
  CarFront, Image as ImageIcon, FileText, LayoutTemplate, 
  MessageSquare, Menu, LogOut, X, PenTool
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_LINKS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pesanan", href: "/admin/orders", icon: ShoppingCart },
  { name: "Custom Trip", href: "/admin/custom-trips", icon: PenTool },
  { name: "Paket Wisata", href: "/admin/packages", icon: Compass },
  { name: "Wilayah", href: "/admin/regions", icon: Map },
  { name: "Kendaraan", href: "/admin/vehicles", icon: CarFront },
  { name: "Galeri", href: "/admin/gallery", icon: ImageIcon },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Banners", href: "/admin/banners", icon: LayoutTemplate },
  { name: "Testimoni", href: "/admin/testimonials", icon: MessageSquare },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center px-6 border-b border-sidebar-border justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Wisata<span className="text-primary">Admin</span>
            </span>
          </Link>
          <button className="lg:hidden text-sidebar-foreground/70 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {ADMIN_LINKS.map((link) => {
            const [isActive] = useRoute(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent transition-colors">
            <LogOut className="w-5 h-5" />
            Kembali ke Web
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-border flex items-center px-6 sticky top-0 z-30">
          <button 
            className="lg:hidden mr-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              AD
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
