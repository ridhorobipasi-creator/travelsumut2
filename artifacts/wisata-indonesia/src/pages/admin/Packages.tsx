import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useGetPackages,
  useGetCities,
  useCreatePackage,
  useUpdatePackage,
  useDeletePackage,
  getGetPackagesQueryKey,
  type CreatePackageInput,
  type TourPackage,
  type City,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatRupiah, slugify } from "@/lib/utils";
import { Plus, Edit, Trash2, Search, MapPin, Compass, Image as ImageIcon, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_PACKAGES, MOCK_CITIES } from "@/lib/mockData";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function buildPackagePayload(
  formData: {
    title: string;
    description: string;
    price: number;
    duration: number;
    cityId: number;
    imageUrl: string;
    featured: boolean;
    isActive: boolean;
  },
  existing: TourPackage | null,
  provinceId: number | null,
): CreatePackageInput {
  const baseSlug = (existing?.slug ?? slugify(formData.title)) || "paket-wisata";
  return {
    title: formData.title,
    slug: baseSlug,
    description: formData.description || null,
    price: formData.price,
    duration: formData.duration,
    maxParticipants: existing?.maxParticipants ?? null,
    imageUrl: formData.imageUrl || null,
    images: existing?.images ?? [],
    includes: existing?.includes ?? [],
    excludes: existing?.excludes ?? [],
    itinerary: existing?.itinerary ?? null,
    provinceId,
    cityId: formData.cityId,
    isFeatured: formData.featured,
    isActive: formData.isActive,
  };
}

