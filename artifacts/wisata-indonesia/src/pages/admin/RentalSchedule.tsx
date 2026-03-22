import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState } from "react";
import { Plus, Edit, Trash2, Car, Search, Search as SearchIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MOCK_RESERVES = [
  { id: 1, vehicleName: "Toyota Hiace Commuter 15 Seat", date: "2026-04-10", renter: "Budi Santoso", status: "booked", rentDays: 3, notes: "Penjemputan KNO jam 09:00" },
  { id: 2, vehicleName: "Toyota Innova Reborn", date: "2026-04-12", renter: "Sarah Wijaya", status: "booked", rentDays: 1, notes: "City tour Medan" },
  { id: 3, vehicleName: "Toyota Avanza", date: "2026-04-15", renter: "Alex Chandra", status: "maintenance", rentDays: 2, notes: "Ganti oli dan servis rutin" },
  { id: 4, vehicleName: "Hiace Premio Premium", date: "2026-05-01", renter: "PT Maju Jaya", status: "booked", rentDays: 5, notes: "Corporate gathering Berastagi" },
  { id: 5, vehicleName: "Isuzu Elf Long", date: "2026-05-02", renter: "SMA Negeri 1", status: "available", rentDays: 0, notes: "Jadwal kosong (dibatalkan H-7)" },
];

const emptyForm = { vehicleName: "", date: "", renter: "", status: "booked", rentDays: 1, notes: "" };

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  booked: { label: "Disewa / Jalan", color: "bg-emerald-100 text-emerald-700" },
  maintenance: { label: "Perawatan/Bengkel", color: "bg-rose-100 text-rose-700" },
  available: { label: "Tersedia Kosong", color: "bg-gray-100 text-gray-700" },
};

