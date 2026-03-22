import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, Search, MapPin, Search as SearchIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

const MOCK_TRIP_SCHEDULES = [
  { id: 1, packageId: 1, packageTitle: "Eksplorasi Danau Toba", startDate: "2026-04-15", endDate: "2026-04-17", quota: 15, currentBooked: 12, status: "open", guide: "Budi Santoso", priceAdjustment: 0 },
  { id: 2, packageId: 2, packageTitle: "Petualangan Bukit Lawang", startDate: "2026-04-20", endDate: "2026-04-23", quota: 10, currentBooked: 10, status: "full", guide: "Andi Permana", priceAdjustment: 200000 },
  { id: 3, packageId: 3, packageTitle: "Berastagi & Sipiso-piso", startDate: "2026-05-01", endDate: "2026-05-02", quota: 20, currentBooked: 5, status: "open", guide: "Sarah Wijayanto", priceAdjustment: -100000 },
  { id: 4, packageId: 1, packageTitle: "Eksplorasi Danau Toba", startDate: "2026-05-10", endDate: "2026-05-12", quota: 15, currentBooked: 0, status: "draft", guide: "TBA", priceAdjustment: 0 },
];

const emptyForm = { packageId: 1, packageTitle: "Eksplorasi Danau Toba", startDate: "", endDate: "", quota: 10, status: "open", guide: "", priceAdjustment: 0 };

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  open: { label: "Tersedia", color: "bg-emerald-100 text-emerald-700" },
  full: { label: "Penuh (Full Booked)", color: "bg-rose-100 text-rose-700" },
  running: { label: "Sedang Berjalan", color: "bg-blue-100 text-blue-700" },
  ended: { label: "Selesai", color: "bg-gray-100 text-gray-700" },
  draft: { label: "Draft / Rencana", color: "bg-amber-100 text-amber-700" },
};

