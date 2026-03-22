import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useGetVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  getGetVehiclesQueryKey,
  type Vehicle,
  type CreateVehicleInput,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Plus, Edit, Trash2, Search, CarFront, Users, Fuel, Gauge, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatRupiah } from "@/lib/utils";
import { MOCK_VEHICLES } from "@/lib/mockData";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function dailyPrice(v: { pricePerDay?: number; price?: number }): number {
  return v.pricePerDay ?? v.price ?? 0;
}

function buildVehiclePayload(
  form: {
    name: string;
    type: string;
    price: number;
    capacity: number;
    imageUrl: string;
    description: string;
    isActive: boolean;
  },
  existing: Vehicle | null,
): CreateVehicleInput {
  return {
    name: form.name,
    type: form.type,
    brand: existing?.brand ?? null,
    capacity: form.capacity,
    pricePerDay: form.price,
    imageUrl: form.imageUrl || null,
    images: existing?.images ?? [],
    features: existing?.features ?? [],
    isAvailable: form.isActive,
    description: form.description || null,
  };
}

export default function AdminVehicles() {
  const queryClient = useQueryClient();
  const { data: fetchedVehicles, isLoading, error } = useGetVehicles();
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();
  const deleteMutation = useDeleteVehicle();
  const [localVehicles, setLocalVehicles] = useState(MOCK_VEHICLES);
  const { toast } = useToast();

  const isMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  useEffect(() => {
    if (error) {
      toast({
        title: "Koneksi API Gagal",
        description: "Menampilkan armada simulasi karena server database belum terhubung.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | (typeof MOCK_VEHICLES)[number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "MPV",
    price: 0,
    imageUrl: "",
    capacity: 7,
    description: "",
    isActive: true,
  });

  const vehicles =
    error || fetchedVehicles === undefined ? localVehicles : fetchedVehicles;
  const filteredVehicles = vehicles.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kendaraan ini?")) return;

    if (error) {
      setLocalVehicles((prev) => prev.filter((v) => v.id !== id));
      toast({
        title: "Berhasil dihapus",
        description: "Kendaraan dihapus dari data lokal (mode simulasi).",
      });
      return;
    }

    try {
      await deleteMutation.mutateAsync({ id });
      await queryClient.invalidateQueries({ queryKey: getGetVehiclesQueryKey() });
      toast({ title: "Berhasil dihapus", description: "Kendaraan telah dihapus dari server." });
    } catch {
      toast({
        title: "Gagal menghapus",
        description: "Periksa koneksi atau log server.",
        variant: "destructive",
      });
    }
  };

  const openAddForm = () => {
    setEditingVehicle(null);
    setFormData({
      name: "",
      type: "MPV",
      capacity: 7,
      price: 0,
      imageUrl: "",
      description: "",
      isActive: true,
    });
    setIsFormOpen(true);
  };

  const openEditForm = (vehicle: Vehicle | (typeof MOCK_VEHICLES)[number]) => {
    setEditingVehicle(vehicle);
    const isAvail =
      "isAvailable" in vehicle && typeof vehicle.isAvailable === "boolean"
        ? vehicle.isAvailable
        : Boolean((vehicle as { isActive?: boolean }).isActive);
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      capacity: vehicle.capacity,
      price: dailyPrice(vehicle),
      imageUrl: vehicle.imageUrl || "",
      description: vehicle.description || "",
      isActive: isAvail,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const existing =
      editingVehicle && "createdAt" in editingVehicle
        ? (editingVehicle as Vehicle)
        : null;

    if (error) {
      if (editingVehicle) {
        setLocalVehicles((prev) =>
          prev.map((v) =>
            v.id === editingVehicle.id
              ? {
                  ...v,
                  ...formData,
                  price: formData.price,
                }
              : v,
          ),
        );
        toast({ title: "Berhasil diperbarui", description: "Data kendaraan (mode simulasi)." });
      } else {
        const newVehicle = {
          id: Math.max(...localVehicles.map((v) => v.id), 0) + 1,
          name: formData.name,
          type: formData.type,
          capacity: formData.capacity,
          price: formData.price,
          imageUrl: formData.imageUrl,
          description: formData.description,
          features: [],
        };
        setLocalVehicles((prev) => [...prev, newVehicle]);
        toast({ title: "Berhasil ditambahkan", description: "Kendaraan baru (mode simulasi)." });
      }
      setIsFormOpen(false);
      return;
    }

    const payload = buildVehiclePayload(formData, existing);

    try {
      if (existing) {
        await updateMutation.mutateAsync({ id: existing.id, data: payload });
        toast({ title: "Berhasil diperbarui", description: "Data kendaraan disimpan di server." });
      } else {
        await createMutation.mutateAsync({ data: payload });
        toast({ title: "Berhasil ditambahkan", description: "Kendaraan baru tersimpan di server." });
      }
      await queryClient.invalidateQueries({ queryKey: getGetVehiclesQueryKey() });
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
          <h1 className="text-3xl font-display font-bold">Kelola Kendaraan</h1>
          <p className="text-muted-foreground mt-1">Daftar armada transportasi dan rental mobil.</p>
        </div>
        <button 
          onClick={openAddForm}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Kendaraan
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari kendaraan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </div>

        {isLoading && !vehicles.length ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm bg-muted/10">
                  <th className="py-4 px-8 font-semibold w-24">ID</th>
                  <th className="py-4 px-8 font-semibold">Info Kendaraan</th>
                  <th className="py-4 px-8 font-semibold">Kapasitas & Tipe</th>
                  <th className="py-4 px-8 font-semibold">Harga / Hari</th>
                  <th className="py-4 px-8 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredVehicles?.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                    <td className="py-4 px-8 text-muted-foreground font-mono">#{vehicle.id.toString().padStart(4, '0')}</td>
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-4">
                        <img 
                          src={vehicle.imageUrl || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=150"} 
                          alt="" 
                          className="w-16 h-12 rounded-lg object-cover bg-muted"
                        />
                        <div>
                          <p className="font-bold text-base mb-0.5">{vehicle.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                             <div className="flex items-center gap-1"><Fuel className="w-3 h-3 text-primary" /> {vehicle.type}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-4">
                         <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Kapasitas</span>
                            <span className="font-bold text-foreground flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-secondary" /> {vehicle.capacity} Orang</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Transmisi</span>
                            <span className="font-bold text-foreground flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-secondary" /> Matic/Manual</span>
                         </div>
                      </div>
                    </td>
                    <td className="py-4 px-8">
                      <p className="text-lg font-black text-primary">{formatRupiah(dailyPrice(vehicle))}</p>
                    </td>
                    <td className="py-4 px-8">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditForm(vehicle)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(vehicle.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredVehicles?.length && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      <CarFront className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Tidak ada kendaraan yang cocok dengan pencarian Anda.</p>
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
              {editingVehicle ? "Edit Kendaraan" : "Tambah Kendaraan Baru"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Nama Kendaraan</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                    placeholder="Cth: Toyota Innova Zenix"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Tipe / Kelas</label>
                  <input 
                    type="text" 
                    required
                    value={formData.type}
                    onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                    placeholder="Cth: MPV Premium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Harga Sewa / Hari (Rp)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Kapasitas (Orang)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={e => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm pr-12"
                    />
                    <Users className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
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
                    placeholder="Jelaskan kondisi dan fitur kendaraan..."
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Tersedia untuk disewa</span>
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
                {isMutating ? "Menyimpan…" : editingVehicle ? "Simpan Perubahan" : "Tambah Kendaraan"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

