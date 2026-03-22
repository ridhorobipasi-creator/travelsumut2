import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useGetBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
  getGetBannersQueryKey,
  type Banner,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Plus, Edit, Trash2, Search, LayoutTemplate, Link as LinkIcon, Eye, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MOCK_BANNERS = [
  { id: 1, title: "Promo Ramadhan", imageUrl: "https://images.unsplash.com/photo-1599408913599-71e0ea9283fa?w=800", link: "/paket-wisata", isActive: true, order: 0 },
  { id: 2, title: "Wisata Danau Toba", imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800", link: "/paket-wisata/danau-toba", isActive: true, order: 1 },
];

function bannerHref(b: { ctaLink?: string | null; link?: string }) {
  return (b.ctaLink ?? b.link ?? "").trim();
}

export default function AdminBanners() {
  const queryClient = useQueryClient();
  const { data: fetchedBanners, isLoading, error } = useGetBanners();
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const deleteMutation = useDeleteBanner();
  const [localBanners, setLocalBanners] = useState(MOCK_BANNERS);
  const { toast } = useToast();

  const isMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  useEffect(() => {
    if (error) {
      toast({
        title: "Koneksi API Gagal",
        description: "Menampilkan banner simulasi karena server database belum terhubung.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | (typeof MOCK_BANNERS)[number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    link: "",
    isActive: true,
  });

  const banners =
    error || fetchedBanners === undefined ? localBanners : fetchedBanners;
  const filteredBanners = banners.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bannerHref(b).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus banner ini?")) return;

    if (error) {
      setLocalBanners((prev) => prev.filter((b) => b.id !== id));
      toast({
        title: "Berhasil dihapus",
        description: "Banner dihapus dari data lokal (mode simulasi).",
      });
      return;
    }

    try {
      await deleteMutation.mutateAsync({ id });
      await queryClient.invalidateQueries({ queryKey: getGetBannersQueryKey() });
      toast({ title: "Berhasil dihapus", description: "Banner telah dihapus dari server." });
    } catch {
      toast({
        title: "Gagal menghapus",
        description: "Periksa koneksi API.",
        variant: "destructive",
      });
    }
  };

  const openAddForm = () => {
    setEditingBanner(null);
    setFormData({ title: "", imageUrl: "", link: "", isActive: true });
    setIsFormOpen(true);
  };

  const openEditForm = (banner: Banner | (typeof MOCK_BANNERS)[number]) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      imageUrl: banner.imageUrl || "",
      link: bannerHref(banner),
      isActive: banner.isActive ?? true,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (error) {
      if (editingBanner) {
        setLocalBanners((prev) =>
          prev.map((b) =>
            b.id === editingBanner.id ? { ...b, ...formData, link: formData.link } : b,
          ),
        );
        toast({ title: "Berhasil diperbarui", description: "Banner (mode simulasi)." });
      } else {
        const newBanner = {
          id: Math.max(...localBanners.map((b) => b.id), 0) + 1,
          ...formData,
          order: localBanners.length,
        };
        setLocalBanners((prev) => [newBanner, ...prev]);
        toast({ title: "Berhasil ditambahkan", description: "Banner baru (mode simulasi)." });
      }
      setIsFormOpen(false);
      return;
    }

    const orderBase =
      editingBanner && "order" in editingBanner
        ? editingBanner.order
        : banners.length > 0
          ? Math.max(...banners.map((b) => b.order ?? 0)) + 1
          : 0;

    try {
      if (editingBanner && "createdAt" in editingBanner) {
        const b = editingBanner as Banner;
        await updateMutation.mutateAsync({
          id: b.id,
          data: {
            title: formData.title,
            imageUrl: formData.imageUrl,
            ctaLink: formData.link || null,
            subtitle: b.subtitle ?? null,
            ctaText: b.ctaText ?? null,
            isActive: formData.isActive,
            order: b.order,
          },
        });
        toast({ title: "Berhasil diperbarui", description: "Banner disimpan di server." });
      } else {
        await createMutation.mutateAsync({
          data: {
            title: formData.title,
            imageUrl: formData.imageUrl,
            ctaLink: formData.link || null,
            subtitle: null,
            ctaText: null,
            isActive: formData.isActive,
            order: orderBase,
          },
        });
        toast({ title: "Berhasil ditambahkan", description: "Banner baru tersimpan di server." });
      }
      await queryClient.invalidateQueries({ queryKey: getGetBannersQueryKey() });
      setIsFormOpen(false);
    } catch {
      toast({
        title: "Gagal menyimpan",
        description: "Periksa data dan koneksi API.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Kelola Banner</h1>
          <p className="text-muted-foreground mt-1">Banner promosi dan konten utama di halaman depan.</p>
        </div>
        <button 
          onClick={openAddForm}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Banner
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari banner..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm bg-muted/10">
                  <th className="py-4 px-8 font-semibold w-24">ID</th>
                  <th className="py-4 px-8 font-semibold">Banner</th>
                  <th className="py-4 px-8 font-semibold">Tautan</th>
                  <th className="py-4 px-8 font-semibold">Status</th>
                  <th className="py-4 px-8 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredBanners?.map((banner) => (
                  <tr key={banner.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                    <td className="py-4 px-8 text-muted-foreground font-mono">#{banner.id.toString().padStart(3, '0')}</td>
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-4">
                        <img 
                          src={banner.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=300"} 
                          alt="" 
                          className="w-32 h-16 rounded-lg object-cover bg-muted"
                        />
                        <p className="font-bold text-base line-clamp-1">{banner.title}</p>
                      </div>
                    </td>
                    <td className="py-4 px-8">
                       <div className="flex items-center gap-2 text-primary font-medium">
                          <LinkIcon className="w-4 h-4" />
                          {bannerHref(banner) || "-"}
                       </div>
                    </td>
                    <td className="py-4 px-8">
                       <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${banner.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                          {banner.isActive ? 'Aktif' : 'Draft'}
                       </span>
                    </td>
                    <td className="py-4 px-8">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditForm(banner)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(banner.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredBanners?.length && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      <LayoutTemplate className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Tidak ada banner yang cocok dengan pencarian Anda.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">
              {editingBanner ? "Edit Banner" : "Tambah Banner Baru"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Judul Banner</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                  placeholder="Cth: Promo Liburan Sekolah"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">URL Gambar</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    value={formData.imageUrl}
                    onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm pr-12"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <ImageIcon className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Tautan (Link)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.link}
                    onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm pr-12"
                    placeholder="/paket-wisata/..."
                  />
                  <LinkIcon className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">Aktifkan Banner</span>
                </label>
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
                {isMutating ? "Menyimpan…" : editingBanner ? "Simpan Perubahan" : "Tambah Banner"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