export default function AdminPackages() {
  const queryClient = useQueryClient();
  const { data: fetchedPackages, isLoading, error } = useGetPackages();
  const { data: fetchedCities } = useGetCities();
  const [localPackages, setLocalPackages] = useState(MOCK_PACKAGES);
  const { toast } = useToast();

  const createMutation = useCreatePackage();
  const updateMutation = useUpdatePackage();
  const deleteMutation = useDeletePackage();
  const isMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  useEffect(() => {
    if (error) {
      toast({
        title: "Koneksi API Gagal",
        description: "Menampilkan paket simulasi karena server database belum terhubung.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TourPackage | (typeof MOCK_PACKAGES)[number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    duration: 1,
    cityId: 1,
    imageUrl: "",
    featured: false,
    isActive: true,
  });

  const packages =
    error || fetchedPackages === undefined ? localPackages : fetchedPackages;
  const filteredPackages = packages.filter(pkg => 
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (pkg.city?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const cities =
    error || !fetchedCities?.length ? MOCK_CITIES : fetchedCities;

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus paket ini?")) return;

    if (error) {
      setLocalPackages(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Berhasil dihapus",
        description: "Paket dihapus dari data lokal (mode simulasi).",
      });
      return;
    }

    try {
      await deleteMutation.mutateAsync({ id });
      await queryClient.invalidateQueries({ queryKey: getGetPackagesQueryKey() });
      toast({ title: "Berhasil dihapus", description: "Paket telah dihapus dari server." });
    } catch {
      toast({
        title: "Gagal menghapus",
        description: "Tidak dapat menghapus paket. Periksa koneksi atau log server.",
        variant: "destructive",
      });
    }
  };

  const openAddForm = () => {
    setEditingPackage(null);
    setFormData({
      title: "",
      description: "",
      price: 0,
      duration: 1,
      cityId: 1,
      imageUrl: "",
      featured: false,
      isActive: true,
    });
    setIsFormOpen(true);
  };

  const openEditForm = (pkg: TourPackage | (typeof MOCK_PACKAGES)[number]) => {
    setEditingPackage(pkg);
    const cityId = "city" in pkg && pkg.city ? pkg.city.id : (pkg as TourPackage).cityId ?? 1;
    const featured =
      "isFeatured" in pkg && typeof pkg.isFeatured === "boolean"
        ? pkg.isFeatured
        : Boolean((pkg as { featured?: boolean }).featured);
    setFormData({
      title: pkg.title,
      description: pkg.description ?? "",
      price: pkg.price,
      duration: pkg.duration,
      cityId,
      imageUrl: pkg.imageUrl || "",
      featured,
      isActive: pkg.isActive ?? true,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const city = cities.find((c) => c.id === formData.cityId);
    const provinceId =
      city && "provinceId" in city ? (city as City).provinceId : null;

    if (error) {
      if (editingPackage) {
        setLocalPackages((prev) =>
          prev.map((p) =>
            p.id === editingPackage.id
              ? {
                  ...p,
                  ...formData,
                  city: cities.find((c) => c.id === formData.cityId) as (typeof prev)[0]["city"],
                }
              : p,
          ),
        );
        toast({ title: "Berhasil diperbarui", description: "Paket diperbarui (mode simulasi)." });
      } else {
        const newPackage = {
          id: Math.max(...localPackages.map((p) => p.id), 0) + 1,
          ...formData,
          slug: slugify(formData.title) || "paket",
          rating: 4.5,
          city: cities.find((c) => c.id === formData.cityId) as (typeof localPackages)[0]["city"],
        };
        setLocalPackages((prev) => [newPackage, ...prev]);
        toast({ title: "Berhasil ditambahkan", description: "Paket baru (mode simulasi)." });
      }
      setIsFormOpen(false);
      return;
    }

    const existing = editingPackage && "slug" in editingPackage ? (editingPackage as TourPackage) : null;
    const payload = buildPackagePayload(formData, existing, provinceId);

    try {
      if (existing) {
        await updateMutation.mutateAsync({ id: existing.id, data: payload });
        toast({ title: "Berhasil diperbarui", description: "Paket wisata telah disimpan ke server." });
      } else {
        await createMutation.mutateAsync({
          data: { ...payload, slug: slugify(formData.title) || "paket-wisata" },
        });
        toast({ title: "Berhasil ditambahkan", description: "Paket baru tersimpan di server." });
      }
      await queryClient.invalidateQueries({ queryKey: getGetPackagesQueryKey() });
      setIsFormOpen(false);
    } catch {
      toast({
        title: "Gagal menyimpan",
        description: "Periksa data (slug unik, kota valid) dan koneksi API.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Paket Wisata</h1>
          <p className="text-muted-foreground mt-1">Kelola seluruh paket tur dan liburan.</p>
        </div>
        <button 
          onClick={openAddForm}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Paket
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari paket wisata..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner className="my-12" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm bg-muted/10">
                  <th className="py-4 px-6 font-semibold w-16">ID</th>
                  <th className="py-4 px-6 font-semibold">Info Paket</th>
                  <th className="py-4 px-6 font-semibold">Harga</th>
                  <th className="py-4 px-6 font-semibold">Durasi</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredPackages?.map((pkg) => (
                  <tr key={pkg.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                    <td className="py-4 px-6 text-muted-foreground">#{pkg.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={pkg.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=150"} 
                          alt="" 
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-base mb-0.5 line-clamp-1">{pkg.title}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {pkg.city?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold">{formatRupiah(pkg.price)}</td>
                    <td className="py-4 px-6">{pkg.duration} Hari</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        {pkg.isActive ? (
                          <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider text-center">Aktif</span>
                        ) : (
                          <span className="inline-block px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider text-center">Draft</span>
                        )}
                        {(("isFeatured" in pkg && pkg.isFeatured) ||
                          (!("isFeatured" in pkg) && (pkg as { featured?: boolean }).featured)) && (
                          <span className="inline-block px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider text-center">Pilihan</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditForm(pkg)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(pkg.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredPackages?.length && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <Compass className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Tidak ada paket wisata yang cocok dengan pencarian Anda.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">
              {editingPackage ? "Edit Paket Wisata" : "Tambah Paket Wisata Baru"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Judul Paket</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                    placeholder="Cth: Eksplorasi Danau Toba"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Harga (Rp)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Durasi (Hari)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={formData.duration}
                      onChange={e => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm pr-12"
                    />
                    <Clock className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Wilayah</label>
                  <select 
                    value={formData.cityId}
                    onChange={e => setFormData(prev => ({ ...prev, cityId: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm appearance-none cursor-pointer"
                  >
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">URL Gambar</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.imageUrl}
                      onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm pr-12"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <ImageIcon className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Deskripsi</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm resize-none"
                    placeholder="Jelaskan detail paket wisata..."
                  />
                </div>
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={formData.featured}
                      onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">Paket Pilihan</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">Aktif</span>
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-border">
              <button 
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2.5 bg-muted text-muted-foreground font-bold rounded-xl hover:bg-muted/80 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                disabled={isMutating}
                className="px-8 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-60"
              >
                {isMutating ? "Menyimpan…" : editingPackage ? "Simpan Perubahan" : "Tambah Paket"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
