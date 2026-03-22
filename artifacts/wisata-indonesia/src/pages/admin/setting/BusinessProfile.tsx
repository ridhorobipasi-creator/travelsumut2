import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState } from "react";
import { Plus, Edit, Trash2, ListTree, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MOCK_SERVICES = [
  { id: 1, title: "Sewa Mobil & Bus", type: "Transportasi", icon: "Car", isActive: true },
  { id: 2, title: "Custom Tour Suka-suka", type: "Paket Tur", icon: "MapPin", isActive: true },
  { id: 3, title: "Pemesanan Hotel Group", type: "Akomodasi", icon: "Hotel", isActive: true },
  { id: 4, title: "Dokumentasi & Drone", type: "Lain-lain", icon: "Camera", isActive: false },
];

const emptyForm = { title: "", type: "Lain-lain", icon: "Car", isActive: true };

const EXPERTISE_TYPES = ["Transportasi", "Paket Tur", "Akomodasi", "MICE", "Lain-lain"];

export default function BusinessProfile() { 
  // Repurposed to "Data Layanan Jasa/Expertise"
  const [services, setServices] = useState(MOCK_SERVICES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<typeof MOCK_SERVICES[0] | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = services.filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const openAdd = () => {
    setEditingService(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (service: typeof MOCK_SERVICES[0]) => {
    setEditingService(service);
    setFormData({ ...service });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus layanan bisnis ini?")) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      setServices((prev) => prev.map((s) => s.id === editingService.id ? { ...s, ...formData } : s));
    } else {
      setServices((prev) => [...prev, { id: Math.max(...prev.map(s => s.id), 0) + 1, ...formData }]);
    }
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-display font-bold flex items-center gap-3">
             <ListTree className="w-8 h-8 text-primary" /> Detail Layanan Kami
           </h1>
           <p className="text-muted-foreground mt-1">Listing jenis jasa (Expertise) yang ditawarkan perusahaan.</p>
        </div>
        <button
           onClick={openAdd}
           className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" /> Tambah Layanan Baru
        </button>
      </div>

       <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-sm bg-muted/5">
                <th className="py-4 px-6 font-semibold w-24">Ikon</th>
                <th className="py-4 px-6 font-semibold w-[350px]">Layanan Unggulan</th>
                <th className="py-4 px-6 font-semibold">Tipe Kategori</th>
                <th className="py-4 px-6 font-semibold text-center w-28">Status</th>
                <th className="py-4 px-6 font-semibold text-right w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((service) => (
                <tr key={service.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                  <td className="py-4 px-6">
                     <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary font-mono text-xs border border-primary/20">{service.icon}</div>
                  </td>
                  <td className="py-4 px-6 font-bold text-foreground text-base">
                     {service.title}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-muted text-muted-foreground text-[10px] font-bold uppercase rounded-full tracking-wider border border-border">
                      {service.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {service.isActive ? <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded inline-block text-[10px]">AKTIF (LIVE)</span> : <span className="text-gray-500 font-bold bg-gray-100 px-2.5 py-1 rounded inline-block text-[10px]">DRAFT</span>}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity">
                      <button onClick={() => openEdit(service)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(service.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-12 text-center text-muted-foreground font-medium">
                     <ListTree className="w-12 h-12 mx-auto mb-3 opacity-20" />
                     Tidak ada data master layanan.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
              <ListTree className="w-5 h-5 text-primary" />
              {editingService ? "Edit Layanan" : "Tambah Layanan Utama"}
            </DialogTitle>
          </DialogHeader>
          <form id="serviceForm" onSubmit={handleSubmit} className="space-y-4 py-2 mt-2">
            <div>
               <label className="block text-sm font-bold mb-1.5 text-foreground">Nama Label Layanan</label>
               <input
                 required
                 type="text"
                 value={formData.title}
                 onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                 className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
               />
            </div>
            
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold mb-1.5 text-foreground">Kategori Layanan</label>
                  <select
                     value={formData.type}
                     onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                     className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm font-semibold"
                  >
                     {EXPERTISE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-bold mb-1.5 text-foreground">Nama Ikon Lucide</label>
                  <input
                    required
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData((p) => ({ ...p, icon: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm font-mono"
                    placeholder="Contoh: Car, MapPin"
                  />
               </div>
             </div>

             <label className="flex items-center gap-3 bg-muted/30 p-4 border border-border rounded-xl mt-4 cursor-pointer">
                 <input 
                   type="checkbox"
                   checked={formData.isActive}
                   onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                   className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20"
                 />
                 <span className="font-bold text-sm">Tampilkan Layanan Ini di Frontpage</span>
             </label>

          </form>
          <DialogFooter className="pt-4 border-t border-border mt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 bg-background border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors mr-2">
              Batal
            </button>
            <button form="serviceForm" type="submit" className="px-7 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
              Simpan Master
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
