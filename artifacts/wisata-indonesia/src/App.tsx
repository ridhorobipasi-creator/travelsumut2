import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";

// Public Pages
import React, { Suspense, useState } from "react";
const Home = React.lazy(() => import("./pages/Home"));
const Packages = React.lazy(() => import("./pages/Packages"));
const CustomTrip = React.lazy(() => import("./pages/CustomTrip"));
const PackageDetail = React.lazy(() => import("./pages/PackageDetail"));
const Vehicles = React.lazy(() => import("./pages/Vehicles"));
const Gallery = React.lazy(() => import("./pages/Gallery"));
const Blog = React.lazy(() => import("./pages/Blog"));
const NotFound = React.lazy(() => import("./pages/not-found"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));

// Admin Pages
const AdminLogin = React.lazy(() => import("./pages/admin/Login"));
const AdminDashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const AdminPackages = React.lazy(() => import("./pages/admin/Packages"));
const AdminOrders = React.lazy(() => import("./pages/admin/Orders"));
const AdminRegions = React.lazy(() => import("./pages/admin/Regions"));
const AdminCustomTrips = React.lazy(() => import("./pages/admin/CustomTrips"));
const AdminVehicles = React.lazy(() => import("./pages/admin/Vehicles"));
const AdminGallery = React.lazy(() => import("./pages/admin/Gallery"));
const AdminBlog = React.lazy(() => import("./pages/admin/Blog"));
const AdminBanners = React.lazy(() => import("./pages/admin/Banners"));
const AdminTestimonials = React.lazy(() => import("./pages/admin/Testimonials"));
const AdminOrderReport = React.lazy(() => import("./pages/admin/OrderReport"));
const AdminLanguageCurrency = React.lazy(() => import("./pages/admin/LanguageCurrency"));
const AdminOrderSchedule = React.lazy(() => import("./pages/admin/OrderSchedule"));
const AdminAllOrders = React.lazy(() => import("./pages/admin/AllOrders"));
const AdminCustomTripRequests = React.lazy(() => import("./pages/admin/CustomTripRequests"));
const AdminTripSchedule = React.lazy(() => import("./pages/admin/TripSchedule"));
const AdminRentalSchedule = React.lazy(() => import("./pages/admin/RentalSchedule"));
const AdminCategory = React.lazy(() => import("./pages/admin/Category"));
const AdminPartner = React.lazy(() => import("./pages/admin/Partner"));
const AdminHotel = React.lazy(() => import("./pages/admin/Hotel"));
const AdminContactMessages = React.lazy(() => import("./pages/admin/ContactMessages"));
const AdminUserReview = React.lazy(() => import("./pages/admin/UserReview"));
const AdminAdminUser = React.lazy(() => import("./pages/admin/AdminUser"));
const AdminInstagramFeeds = React.lazy(() => import("./pages/admin/InstagramFeeds"));
const AdminStaticPages = React.lazy(() => import("./pages/admin/StaticPages"));
const AdminSettings = React.lazy(() => import("./pages/admin/Settings"));
const AdminManageSettings = React.lazy(() => import("./pages/admin/ManageSettings"));
// Pengaturan (Settings) Subpages
const AdminSettingGeneral = React.lazy(() => import("./pages/admin/setting/General"));
const AdminSettingBusinessProfile = React.lazy(() => import("./pages/admin/setting/BusinessProfile"));
const AdminSettingTripData = React.lazy(() => import("./pages/admin/setting/TripData"));
const AdminSettingLogActivity = React.lazy(() => import("./pages/admin/setting/LogActivity"));
import { Redirect, useLocation } from "wouter";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { WishlistProvider } from "@/hooks/use-wishlist";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  }
});

function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, [key: string]: any }) {
  const isAuthenticated = sessionStorage.getItem("isAdminAuthenticated") === "true";
  
  return (
    <Route {...rest}>
      {isAuthenticated ? <Component /> : <Redirect to="/login" />}
    </Route>
  );
}

