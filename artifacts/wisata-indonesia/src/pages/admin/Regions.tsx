import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useGetCities,
  useGetProvinces,
  useCreateCity,
  useUpdateCity,
  useDeleteCity,
  getGetCitiesQueryKey,
  type City,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Plus, Edit, Trash2, Search, Map, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_CITIES } from "@/lib/mockData";
import { slugify } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminRegions() {
  const queryClient = useQueryClient();
  const { data: fetchedCities, isLoading, error } = useGetCities();
  const { data: provinces } = useGetProvinces();
  const createMut = useCreateCity();
  const updateMut = useUpdateCity();
  const deleteMut = useDeleteCity();
  const [localCities, setLocalCities] = useState(MOCK_CITIES);
  const { toast } = useToast();

  const isMutating = createMut.isPending || updateMut.isPending || deleteMut.isPending;

  useEffect(() => {
    if (error) {
      toast({
        title: "Koneksi API Gagal",
        description: "Menampilkan wilayah simulasi karena server database belum terhubung.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | (typeof MOCK_CITIES)[number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    provinceId: 1,
    description: "",
    imageUrl: "",
  });

  const cities = error ? localCities : (fetchedCities ?? []);
  const filteredCities = cities.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const defaultProvinceId = provinces?.[0]?.id ?? 1;

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus wilayah ini?")) return;

    if (error) {
      setLocalCities((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Berhasil dihapus", description: "Wilayah dihapus (mode simulasi)." });
      return;
    }

    try {
      await deleteMut.mutateAsync({ id });
      await queryClient.invalidateQueries({ queryKey: getGetCitiesQueryKey() });
      toast({ title: "Berhasil dihapus", description: "Kota/kabupaten dihapus dari server." });
    } catch {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    }
  };

  const openAddForm = () => {
    setEditingCity(null);
    setFormData({
      name: "",
      provinceId: defaultProvinceId,
      description: "",
      imageUrl: "",
    });
    setIsFormOpen(true);
  };

  const openEditForm = (city: City | (typeof MOCK_CITIES)[number]) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      provinceId: "provinceId" in city ? city.provinceId : defaultProvinceId,
      description: "description" in city && city.description ? city.description : "",
      imageUrl: "imageUrl" in city && city.imageUrl ? city.imageUrl : "",
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = slugify(formData.name) || "kota";

    if (error) {
      if (editingCity) {
        setLocalCities((prev) =>
          prev.map((c) => (c.id === editingCity.id ? { ...c, name: formData.name } : c)),
        );
      } else {
        setLocalCities((prev) => [
          ...prev,
          { id: Math.max(...prev.map((c) => c.id), 0) + 1, name: formData.name },
        ]);
      }
      toast({ title: "Tersimpan (mode simulasi)" });
      setIsFormOpen(false);
      return;
    }

    const payload = {
      provinceId: formData.provinceId,
      name: formData.name,
      slug: editingCity && "slug" in editingCity && editingCity.slug ? editingCity.slug : slug,
      description: formData.description || null,
      imageUrl: formData.imageUrl || null,
    };

    try {
      if (editingCity && "createdAt" in editingCity) {
        const ex = editingCity as City;
        await updateMut.mutateAsync({ id: ex.id, data: { ...payload, slug: ex.slug } });
      } else {
        await createMut.mutateAsync({ data: payload });
      }
      await queryClient.invalidateQueries({ queryKey: getGetCitiesQueryKey() });
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
          <h1 className="text-3xl font-display font-bold">Kelola Wilayah</h1>
          <p className="text-muted-foreground mt-1">Daftar kota dan kabupaten di Sumatera Utara.</p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Wilayah
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari wilayah..."
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
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm bg-muted/10">
                  <th className="py-4 px-8 font-semibold w-24">ID</th>
                  <th className="py-4 px-8 font-semibold">Nama Wilayah</th>
                  <th className="py-4 px-8 font-semibold">Provinsi</th>
                  <th className="py-4 px-8 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredCities?.map((city) => (
                  <tr key={city.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                    <td className="py-4 px-8 text-muted-foreground font-mono">#{city.id}</td>
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Map className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-base">{city.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-8">
                      {(city as City).province?.name
                        ?? provinces?.find((p) => "provinceId" in city && p.id === (city as City).provinceId)?.name
                        ?? "Sumatera Utara"}
                    </td>
                    <td className="py-4 px-8">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openEditForm(city)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(city.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredCities?.length && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground">
                      <Map className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Tidak ada wilayah yang cocok dengan pencarian Anda.</p>
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
              {editingCity ? "Edit Wilayah" : "Tambah Wilayah Baru"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Provinsi</label>
                <select
                  value={formData.provinceId}
                  onChange={(e) => setFormData((p) => ({ ...p, provinceId: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                >
                  {(provinces ?? [{ id: 1, name: "Sumatera Utara" }]).map((pr) => (
                    <option key={pr.id} value={pr.id}>
                      {pr.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Nama Wilayah</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                    placeholder="Cth: Samosir"
                  />
                  <Globe className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Deskripsi (opsional)</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">URL Gambar (opsional)</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>

            <DialogFooter>
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
                className="px-8 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all disabled:opacity-60"
              >
                {isMutating ? "Menyimpan…" : editingCity ? "Simpan Perubahan" : "Tambah Wilayah"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
