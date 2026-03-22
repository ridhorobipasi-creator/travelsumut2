import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetCustomTrips } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Search, Compass, Eye, Trash2, User, Phone, Mail, Calendar, MapPin, Wallet, MessageSquare, Edit, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatRupiah, formatDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminCustomTrips() {
  const { data: fetchedTrips, isLoading, error } = useGetCustomTrips();
  const [localTrips, setLocalTrips] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Koneksi API Gagal",
        description: "Menampilkan data trip simulasi karena server database belum terhubung.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");

  const [editFormData, setEditFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    destination: "",
    startDate: "",
    participants: 1,
    budget: 0,
  });

  const trips = (fetchedTrips && fetchedTrips.length > 0) ? fetchedTrips : localTrips;

  // Filter logic
  const filteredTrips = trips.filter(trip => {
    if (!trip || !trip.startDate) return false;
    const date = new Date(trip.startDate);
    if (isNaN(date.getTime())) return false;

    const monthMatch = filterMonth === "all" || (date.getMonth() + 1).toString() === filterMonth;
    const yearMatch = filterYear === "all" || date.getFullYear().toString() === filterYear;
    const searchMatch = (trip.customerName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
                       (trip.destination?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    
    return monthMatch && yearMatch && searchMatch;
  });

  const handleDelete = (id: number) => {
    if(confirm("Apakah Anda yakin ingin menghapus permintaan ini?")) {
      setLocalTrips(prev => prev.filter(t => t.id !== id));
      toast({ title: "Berhasil dihapus", description: "Permintaan telah dihapus." });
    }
  };

  const openDetail = (trip: any) => {
    setSelectedTrip(trip);
    setIsDetailOpen(true);
  };

  const openEdit = (trip: any) => {
    setSelectedTrip(trip);
    setEditFormData({
      customerName: trip.customerName || "",
      customerEmail: trip.customerEmail || "",
      customerPhone: trip.customerPhone || "",
      destination: trip.destination || "",
      startDate: trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : "",
      participants: trip.participants || 1,
      budget: trip.budget || 0,
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip) return;

    setLocalTrips(prev => prev.map(t => t.id === selectedTrip.id ? { 
      ...t, 
      ...editFormData,
      startDate: editFormData.startDate ? new Date(editFormData.startDate).toISOString() : t.startDate
    } : t));

    toast({ title: "Berhasil diperbarui", description: "Data permintaan telah diperbarui." });
    setIsEditOpen(false);
  };

  // Filter options
  const years = Array.from(
    new Set(
      trips
        .map((t) => (t.startDate ? new Date(t.startDate).getFullYear() : null))
        .filter((y): y is number => y !== null && !isNaN(y)),
    ),
  ).sort((a, b) => b - a);
  const months = [
    { value: "1", label: "Januari" }, { value: "2", label: "Februari" }, { value: "3", label: "Maret" },
    { value: "4", label: "April" }, { value: "5", label: "Mei" }, { value: "6", label: "Juni" },
    { value: "7", label: "Juli" }, { value: "8", label: "Agustus" }, { value: "9", label: "September" },
    { value: "10", label: "Oktober" }, { value: "11", label: "November" }, { value: "12", label: "Desember" }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Kelola Custom Trip</h1>
          <p className="text-muted-foreground mt-1">Daftar permintaan paket wisata khusus dari pelanggan.</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex flex-wrap gap-4">
          <div className="relative max-w-sm flex-1 min-w-[200px]">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari permintaan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>

          <div className="flex gap-2">
            <select 
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-4 py-2.5 border border-border bg-white rounded-lg text-sm font-medium focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer pr-10 relative"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="all">Semua Bulan</option>
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>

            <select 
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-2.5 border border-border bg-white rounded-lg text-sm font-medium focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer pr-10 relative"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="all">Semua Tahun</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {isLoading && !trips.length ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm bg-muted/10">
                  <th className="py-4 px-8 font-semibold w-24">ID</th>
                  <th className="py-4 px-8 font-semibold">Pelanggan</th>
                  <th className="py-4 px-8 font-semibold">Destinasi & Tanggal</th>
                  <th className="py-4 px-8 font-semibold">Budget & Peserta</th>
                  <th className="py-4 px-8 font-semibold">Status</th>
                  <th className="py-4 px-8 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredTrips?.map((trip) => (
                  <tr key={trip.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                    <td className="py-4 px-8 text-muted-foreground font-mono">#{trip.id.toString().padStart(5, '0')}</td>
                    <td className="py-4 px-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                          <User className="w-4 h-4 text-primary" /> {trip.customerName}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" /> {trip.customerPhone}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" /> {trip.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-bold text-foreground uppercase tracking-wide text-xs">
                          <MapPin className="w-4 h-4 text-secondary" /> {trip.destination}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
  <Calendar className="w-3.5 h-3.5" /> {formatDate(trip.startDate)}
</div>
                      </div>
                    </td>
                    <td className="py-4 px-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-bold text-primary">
                          <Wallet className="w-4 h-4" /> {trip.budget ? formatRupiah(trip.budget) : 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                          <Compass className="w-3.5 h-3.5" /> {trip.participants} Peserta
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-8">
                      <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">Baru</span>
                    </td>
                    <td className="py-4 px-8">
                      <div className="flex items-center justify-end gap-2">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(trip)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openDetail(trip)}
                            className="p-1.5 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                            title="Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(trip.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredTrips?.length && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <Filter className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Tidak ada permintaan custom trip ditemukan dengan filter ini.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">Edit Permintaan Trip</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1.5">Nama Pelanggan</label>
                <input 
                  type="text" required
                  value={editFormData.customerName}
                  onChange={e => setEditFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5">Telepon</label>
                  <input 
                    type="text" required
                    value={editFormData.customerPhone}
                    onChange={e => setEditFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">Email</label>
                  <input 
                    type="email" required
                    value={editFormData.customerEmail}
                    onChange={e => setEditFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">Destinasi</label>
                <input 
                  type="text" required
                  value={editFormData.destination}
                  onChange={e => setEditFormData(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5">Tanggal</label>
                  <input 
                    type="date" required
                    value={editFormData.startDate}
                    onChange={e => setEditFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">Peserta</label>
                  <input 
                    type="number" required
                    value={editFormData.participants}
                    onChange={e => setEditFormData(prev => ({ ...prev, participants: Number(e.target.value) }))}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">Budget</label>
                <input 
                  type="number" required
                  value={editFormData.budget}
                  onChange={e => setEditFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none"
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <button type="button" onClick={() => setIsEditOpen(false)} className="px-6 py-2 bg-muted rounded-xl font-bold text-sm">Batal</button>
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm">Simpan</button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">Detail Permintaan Custom Trip</DialogTitle>
          </DialogHeader>
          
          {selectedTrip && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Informasi Pelanggan</h4>
                  <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-bold">{selectedTrip.customerName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-sm">{selectedTrip.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-sm">{selectedTrip.customerPhone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Rencana Perjalanan</h4>
                  <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span className="font-bold uppercase tracking-tight text-xs">{selectedTrip.destination}</span>
                    </div>
                    <div className="flex items-center gap-3">
  <Calendar className="w-4 h-4 text-primary" />
  <span className="text-sm font-medium">{formatDate(selectedTrip.startDate)}</span>
</div>
                    <div className="flex items-center gap-3">
                      <Compass className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{selectedTrip.participants} Orang Peserta</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Budget & Catatan</h4>
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase text-muted-foreground">Estimasi Budget</span>
                      <span className="text-xl font-black text-primary">{selectedTrip.budget ? formatRupiah(selectedTrip.budget) : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-1" />
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Kebutuhan Khusus</p>
                        <p className="text-sm text-foreground leading-relaxed italic">
                          {selectedTrip.requirements || "Tidak ada catatan khusus."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                   <a 
                    href={`https://wa.me/${selectedTrip.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${selectedTrip.customerName}, saya dari Wisata Sumut ingin menanggapi permintaan custom trip Anda ke ${selectedTrip.destination}...`)}`}
                    target="_blank"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                   >
                     <Phone className="w-4 h-4" /> Hubungi via WhatsApp
                   </a>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-start">
            <button 
              onClick={() => setIsDetailOpen(false)}
              className="px-6 py-2.5 bg-muted text-muted-foreground font-bold rounded-xl hover:bg-muted/80 transition-colors"
            >
              Tutup
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

