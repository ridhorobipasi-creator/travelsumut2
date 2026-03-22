import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState } from "react";
import { Settings as SettingsIcon, Save, Globe, Phone, HardDrive, Database, KeyRound, MapPin, Mail, Image, Link2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useImageSettings } from "@/hooks/use-image-settings";

const IMAGE_FIELDS = [
  {
    section: "Halaman Utama (Home)",
    fields: [
      { key: "heroImage", label: "Gambar Hero / Banner Utama", desc: "Gambar latar besar di halaman depan. Disarankan ukuran 1920×1080px.", placeholder: "https://images.unsplash.com/photo-1599408913599-71e0ea9283fa?w=2000" },
      { key: "heroBannerAlt", label: "Teks Alt Hero Banner", desc: "Deskripsi singkat gambar untuk aksesibilitas dan SEO.", placeholder: "Pemandangan indah Danau Toba Sumatera Utara" },
    ]
  },
  {
    section: "Identitas Brand",
    fields: [
      { key: "logoUrl", label: "URL Logo Website", desc: "Logo utama yang muncul di navbar dan footer. Format PNG/SVG transparan.", placeholder: "https://..." },
      { key: "faviconUrl", label: "URL Favicon", desc: "Ikon kecil di tab browser. Ukuran 32×32px atau 64×64px.", placeholder: "https://..." },
      { key: "ogImageUrl", label: "Gambar OG (Share Sosial Media)", desc: "Gambar yang muncul saat link dibagikan di WhatsApp/Facebook. 1200×630px.", placeholder: "https://..." },
    ]
  },
  {
    section: "Gambar Destinasi Unggulan",
    fields: [
      { key: "region1Image", label: "Gambar Destinasi 1 – Danau Toba", desc: "Foto Danau Toba untuk kartu destinasi utama.", placeholder: "https://images.unsplash.com/photo-1599408913599-71e0ea9283fa?w=600" },
      { key: "region2Image", label: "Gambar Destinasi 2 – Berastagi", desc: "Foto Berastagi / Gunung Sinabung.", placeholder: "https://images.unsplash.com/photo-1601152264065-0cbf24fc4820?w=600" },
      { key: "region3Image", label: "Gambar Destinasi 3 – Nias", desc: "Foto Pantai atau Budaya Nias.", placeholder: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600" },
      { key: "region4Image", label: "Gambar Destinasi 4 – Bukit Lawang", desc: "Foto Bukit Lawang / Hutan Bahorok.", placeholder: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=600" },
      { key: "region5Image", label: "Gambar Destinasi 5 – Samosir", desc: "Foto Pulau Samosir.", placeholder: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600" },
      { key: "region6Image", label: "Gambar Destinasi 6 – Medan", desc: "Foto Kota Medan.", placeholder: "https://images.unsplash.com/photo-1591301490041-d527bc63b07c?w=600" },
    ]
  },
  {
    section: "Halaman About / CTA",
    fields: [
      { key: "aboutImage", label: "Gambar Halaman Tentang Kami", desc: "Foto tim atau destinasi untuk halaman About/Tentang Kami.", placeholder: "https://..." },
      { key: "ctaBgImage", label: "Latar Belakang CTA Section", desc: "Gambar latar belakang tombol pesan sekarang / call-to-action.", placeholder: "https://..." },
    ]
  },
];

const initialImages: Record<string, string> = {
  heroImage: "https://images.unsplash.com/photo-1599408913599-71e0ea9283fa?auto=format&fit=crop&q=80&w=2000",
  heroBannerAlt: "Pemandangan indah Danau Toba Sumatera Utara",
  logoUrl: "",
  faviconUrl: "",
  ogImageUrl: "",
  region1Image: "https://images.unsplash.com/photo-1599408913599-71e0ea9283fa?w=600",
  region2Image: "https://images.unsplash.com/photo-1601152264065-0cbf24fc4820?w=600",
  region3Image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
  region4Image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=600",
  region5Image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600",
  region6Image: "https://images.unsplash.com/photo-1591301490041-d527bc63b07c?w=600",
  aboutImage: "",
  ctaBgImage: "",
};

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const { settings: imageData, updateSettings } = useImageSettings();
  const [previewKey, setPreviewKey] = useState<string | null>(null);

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

  const handleImageChange = (key: string, value: string) => {
    updateSettings({ ...imageData, [key]: value });
  };

  const handleSave = () => {
    updateSettings(imageData);
    toast({
      title: "Pengaturan Disimpan",
      description: "Semua perubahan pengaturan berhasil disimpan.",
    });
  };

  const tabs = [
    { id: "general", label: "Umum", icon: Globe },
    { id: "images", label: "Aset Gambar", icon: Image },
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
          <p className="text-muted-foreground mt-1">Konfigurasi utama aplikasi, gambar, dan informasi website.</p>
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

            {/* === TAB: UMUM === */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Informasi Website</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">Nama Website</label>
                      <input type="text" name="siteName" value={formData.siteName} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">Deskripsi Singkat</label>
                      <textarea name="siteDescription" rows={3} value={formData.siteDescription} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm resize-none" />
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-border">
                  <h3 className="text-xl font-bold mb-4">Lokalisasi</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">Mata Uang Default</label>
                      <select name="currencyCode" value={formData.currencyCode} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm">
                        <option value="IDR">IDR - Indonesian Rupiah</option>
                        <option value="USD">USD - US Dollar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">Zona Waktu</label>
                      <select name="timezone" value={formData.timezone} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm">
                        <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                        <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                        <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* === TAB: ASET GAMBAR === */}
            {activeTab === "images" && (
              <div className="space-y-8">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-sm text-blue-800">
                  <Link2 className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
                  <div>
                    <p className="font-bold mb-1">Cara menggunakan URL Gambar</p>
                    <p>Masukkan URL gambar dari hosting gambar seperti <strong>Unsplash</strong>, <strong>Cloudinary</strong>, <strong>Google Drive (link publik)</strong>, atau <strong>ImgBB</strong>. Pastikan gambar bisa diakses secara publik tanpa login.</p>
                  </div>
                </div>

                {IMAGE_FIELDS.map((section) => (
                  <div key={section.section}>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Image className="w-5 h-5 text-primary" />
                      {section.section}
                    </h3>
                    <div className="space-y-5">
                      {section.fields.map((field) => (
                        <div key={field.key} className="bg-muted/20 rounded-2xl border border-border p-4">
                          <label className="block text-sm font-bold text-foreground mb-1">{field.label}</label>
                          <p className="text-xs text-muted-foreground mb-3">{field.desc}</p>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <input
                                type="text"
                                value={imageData[field.key] || ""}
                                onChange={(e) => handleImageChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary outline-none transition-all text-sm font-mono"
                              />
                            </div>
                            {imageData[field.key] && (
                              <button
                                type="button"
                                onClick={() => setPreviewKey(previewKey === field.key ? null : field.key)}
                                className="px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-bold whitespace-nowrap flex items-center gap-1.5"
                              >
                                <ExternalLink className="w-4 h-4" />
                                {previewKey === field.key ? "Tutup" : "Preview"}
                              </button>
                            )}
                          </div>
                          {previewKey === field.key && imageData[field.key] && !field.key.toLowerCase().includes("alt") && (
                            <div className="mt-3 rounded-xl overflow-hidden border border-border bg-muted/30">
                              <img
                                src={imageData[field.key]}
                                alt={field.label}
                                className="w-full max-h-48 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://placehold.co/800x400?text=URL+Tidak+Valid";
                                }}
                              />
                              <p className="text-xs text-muted-foreground px-3 py-2 font-mono truncate">{imageData[field.key]}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
                  >
                    <Save className="w-5 h-5" /> Simpan Semua Aset Gambar
                  </button>
                </div>
              </div>
            )}

            {/* === TAB: KONTAK === */}
            {activeTab === "contact" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Informasi Kontak</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground"/> Email Utama</label>
                      <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground"/> Nomor Telepon / WA</label>
                      <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground"/> Alamat Lengkap</label>
                      <textarea name="address" rows={3} value={formData.address} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm resize-none" />
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-border">
                  <h3 className="text-xl font-bold mb-4">Media Sosial</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">URL Facebook Page</label>
                      <input type="url" name="facebook" value={formData.facebook} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">URL Instagram</label>
                      <input type="url" name="instagram" value={formData.instagram} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* === TAB: SISTEM === */}
            {activeTab === "system" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Kinerja & Status</h3>
                  <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border border-border">
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="mt-0.5">
                        <input type="checkbox" name="maintenanceMode" checked={formData.maintenanceMode} onChange={handleChange}
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
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
                      <input type="checkbox" name="enableReviews" checked={formData.enableReviews} onChange={handleChange}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
                      <span className="font-bold group-hover:text-primary transition-colors">Izinkan Pelanggan Memberikan Ulasan</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group ml-8">
                      <input type="checkbox" name="autoApproveReviews" checked={formData.autoApproveReviews} onChange={handleChange}
                        disabled={!formData.enableReviews}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary disabled:opacity-50" />
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
