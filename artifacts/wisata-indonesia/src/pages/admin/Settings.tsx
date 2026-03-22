import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState } from "react";
import { Settings as SettingsIcon, Save, Globe, Smartphone, Mail, Phone, MapPin, Database, HardDrive, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    siteName: "WisataSumut",
    siteDescription: "Platform pemesanan paket wisata terbaik di Sumatera Utara",
    contactEmail: "info@wisatasumut.com",
    contactPhone: "081234567890",
    address: "Jl. Jend. Sudirman No. 123, Medan, Sumatera Utara",
    facebook: "https://facebook.com/wisatasumut",
    instagram: "https://instagram.com/wisatasumut",
    maintenanceMode: false,
    enableReviews: true,
    autoApproveReviews: false,
    currencyCode: "IDR",
    timezone: "Asia/Jakarta",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = () => {
    toast({
      title: "Pengaturan Disimpan",
      description: "Perubahan pengaturan sistem berhasil disimpan.",
    });
  };

  const tabs = [
    { id: "general", label: "Umum", icon: Globe },
    { id: "contact", label: "Kontak & Sosial", icon: Phone },
    { id: "system", label: "Sistem", icon: HardDrive },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" /> Sistem & Pengaturan
          </h1>
          <p className="text-muted-foreground mt-1">Konfigurasi utama aplikasi dan informasi website.</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Save className="w-5 h-5" /> Simpan Pengaturan
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-left transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-soft"
                  : "bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
          <div className="p-6 md:p-8">
            
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Informasi Website</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">Nama Website</label>
                      <input
                        type="text"
                        name="siteName"
                        value={formData.siteName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">Deskripsi Singkat</label>
                      <textarea
                        name="siteDescription"
                        rows={3}
                        value={formData.siteDescription}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-xl font-bold mb-4">Lokalisasi</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">Mata Uang Default</label>
                      <select
                        name="currencyCode"
                        value={formData.currencyCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                      >
                        <option value="IDR">IDR - Indonesian Rupiah</option>
                        <option value="USD">USD - US Dollar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">Zona Waktu</label>
                      <select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                      >
                        <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                        <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                        <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Informasi Kontak</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground"/> Email Utama</label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground"/> Nomor Telepon / WA</label>
                      <input
                        type="text"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground"/> Alamat Lengkap</label>
                      <textarea
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-xl font-bold mb-4">Media Sosial</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">URL Facebook Page</label>
                      <input
                        type="url"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">URL Instagram</label>
                      <input
                        type="url"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Kinerja & Status</h3>
                  <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border border-border">
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="mt-0.5">
                        <input
                          type="checkbox"
                          name="maintenanceMode"
                          checked={formData.maintenanceMode}
                          onChange={handleChange}
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">Mode Maintenance (Perbaikan)</div>
                        <p className="text-sm text-muted-foreground">Aktifkan mode ini untuk menutup sementara akses publik ke website saat ada pembaruan sistem besar.</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-xl font-bold mb-4">Pengaturan Ulasan</h3>
                  <div className="space-y-4">
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          name="enableReviews"
                          checked={formData.enableReviews}
                          onChange={handleChange}
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="font-bold group-hover:text-primary transition-colors">Izinkan Pelanggan Memberikan Ulasan</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group ml-8">
                        <input
                          type="checkbox"
                          name="autoApproveReviews"
                          checked={formData.autoApproveReviews}
                          onChange={handleChange}
                          disabled={!formData.enableReviews}
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary disabled:opacity-50"
                        />
                        <span className="font-bold text-sm group-hover:text-primary transition-colors">Semua Ulasan Langsung Disetujui (Tanpa Moderasi)</span>
                      </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                   <h3 className="text-xl font-bold mb-4">Aksi Berbahaya</h3>
                   <div className="flex gap-4">
                     <button className="px-5 py-2.5 rounded-xl bg-amber-100 text-amber-700 font-bold text-sm hover:bg-amber-200 transition-colors flex items-center gap-2">
                       <Database className="w-4 h-4"/> Kosongkan Cache
                     </button>
                     <button className="px-5 py-2.5 rounded-xl bg-rose-100 text-rose-700 font-bold text-sm hover:bg-rose-200 transition-colors flex items-center gap-2">
                       <KeyRound className="w-4 h-4"/> Reset API Keys
                     </button>
                   </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
