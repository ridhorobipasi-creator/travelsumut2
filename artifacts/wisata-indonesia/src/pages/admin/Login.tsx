import { useState } from "react";
import { useLocation } from "wouter";
import { Compass, Lock, User, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple auth logic based on user request
    setTimeout(() => {
      if (username === "admin" && password === "Bismillah00") {
        sessionStorage.setItem("isAdminAuthenticated", "true");
        toast({ title: "Login Berhasil", description: "Selamat datang kembali, Admin!" });
        setLocation("/admin");
      } else {
        toast({ 
          title: "Login Gagal", 
          description: "Username atau Password salah.", 
          variant: "destructive" 
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 mx-auto mb-6">
            <Compass className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground mt-2">Silakan masuk untuk mengelola konten WisataSumut.</p>
        </div>

        <div className="bg-card p-8 rounded-3xl shadow-xl shadow-black/5 border border-border">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Username
              </label>
              <input 
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username admin"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" /> Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-all pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? "Menverifikasi..." : "Masuk Sekarang"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border/50 text-center">
            <button 
              onClick={() => setLocation("/")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium underline underline-offset-4"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-muted-foreground">
          &copy; 2026 WisataSumut - Internal Admin Management System
        </p>
      </div>
    </div>
  );
}
