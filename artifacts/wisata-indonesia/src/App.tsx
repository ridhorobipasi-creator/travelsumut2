import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Public Pages
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import CustomTrip from "./pages/CustomTrip";
import NotFound from "./pages/not-found";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPackages from "./pages/admin/Packages";
import AdminOrders from "./pages/admin/Orders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  }
});

// Mock minimal pages for completeness
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">Halaman sedang dalam pengembangan.</p>
        <button onClick={() => window.history.back()} className="mt-6 text-primary font-medium hover:underline">Kembali</button>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/paket-wisata" component={Packages} />
      <Route path="/custom-trip" component={CustomTrip} />
      <Route path="/rental-mobil"><PlaceholderPage title="Rental Mobil" /></Route>
      <Route path="/galeri"><PlaceholderPage title="Galeri" /></Route>
      <Route path="/blog"><PlaceholderPage title="Blog" /></Route>
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/packages" component={AdminPackages} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/regions"><PlaceholderPage title="Kelola Wilayah" /></Route>
      <Route path="/admin/custom-trips"><PlaceholderPage title="Kelola Custom Trips" /></Route>
      <Route path="/admin/vehicles"><PlaceholderPage title="Kelola Kendaraan" /></Route>
      <Route path="/admin/gallery"><PlaceholderPage title="Kelola Galeri" /></Route>
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
