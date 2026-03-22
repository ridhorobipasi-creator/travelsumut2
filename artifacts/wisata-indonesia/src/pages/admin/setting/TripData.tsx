import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useGetDestinations,
  useGetCities,
  useCreateDestination,
  useUpdateDestination,
  useDeleteDestination,
  getGetDestinationsQueryKey,
  type Destination,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Plus, Edit, Trash2, Map, Search, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MOCK_DESTINATIONS = [
  { id: 1, name: "Danau Toba", region: "Toba Samosir", isPopular: true, coverUrl: "https://images.unsplash.com/photo-1599408913599-71e0ea9283fa?w=400", excerpt: "Danau vulkanik terbesar di dunia dengan keindahan tiada tara." },
  { id: 2, name: "Bukit Lawang", region: "Langkat", isPopular: true, coverUrl: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400", excerpt: "Pusat rehabilitasi orangutan terbesar di Sumatera, surga ekowisata." },
  { id: 3, name: "Pulau Nias", region: "Nias", isPopular: false, coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", excerpt: "Terkenal dengan ombak surfing kelas dunia dan tradisi lompat batu." },
  { id: 4, name: "Berastagi", region: "Karo", isPopular: true, coverUrl: "https://images.unsplash.com/photo-1601152264065-0cbf24fc4820?w=400", excerpt: "Kota asri dengan udara dingin, terkenal akan hasil pertanian dan Gunung Sibayak." },
];

const emptyForm = { name: "", cityId: 1, isPopular: false, coverUrl: "", excerpt: "" };

function isPopularRating(r: number | null | undefined) {
  return (r ?? 0) >= 4.75;
}

export default function TripData() {
  const queryClient = useQueryClient();
  const { data: fetched, isLoading, error } = useGetDestinations();
  const { data: cities } = useGetCities();
  const createMut = useCreateDestination();
  const updateMut = useUpdateDestination();
  const deleteMut = useDeleteDestination();
  const [local, setLocal] = useState(MOCK_DESTINATIONS);
  const { toast } = useToast();

  const isMutating = createMut.isPending || updateMut.isPending || deleteMut.isPending;

  useEffect(() => {
    if (error) {
      toast({
        title: "Koneksi API Gagal",
        description: "Menampilkan data simulasi.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | (typeof MOCK_DESTINATIONS)[number] | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const destinations = error ? local : (fetched ?? []);

  const filtered = destinations.filter((d) => {
    const name = "name" in d ? d.name : "";
    const region =
      "city" in d && d.city
        ? d.city.name
        : "region" in d
          ? d.region
          : "";
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || region.toLowerCase().includes(q);
  });

  const firstCityId = cities?.[0]?.id ?? 1;

  const openAdd = () => {
    setEditingDest(null);
    setFormData({ ...emptyForm, cityId: firstCityId });
    setIsFormOpen(true);
  };

  const openEdit = (dest: Destination | (typeof MOCK_DESTINATIONS)[number]) => {
    setEditingDest(dest);
    if ("cityId" in dest) {
      setFormData({
        name: dest.name,
        cityId: dest.cityId,
        isPopular: isPopularRating(dest.rating ?? undefined),
        coverUrl: dest.imageUrl || "",
        excerpt: dest.description?.slice(0, 120) || "",
      });
    } else {
      setFormData({
        name: dest.name,
        cityId: firstCityId,
        isPopular: dest.isPopular,
        coverUrl: dest.coverUrl,
        excerpt: dest.excerpt,
      });
    }
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus master data destinasi wilayah ini?")) return;

    if (error) {
      setLocal((prev) => prev.filter((d) => d.id !== id));
      return;
    }

    try {
      await deleteMut.mutateAsync({ id });
      await queryClient.invalidateQueries({ queryKey: getGetDestinationsQueryKey() });
      toast({ title: "Dihapus" });
    } catch {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = slugify(formData.name) || "destinasi";
    const rating = formData.isPopular ? 4.9 : 4.2;

    if (error) {
      if (editingDest) {
        setLocal((prev) =>
          prev.map((d) =>
            d.id === editingDest.id
              ? {
                  ...d,
                  name: formData.name,
                  region: cities?.find((c) => c.id === formData.cityId)?.name ?? d.region,
                  isPopular: formData.isPopular,
                  coverUrl: formData.coverUrl,
                  excerpt: formData.excerpt,
                }
              : d,
          ),
        );
      } else {
        setLocal((prev) => [
          ...prev,
          {
            id: Math.max(...prev.map((d) => d.id), 0) + 1,
            name: formData.name,
            region: cities?.find((c) => c.id === formData.cityId)?.name ?? "",
            isPopular: formData.isPopular,
            coverUrl: formData.coverUrl,
            excerpt: formData.excerpt,
          },
        ]);
      }
      setIsFormOpen(false);
      return;
    }

    const payload = {
      cityId: formData.cityId,
      name: formData.name,
      slug: editingDest && "slug" in editingDest && editingDest.slug ? editingDest.slug : slug,
      description: formData.excerpt || null,
      imageUrl: formData.coverUrl || null,
      rating,
    };

    try {
      if (editingDest && "createdAt" in editingDest) {
        const ex = editingDest as Destination;
        await updateMut.mutateAsync({
          id: ex.id,
          data: { ...payload, slug: ex.slug },
        });
      } else {
        await createMut.mutateAsync({ data: payload });
      }
      await queryClient.invalidateQueries({ queryKey: getGetDestinationsQueryKey() });
      toast({ title: "Berhasil disimpan" });
      setIsFormOpen(false);
    } catch {
      toast({ title: "Gagal menyimpan (slug unik?)", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <Map className="w-8 h-8 text-primary" /> Master Destinasi Trip
          </h1>
          <p className="text-muted-foreground mt-1">Database destinasi wisata terhubung ke API `/destinations`.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" /> Tambah Destinasi Baru
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama destinasi atau wilayah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm bg-muted/5">
                  <th className="py-4 px-6 font-semibold w-24">Cover</th>
                  <th className="py-4 px-6 font-semibold">Nama Destinasi Wisata</th>
                  <th className="py-4 px-6 font-semibold">Wilayah (Kab./Kota)</th>
                  <th className="py-4 px-6 font-semibold text-center w-28">Status Rating</th>
                  <th className="py-4 px-6 font-semibold text-right w-32">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filtered.map((dest) => {
                  const name = "name" in dest ? dest.name : "";
                  const cover =
                    "imageUrl" in dest && dest.imageUrl
                      ? dest.imageUrl
                      : "coverUrl" in dest
                        ? dest.coverUrl
                        : "";
                  const excerpt =
                    "description" in dest && dest.description
                      ? dest.description
                      : "excerpt" in dest
                        ? dest.excerpt
                        : "";
                  const region =
                    "city" in dest && dest.city
                      ? dest.city.name
                      : "region" in dest
                        ? dest.region
                        : "";
                  const pop =
                    "rating" in dest
                      ? isPopularRating(dest.rating ?? undefined)
                      : "isPopular" in dest
                        ? dest.isPopular
                        : false;
                  return (
                    <tr key={dest.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                      <td className="py-4 px-6">
                        {cover ? (
                          <div className="w-12 h-12 rounded-xl border border-border/50 overflow-hidden bg-muted">
                            <img src={cover} alt={name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center border border-border/50">
                            <ImageIcon className="w-5 h-5 text-muted-foreground opacity-50" />
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-foreground text-base mb-0.5">{name}</p>
                        <p className="text-xs text-muted-foreground leading-tight line-clamp-1 italic max-w-md">{excerpt || "-"}</p>
                      </td>
                      <td className="py-4 px-6 font-semibold text-muted-foreground">{region}</td>
                      <td className="py-4 px-6 text-center">
                        {pop ? (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-full tracking-wider">Top Populer</span>
                        ) : (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase rounded-full tracking-wider">Biasa</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity">
                          <button type="button" onClick={() => openEdit(dest)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => handleDelete(dest.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground font-medium">
                      <Map className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      Data destinasi tidak ditemukan.
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
            <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
              <Map className="w-5 h-5 text-primary" />
              {editingDest ? "Edit Master Destinasi" : "Daftar Destinasi Trip"}
            </DialogTitle>
          </DialogHeader>
          <form id="destForm" onSubmit={handleSubmit} className="space-y-4 py-2 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-bold mb-1.5 text-foreground">Nama Lokasi/Destinasi Wisata</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                  placeholder="Ex. Sipiso-piso Waterfall"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold mb-1.5 text-foreground">Kota / Kabupaten (API)</label>
                <select
                  value={formData.cityId}
                  onChange={(e) => setFormData((p) => ({ ...p, cityId: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm"
                >
                  {(cities ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5 text-foreground">Slogan Singkat / Deskripsi</label>
              <textarea
                rows={2}
                maxLength={500}
                value={formData.excerpt}
                onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm resize-none"
                placeholder="Deskripsi singkat destinasi..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5 text-foreground">Foto Sampul Cover URL</label>
              <input
                type="url"
                value={formData.coverUrl}
                onChange={(e) => setFormData((p) => ({ ...p, coverUrl: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                placeholder="https://..."
              />
            </div>

            <div className="p-4 bg-muted/30 border border-border border-dashed rounded-xl mt-4 flex items-start gap-3">
              <label className="relative inline-flex items-center cursor-pointer mt-0.5">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData((p) => ({ ...p, isPopular: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400" />
              </label>
              <div>
                <h5 className="font-bold text-sm text-foreground mb-0.5">
                  Sematkan sebagai <span className="text-amber-600">Top Popular</span>
                </h5>
                <p className="text-xs text-muted-foreground leading-relaxed">Meningkatkan skor rating tampilan di admin (tersimpan di kolom rating).</p>
              </div>
            </div>
          </form>
          <DialogFooter className="pt-4 border-t border-border mt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 bg-background border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors mr-2">
              Batal
            </button>
            <button
              form="destForm"
              type="submit"
              disabled={isMutating}
              className="px-7 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {isMutating ? "Menyimpan…" : "Simpan Master Data"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
