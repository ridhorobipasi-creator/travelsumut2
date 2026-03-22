import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useGetTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  getGetTestimonialsQueryKey,
  type Testimonial,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Plus, Edit, Trash2, Search, MessageSquare, Star, Check, X, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_TESTIMONIALS } from "@/lib/mockData";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function isApprovedRow(t: Testimonial | (typeof MOCK_TESTIMONIALS)[number]): boolean {
  if ("isApproved" in t && typeof t.isApproved === "boolean") return t.isApproved;
  return Boolean((t as { approved?: boolean }).approved);
}

export default function AdminTestimonials() {
  const queryClient = useQueryClient();
  const { data: fetchedTestimonials, isLoading, error } = useGetTestimonials();
  const createMut = useCreateTestimonial();
  const updateMut = useUpdateTestimonial();
  const deleteMut = useDeleteTestimonial();
  const [localTestimonials, setLocalTestimonials] = useState(MOCK_TESTIMONIALS);
  const { toast } = useToast();

  const isMutating = createMut.isPending || updateMut.isPending || deleteMut.isPending;

  useEffect(() => {
    if (error) {
      toast({
        title: "Koneksi API Gagal",
        description: "Menampilkan testimoni simulasi karena server database belum terhubung.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | (typeof MOCK_TESTIMONIALS)[number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    comment: "",
    rating: 5,
    imageUrl: "",
    isApproved: false,
  });

  const testimonials =
    error || fetchedTestimonials === undefined ? localTestimonials : fetchedTestimonials;
  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.comment.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) return;

    if (error) {
      setLocalTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Berhasil dihapus", description: "Testimoni dihapus (mode simulasi)." });
      return;
    }

    try {
      await deleteMut.mutateAsync({ id });
      await queryClient.invalidateQueries({ queryKey: getGetTestimonialsQueryKey() });
      toast({ title: "Berhasil dihapus", description: "Testimoni dihapus dari server." });
    } catch {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    }
  };

  const handleToggleApproval = async (t: Testimonial | (typeof MOCK_TESTIMONIALS)[number]) => {
    const next = !isApprovedRow(t);
    if (error) {
      setLocalTestimonials((prev) =>
        prev.map((row) => (row.id === t.id ? { ...row, approved: next } : row)),
      );
      toast({ title: "Status diperbarui" });
      return;
    }

    try {
      await updateMut.mutateAsync({
        id: t.id,
        data: { isApproved: next },
      });
      await queryClient.invalidateQueries({ queryKey: getGetTestimonialsQueryKey() });
      toast({ title: "Status diperbarui" });
    } catch {
      toast({ title: "Gagal memperbarui status", variant: "destructive" });
    }
  };

  const openAddForm = () => {
    setEditingTestimonial(null);
    setFormData({
      customerName: "",
      comment: "",
      rating: 5,
      imageUrl: "",
      isApproved: false,
    });
    setIsFormOpen(true);
  };

  const openEditForm = (t: Testimonial | (typeof MOCK_TESTIMONIALS)[number]) => {
    setEditingTestimonial(t);
    setFormData({
      customerName: t.customerName,
      comment: t.comment,
      rating: t.rating,
      imageUrl: ("customerAvatar" in t && t.customerAvatar) || (t as { customerAvatar?: string }).customerAvatar || "",
      isApproved: isApprovedRow(t),
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (error) {
      if (editingTestimonial) {
        setLocalTestimonials((prev) =>
          prev.map((row) =>
            row.id === editingTestimonial.id ? { ...row, ...formData, approved: formData.isApproved } : row,
          ),
        );
      } else {
        const newT = {
          id: Math.max(...localTestimonials.map((x) => x.id), 0) + 1,
          customerName: formData.customerName,
          comment: formData.comment,
          rating: formData.rating,
          customerAvatar: formData.imageUrl || undefined,
          approved: formData.isApproved,
        };
        setLocalTestimonials((prev) => [newT as (typeof MOCK_TESTIMONIALS)[number], ...prev]);
      }
      toast({ title: "Tersimpan (mode simulasi)" });
      setIsFormOpen(false);
      return;
    }

    try {
      if (editingTestimonial && "createdAt" in editingTestimonial) {
        const ex = editingTestimonial as Testimonial;
        await updateMut.mutateAsync({
          id: ex.id,
          data: {
            customerName: formData.customerName,
            comment: formData.comment,
            rating: formData.rating,
            customerAvatar: formData.imageUrl || null,
            packageId: ex.packageId ?? null,
            isApproved: formData.isApproved,
          },
        });
      } else {
        await createMut.mutateAsync({
          data: {
            customerName: formData.customerName,
            comment: formData.comment,
            rating: formData.rating,
            customerAvatar: formData.imageUrl || null,
            packageId: null,
            isApproved: formData.isApproved,
          },
        });
      }
      await queryClient.invalidateQueries({ queryKey: getGetTestimonialsQueryKey() });
      toast({ title: "Berhasil disimpan" });
      setIsFormOpen(false);
    } catch {
      toast({ title: "Gagal menyimpan", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Kelola Testimoni</h1>
          <p className="text-muted-foreground mt-1">Daftar ulasan dan testimoni dari pelanggan.</p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Testimoni
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari testimoni..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm bg-muted/10">
                  <th className="py-4 px-8 font-semibold w-24">ID</th>
                  <th className="py-4 px-8 font-semibold">Pelanggan</th>
                  <th className="py-4 px-8 font-semibold">Komentar</th>
                  <th className="py-4 px-8 font-semibold">Rating</th>
                  <th className="py-4 px-8 font-semibold">Status</th>
                  <th className="py-4 px-8 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredTestimonials?.map((t) => {
                  const ok = isApprovedRow(t);
                  return (
                    <tr key={t.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                      <td className="py-4 px-8 text-muted-foreground font-mono">#{t.id.toString().padStart(4, "0")}</td>
                      <td className="py-4 px-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                            {"customerAvatar" in t && t.customerAvatar ? (
                              <img src={t.customerAvatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              t.customerName.charAt(0)
                            )}
                          </div>
                          <span className="font-bold text-foreground line-clamp-1">{t.customerName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-8">
                        <p className="text-muted-foreground italic line-clamp-2 max-w-md">"{t.comment}"</p>
                      </td>
                      <td className="py-4 px-8">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-secondary fill-secondary" />
                          <span className="font-bold">{t.rating}</span>
                        </div>
                      </td>
                      <td className="py-4 px-8">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${ok ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {ok ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="py-4 px-8">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleToggleApproval(t)}
                            className={`p-1.5 rounded-md transition-all ${ok ? "bg-rose-100 text-rose-700 hover:bg-rose-200" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
                            title={ok ? "Batalkan Persetujuan" : "Setujui"}
                          >
                            {ok ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditForm(t)}
                            className="p-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(t.id)}
                            className="p-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filteredTestimonials?.length && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Tidak ada testimoni yang cocok dengan pencarian Anda.</p>
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
              {editingTestimonial ? "Edit Testimoni" : "Tambah Testimoni Baru"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Nama Pelanggan</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                    placeholder="Cth: Ahmad Sulaiman"
                  />
                  <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">URL Foto (opsional)</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm appearance-none cursor-pointer"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} Bintang
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Komentar / Ulasan</label>
                <textarea
                  rows={4}
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm resize-none"
                  placeholder="Tulis ulasan pelanggan..."
                />
              </div>
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.isApproved}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isApproved: e.target.checked }))}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    Tampilkan di Website (Approved)
                  </span>
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
                {isMutating ? "Menyimpan…" : editingTestimonial ? "Simpan Perubahan" : "Tambah Testimoni"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