export default function TripSchedule() {
  const [schedules, setSchedules] = useState(MOCK_TRIP_SCHEDULES);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<typeof MOCK_TRIP_SCHEDULES[0] | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = schedules.filter((s) => {
    const matchSearch = s.packageTitle.toLowerCase().includes(searchQuery.toLowerCase()) || s.guide.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditingSchedule(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (schedule: typeof MOCK_TRIP_SCHEDULES[0]) => {
    setEditingSchedule(schedule);
    setFormData({ ...schedule });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    const schedule = schedules.find(s => s.id === id);
    if (schedule && schedule.currentBooked > 0) {
      return alert("Gagal. Jadwal ini sudah memiliki peserta (" + schedule.currentBooked + " orang). Hubungi peserta atau pindahkan jadwal sebelum menghapus.");
    }
    if (confirm("Yakin hapus jadwal ini?")) {
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleStatusChange = (id: number, status: string) => {
    setSchedules((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSchedule) {
      setSchedules((prev) => prev.map((s) => s.id === editingSchedule.id ? { ...s, ...formData } : s));
    } else {
      setSchedules((prev) => [...prev, { id: Math.max(...prev.map(s => s.id), 0) + 1, ...formData, currentBooked: 0 }]);
    }
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" /> Jadwal Trip (Open Trip)
          </h1>
          <p className="text-muted-foreground mt-1">Management slot dan penjadwalan produk paket wisata.</p>
        </div>
        <button
           onClick={openAdd}
           className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" /> Buat Jadwal / Slot
        </button>
      </div>

       <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama paket atau guide..."
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
             <option value="all">Semua Status</option>
             {Object.keys(STATUS_LABELS).map(k => <option key={k} value={k}>{STATUS_LABELS[k].label}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-sm bg-muted/5">
                <th className="py-4 px-6 font-semibold w-[280px]">Paket Wisata</th>
                <th className="py-4 px-6 font-semibold">Tanggal (Mulai - Selesai)</th>
                <th className="py-4 px-6 font-semibold text-center">Peserta</th>
                <th className="py-4 px-6 font-semibold">Tour Guide</th>
                <th className="py-4 px-6 font-semibold w-36">Status</th>
                <th className="py-4 px-6 font-semibold text-right w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((schedule) => {
                 const statusInfo = STATUS_LABELS[schedule.status];
                 const isFullWarning = schedule.currentBooked >= schedule.quota - 2;
                 return (
                <tr key={schedule.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-foreground text-base mb-0.5">{schedule.packageTitle}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                       Penyesuaian Harga: <span className={schedule.priceAdjustment > 0 ? "text-emerald-600" : schedule.priceAdjustment < 0 ? "text-rose-600" : ""}>{schedule.priceAdjustment > 0 ? `+` : ""}{schedule.priceAdjustment.toLocaleString('id-ID')} IDR</span>
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-primary" />
                       <span className="font-semibold text-foreground text-[13px]">{formatDate(schedule.startDate)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 ml-6">
                       s/d {formatDate(schedule.endDate)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                     <div className="flex flex-col items-center">
                        <div className="flex items-baseline gap-1">
                           <span className={`text-xl font-bold ${schedule.currentBooked >= schedule.quota ? 'text-rose-600' : 'text-primary'}`}>{schedule.currentBooked}</span>
                           <span className="text-xs font-semibold text-muted-foreground">/{schedule.quota}</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
                           <div className={`h-full rounded-full ${schedule.currentBooked >= schedule.quota ? 'bg-rose-500' : isFullWarning ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${(schedule.currentBooked/schedule.quota)*100}%` }}></div>
                        </div>
                     </div>
                  </td>
                  <td className="py-4 px-6 text-foreground font-semibold">
                    {schedule.guide || <span className="text-muted-foreground italic font-normal">Belum ditentukan</span>}
                  </td>
                  <td className="py-4 px-6">
                     <select
                        value={schedule.status}
                        onChange={(e) => handleStatusChange(schedule.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider leading-none border-none outline-none appearance-none cursor-pointer w-full ${statusInfo.color}`}
                        style={{ textAlignLast: 'center' }}
                      >
                         {Object.keys(STATUS_LABELS).map(k => <option key={k} value={k} className="bg-white text-foreground uppercase">{STATUS_LABELS[k].label}</option>)}
                      </select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(schedule)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Jadwal">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(schedule.id)} className={`p-2 rounded-lg transition-colors ${schedule.currentBooked > 0 ? "text-gray-400 cursor-not-allowed" : "text-rose-600 hover:bg-rose-50"}`} title={schedule.currentBooked > 0 ? "Tidak dapat dihapus: Ada peserta" : "Hapus Jadwal"}>
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
                     <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                     Data jadwal tidak ditemukan.
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
              <Calendar className="w-5 h-5 text-primary" />
              {editingSchedule ? "Update Jadwal Keberangkatan" : "Buka Slot / Jadwal Baru"}
            </DialogTitle>
          </DialogHeader>
          <form id="scheduleForm" onSubmit={handleSubmit} className="space-y-6 py-2 mt-2">
             <div>
                <label className="block text-sm font-bold mb-1.5 text-foreground">Paket Wisata Induk</label>
                <select
                   required
                   value={formData.packageId}
                   onChange={(e) => {
                      const sel = e.target.options[e.target.selectedIndex];
                      setFormData((p) => ({ ...p, packageId: Number(e.target.value), packageTitle: sel.text }))
                   }}
                   className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm font-semibold"
                >
                   <option value={1}>Eksplorasi Danau Toba</option>
                   <option value={2}>Petualangan Rimbanya Bukit Lawang</option>
                   <option value={3}>Wisata Dingin Berastagi & Sipiso-piso</option>
                </select>
             </div>
             
             <div className="grid grid-cols-2 gap-6 bg-muted/10 p-5 rounded-xl border border-border">
                <div>
                   <label className="block text-sm font-bold mb-2 text-foreground">Tanggal Keberangkatan</label>
                   <input
                     required
                     type="date"
                     value={formData.startDate}
                     onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                     className="w-full px-4 py-2.5 rounded-xl bg-white border border-border focus:border-primary outline-none transition-all text-sm"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold mb-2 text-foreground">Kapan Perjalanan Berakhir?</label>
                   <input
                     required
                     type="date"
                     value={formData.endDate}
                     min={formData.startDate}
                     onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                     className="w-full px-4 py-2.5 rounded-xl bg-white border border-border focus:border-primary outline-none transition-all text-sm"
                   />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold mb-1.5 text-foreground">Batas Kuota Peserta (Seat)</label>
                   <input
                     required
                     type="number"
                     min="1"
                     value={formData.quota}
                     onChange={(e) => setFormData((p) => ({ ...p, quota: Number(e.target.value) }))}
                     className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold mb-1.5 text-foreground">Status Pendaftaran Awal</label>
                   <select
                      value={formData.status}
                      onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm font-semibold"
                   >
                      <option value="draft">Draft (Disembunyikan)</option>
                      <option value="open">Tersedia (Buka Pendaftaran)</option>
                      <option value="full">Penuh</option>
                   </select>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold mb-1.5 text-foreground">Tour Guide Bertugas</label>
                   <input
                     type="text"
                     value={formData.guide}
                     onChange={(e) => setFormData((p) => ({ ...p, guide: e.target.value }))}
                     className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                     placeholder="Ex. Budi (TBA jika belum ada)"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold mb-1.5 text-foreground flex items-center justify-between">Penyesuaian Harga  <span className="text-[10px] text-muted-foreground font-normal">(vs Harga Dasar)</span></label>
                   <input
                     type="number"
                     step="1000"
                     value={formData.priceAdjustment}
                     onChange={(e) => setFormData((p) => ({ ...p, priceAdjustment: Number(e.target.value) }))}
                     className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                     placeholder="Gunakan minus (-) diskon"
                   />
                   <p className="text-[10px] text-muted-foreground mt-1 leading-snug">Berikan misal -100000 untuk potongan harga khusus batch ini, atau 200000 untuk tambahan krn season libur.</p>
                </div>
             </div>
          </form>
          <DialogFooter className="pt-4 border-t border-border mt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 bg-background border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors mr-2">
              Batal
            </button>
            <button form="scheduleForm" type="submit" className="px-7 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
              {editingSchedule ? "Simpan Jadwal" : "Buat Jadwal Baru"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
