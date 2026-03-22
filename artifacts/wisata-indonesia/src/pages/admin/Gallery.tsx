import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useGetGallery,
  useCreateGalleryItem,
  useUpdateGalleryItem,
  useDeleteGalleryItem,
  getGetGalleryQueryKey,
  type GalleryItem,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Plus, Edit, Trash2, Search, Image as ImageIcon, MapPin, ZoomIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_GALLERY } from "@/lib/mockData";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminGallery() {
  const queryClient = useQueryClient();
  const { data: fetchedGallery, isLoading, error } = useGetGallery();
  const createMutation = useCreateGalleryItem();
  const updateMutation = useUpdateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();
  const [localGallery, setLocalGallery] = useState(MOCK_GALLERY);
  const { toast } = useToast();

  const isMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  useEffect(() => {
    if (error) {
      toast({
        title: "Koneksi API Gagal",
        description: "Menampilkan galeri simulasi karena server database belum terhubung.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | (typeof MOCK_GALLERY)[number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    category: "",
  });

  const gallery =
    error || fetchedGallery === undefined ? localGallery : fetchedGallery;
  const filteredGallery = gallery.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;

    if (error) {
      setLocalGallery((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: "Berhasil dihapus",
        description: "Foto dihapus dari data lokal (mode simulasi).",
      });
      return;
    }

    try {
      await deleteMutation.mutateAsync({ id });
      await queryClient.invalidateQueries({ queryKey: getGetGalleryQueryKey() });
      toast({ title: "Berhasil dihapus", description: "Foto telah dihapus dari server." });
    } catch {
      toast({
        title: "Gagal menghapus",
        description: "Periksa koneksi API.",
        variant: "destructive",
      });
    }
  };

  const openAddForm = () => {
    setEditingItem(null);
    setFormData({ title: "", imageUrl: "", category: "" });
    setIsFormOpen(true);
  };

  const openEditForm = (item: GalleryItem | (typeof MOCK_GALLERY)[number]) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      imageUrl: item.imageUrl || "",
      category: "category" in item && item.category ? item.category : "",
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (error) {
      if (editingItem) {
        setLocalGallery((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? { ...item, ...formData } : item,
          ),
        );
        toast({ title: "Berhasil diperbarui", description: "Foto (mode simulasi)." });
      } else {
        const newItem = {
          id: Math.max(...localGallery.map((item) => item.id), 0) + 1,
          title: formData.title,
          imageUrl: formData.imageUrl,
        };
        setLocalGallery((prev) => [newItem, ...prev]);
        toast({ title: "Berhasil ditambahkan", description: "Foto baru (mode simulasi)." });
      }
      setIsFormOpen(false);
      return;
    }

    const payload = {
      title: formData.title,
      imageUrl: formData.imageUrl,
      category: formData.category.trim() || null,
      destinationId: null as number | null,
    };

    try {
      if (editingItem && "createdAt" in editingItem) {
        const it = editingItem as GalleryItem;
        await updateMutation.mutateAsync({
          id: it.id,
          data: {
            ...payload,
            destinationId: it.destinationId ?? null,
          },
        });
        toast({ title: "Berhasil diperbarui", description: "Foto disimpan di server." });
      } else {
        await createMutation.mutateAsync({ data: payload });
        toast({ title: "Berhasil ditambahkan", description: "Foto baru tersimpan di server." });
      }
      await queryClient.invalidateQueries({ queryKey: getGetGalleryQueryKey() });
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
          <h1 className="text-3xl font-display font-bold">Kelola Galeri</h1>
          <p className="text-muted-foreground mt-1">Kelola foto dan konten visual destinasi wisata.</p>
        </div>
        <button 
          onClick={openAddForm}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Foto
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari foto..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : (
          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGallery?.map((item) => (
                <div key={item.id} className="group relative bg-muted rounded-2xl overflow-hidden shadow-soft border border-border/50 aspect-square">
                  <img 
                    src={item.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=300"} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    <button 
                      onClick={() => openEditForm(item)}
                      className="p-2 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-primary rounded-lg transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-rose-600/10 backdrop-blur-md border border-rose-600/20 text-white hover:bg-rose-600 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <div className="flex items-center gap-1.5 text-white/80 font-bold text-[10px] uppercase tracking-widest mb-1.5">
                       <MapPin className="w-3 h-3 text-secondary" /> Sumatera Utara
                    </div>
                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-1">{item.title}</h3>
                  </div>
                </div>
              ))}
              {!filteredGallery?.length && (
                <div className="col-span-full py-24 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-3xl">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-bold text-xl">Tidak ada foto ditemukan.</p>
                  <p className="text-sm">Coba kata kunci lain atau tambah foto baru.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">
              {editingItem ? "Edit Foto Galeri" : "Tambah Foto Baru"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Judul / Keterangan</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                  placeholder="Cth: Matahari Terbit di Danau Toba"
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
                <label className="block text-sm font-bold text-foreground mb-2">Kategori (opsional)</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                  placeholder="Cth: Alam, Budaya"
                />
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
                {isMutating ? "Menyimpan…" : editingItem ? "Simpan Perubahan" : "Tambah Foto"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