export default function RentalSchedule() {
  const [reserves, setReserves] = useState(MOCK_RESERVES);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReserve, setEditingReserve] = useState<typeof MOCK_RESERVES[0] | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = reserves.filter((r) => {
    const matchSearch = r.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) || r.renter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditingReserve(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (reserve: typeof MOCK_RESERVES[0]) => {
    setEditingReserve(reserve);
    setFormData({ ...reserve });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus jadwal pemblokiran/reservasi armada ini?")) {
      setReserves((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleStatusChange = (id: number, status: string) => {
    setReserves((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReserve) {
      setReserves((prev) => prev.map((r) => r.id === editingReserve.id ? { ...r, ...formData } : r));
    } else {
      setReserves((prev) => [...prev, { id: Math.max(...prev.map(r => r.id), 0) + 1, ...formData }]);
    }
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-display font-bold flex items-center gap-3">
             <Car className="w-8 h-8 text-primary" /> Jadwal Armada (Rental)
           </h1>
           <p className="text-muted-foreground mt-1">Sistem kalender & pemblokiran ketersediaan kendaraan rental transport.</p>
        </div>
        <button
           onClick={openAdd}
           className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" /> Blokir Jadwal / Reservasi Baru
        </button>
      </div>

       <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari armada atau penyewa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:border-primary"
          >
             <option value="all">Semua Kondisi/Status</option>
             {Object.keys(STATUS_LABELS).map(k => <option key={k} value={k}>{STATUS_LABELS[k].label}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-sm bg-muted/5">
                <th className="py-4 px-6 font-semibold w-[280px]">Nama Kendaraan</th>
                <th className="py-4 px-6 font-semibold">Tgl Ambil & Durasi</th>
                <th className="py-4 px-6 font-semibold">Nama Penyewa / PIC</th>
                <th className="py-4 px-6 font-semibold">Tipe Blokir Status</th>
                <th className="py-4 px-6 font-semibold text-right w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((reserve) => {
                 const statusInfo = STATUS_LABELS[reserve.status];
                 
                 // Simpel calculate endDate mock
                 const d = new Date(reserve.date);
                 d.setDate(d.getDate() + (reserve.rentDays - 1));
                 const endStr = isNaN(d.getTime()) ? "" : d.toISOString().split('T')[0];
                 
                 return (
                <tr key={reserve.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-foreground text-base mb-0.5">{reserve.vehicleName}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight italic line-clamp-1">{reserve.notes || '-'}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-foreground text-[14px]">{reserve.date} <span className="text-muted-foreground text-[11px] ml-1">sd</span> {endStr}</div>
                    <div className="text-xs text-primary font-bold mt-0.5">({reserve.rentDays} Hari Pemakaian)</div>
                  </td>
                  <td className="py-4 px-6 text-foreground font-semibold">
                    {reserve.renter || <span className="text-muted-foreground italic font-normal">Internal/Owner</span>}
                  </td>
                  <td className="py-4 px-6">
                     <select
                        value={reserve.status}
                        onChange={(e) => handleStatusChange(reserve.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider leading-none border-none outline-none appearance-none cursor-pointer w-[160px] ${statusInfo.color}`}
                        style={{ textAlignLast: 'center' }}
                      >
                         {Object.keys(STATUS_LABELS).map(k => <option key={k} value={k} className="bg-white text-foreground uppercase">{STATUS_LABELS[k].label}</option>)}
                      </select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(reserve)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Reservasi Blokir">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(reserve.id)} className={`p-2 rounded-lg transition-colors text-rose-600 hover:bg-rose-50`} title="Hapus Blokir Jadwal">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                 )
              })}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={6} className="py-12 text-center text-muted-foreground font-medium">
                     <Car className="w-12 h-12 mx-auto mb-3 opacity-20" />
                     Tidak ada reservasi untuk jadwal tsb.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              {editingReserve ? "Ubah Detail Reservasi Rental" : "Blokir Tgl Armada Baru"}
            </DialogTitle>
          </DialogHeader>
          <form id="reserveForm" onSubmit={handleSubmit} className="space-y-6 py-2 mt-2">
             <div className="grid grid-cols-2 gap-6">
               <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1.5 text-foreground">Pilih Kendaraan Yg Dibooking</label>
                  <select
                     required
                     value={formData.vehicleName}
                     onChange={(e) => {
                        setFormData((p) => ({ ...p, vehicleName: e.target.value }))
                     }}
                     className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm font-semibold"
                  >
                     <option value="" disabled>--- Pilih Armada ---</option>
                     <option value="Toyota Hiace Commuter 15 Seat">Toyota Hiace Commuter 15 Seat</option>
                     <option value="Hiace Premio Premium">Hiace Premio Premium</option>
                     <option value="Isuzu Elf Long">Isuzu Elf Long</option>
                     <option value="Toyota Innova Reborn">Toyota Innova Reborn</option>
                     <option value="Toyota Avanza">Toyota Avanza</option>
                  </select>
               </div>

                <div>
                   <label className="block text-sm font-bold mb-2 text-foreground">Tgl Mulai Pakai (Pick-up)</label>
                   <input
                     required
                     type="date"
                     value={formData.date}
                     onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                     className="w-full px-4 py-2.5 rounded-xl bg-white border border-border focus:border-primary outline-none transition-all text-sm"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold mb-2 text-foreground">Durasi Rental (Hari)</label>
                   <input
                     required
                     type="number"
                     min="1"
                     value={formData.rentDays}
                     onChange={(e) => setFormData((p) => ({ ...p, rentDays: Number(e.target.value) }))}
                     className="w-full px-4 py-2.5 rounded-xl bg-white border border-border focus:border-primary outline-none transition-all text-sm font-mono"
                   />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold mb-1.5 text-foreground">Penyewa (Tamu/User)</label>
                   <input
                     required={formData.status === 'booked'}
                     type="text"
                     value={formData.renter}
                     onChange={(e) => setFormData((p) => ({ ...p, renter: e.target.value }))}
                     className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                     placeholder="Nama Tamu/PT (Kosongkan bila maintenance)"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold mb-1.5 text-foreground">Tipe / Status Blokir Armada</label>
                   <select
                      value={formData.status}
                      onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm font-semibold"
                   >
                      <option value="booked">Dirental Tamu (Booked/Jalan)</option>
                      <option value="maintenance">Diblokir (Bengkel/Cuci Mobil)</option>
                      <option value="available">Bebaskan Jadwal (Cancel/Kosong)</option>
                   </select>
                </div>
             </div>

             <div>
                <label className="block text-sm font-bold mb-1.5 text-foreground">Catatan / Detail Trip</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm resize-none"
                  placeholder="Ex. Jemput KNO jam 9 Pagi flight Citilink. Titik drop Parapat..."
                />
             </div>
          </form>
          <DialogFooter className="pt-4 border-t border-border mt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 bg-background border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors mr-2">
              Batal
            </button>
            <button form="reserveForm" type="submit" className="px-7 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
              {editingReserve ? "Simpan Ubahan" : "Konfirmasi Booking Tgl"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