function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location}>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-lg">Memuat...</div>}>
          <Switch location={location}>
            {/* Public Routes */}
            <Route path="/" component={Home} />
            <Route path="/login" component={AdminLogin} />
            <Route path="/paket-wisata" component={Packages} />
            <Route path="/paket-wisata/:slug" component={PackageDetail} />
            <Route path="/wishlist" component={Wishlist} />
            <Route path="/custom-trip" component={CustomTrip} />
            <Route path="/rental-mobil" component={Vehicles} />
            <Route path="/galeri" component={Gallery} />
            <Route path="/blog" component={Blog} />
            {/* Admin Routes (Protected) */}
            <ProtectedRoute path="/admin" component={AdminDashboard} />
            <ProtectedRoute path="/admin/packages" component={AdminPackages} />
            <ProtectedRoute path="/admin/orders" component={AdminOrders} />
            <ProtectedRoute path="/admin/regions" component={AdminRegions} />
            <ProtectedRoute path="/admin/custom-trips" component={AdminCustomTrips} />
            <ProtectedRoute path="/admin/vehicles" component={AdminVehicles} />
            <ProtectedRoute path="/admin/gallery" component={AdminGallery} />
            <ProtectedRoute path="/admin/blog" component={AdminBlog} />
            <ProtectedRoute path="/admin/banners" component={AdminBanners} />
            <ProtectedRoute path="/admin/testimonials" component={AdminTestimonials} />
            <ProtectedRoute path="/admin/order-report" component={AdminOrderReport} />
            <ProtectedRoute path="/admin/language-currency" component={AdminLanguageCurrency} />
            <ProtectedRoute path="/admin/order-schedule" component={AdminOrderSchedule} />
            <ProtectedRoute path="/admin/all-orders" component={AdminAllOrders} />
            <ProtectedRoute path="/admin/custom-trip-requests" component={AdminCustomTripRequests} />
            <ProtectedRoute path="/admin/trip-schedule" component={AdminTripSchedule} />
            <ProtectedRoute path="/admin/rental-schedule" component={AdminRentalSchedule} />
            <ProtectedRoute path="/admin/category" component={AdminCategory} />
            <ProtectedRoute path="/admin/partner" component={AdminPartner} />
            <ProtectedRoute path="/admin/hotel" component={AdminHotel} />
            <ProtectedRoute path="/admin/contact-messages" component={AdminContactMessages} />
            <ProtectedRoute path="/admin/user-review" component={AdminUserReview} />
            <ProtectedRoute path="/admin/admin-user" component={AdminAdminUser} />
            <ProtectedRoute path="/admin/instagram-feeds" component={AdminInstagramFeeds} />
            <ProtectedRoute path="/admin/static-pages" component={AdminStaticPages} />
            <ProtectedRoute path="/admin/settings" component={AdminSettings} />
            <ProtectedRoute path="/admin/manage-settings" component={AdminManageSettings} />
            {/* Pengaturan (Settings) Subpages */}
            <ProtectedRoute path="/admin/setting/general" component={AdminSettingGeneral} />
            <ProtectedRoute path="/admin/setting/business-profile" component={AdminSettingBusinessProfile} />
            <ProtectedRoute path="/admin/setting/trip-data" component={AdminSettingTripData} />
            <ProtectedRoute path="/admin/setting/log-activity" component={AdminSettingLogActivity} />
            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
}

function App() {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WishlistProvider>
            <WouterRouter base={base}>
              <Router />
            </WouterRouter>
            <Toaster />
          </WishlistProvider>
        </TooltipProvider>

      <FloatingChatWidget />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

/** Widget chat: injeksi skrip pihak ketiga lewat VITE_CHAT_WIDGET_SCRIPT_URL (mis. snippet Tawk.to/Crisp), atau panel bantuan bawaan. */
function FloatingChatWidget() {
  const [open, setOpen] = React.useState(false);
  const scriptUrl = import.meta.env.VITE_CHAT_WIDGET_SCRIPT_URL as string | undefined;

  React.useEffect(() => {
    if (!scriptUrl?.trim()) return;
    const s = document.createElement("script");
    s.src = scriptUrl;
    s.async = true;
    document.body.appendChild(s);
    return () => {
      document.body.removeChild(s);
    };
  }, [scriptUrl]);

  if (scriptUrl?.trim()) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
      {open && (
        <div className="w-[min(100vw-2rem,20rem)] h-[22rem] rounded-2xl border border-border bg-card text-card-foreground shadow-lg p-4 flex flex-col">
          <p className="font-semibold text-foreground mb-2">Bantuan cepat</p>
          <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
            Untuk live chat (Tawk.to, Crisp, dll.), set variabel lingkungan{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">VITE_CHAT_WIDGET_SCRIPT_URL</code>{" "}
            ke URL skrip resmi penyedia, lalu build ulang.
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 self-end rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tutup
          </button>
        </div>
      )}
      <button
        type="button"
        aria-label="Buka panel bantuan"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground shadow-md hover:bg-primary/90"
      >
        💬
      </button>
    </div>
  );
}

export default App;
