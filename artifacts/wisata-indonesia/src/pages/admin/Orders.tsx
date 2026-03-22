import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetBookings, useUpdateBooking, getGetBookingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatRupiah, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Search, Filter, User, Mail, Phone, Calendar, Package, Car, Edit } from "lucide-react";
import { MOCK_ADMIN_STATS } from "@/lib/mockData";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const { data: fetchedBookings, isLoading, error } = useGetBookings();
  const updateBooking = useUpdateBooking();
  const [localBookings, setLocalBookings] = useState(MOCK_ADMIN_STATS.recentBookings || []);
  const { toast } = useToast();
  
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
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
    status: "",
    startDate: "",
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Koneksi API Gagal",
        description: "Menampilkan data simulasi (mock) karena server database belum terhubung.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // if (error) {
  //   const errorDetail = (error as any)?.response?.data?.message || (error as any)?.message || "Terjadi kesalahan saat memuat data.";
  //   return (
  //     <AdminLayout>
  //       <div className="p-8 text-rose-600 bg-rose-50 rounded-xl border border-rose-100">
  //         <h2 className="font-bold text-xl mb-2">Error Loading Bookings</h2>
  //         <p className="font-mono text-sm">{errorDetail}</p>
  //       </div>
  //     </AdminLayout>
  //   );
  // }

  const bookings =
    error || fetchedBookings === undefined
      ? (Array.isArray(localBookings) ? localBookings : [])
      : fetchedBookings;

  // Safe Filter logic
  const filteredBookings = bookings.filter(booking => {
    if (!booking) return false;
    const name = booking.customerName?.toLowerCase() || "";
    const email = booking.customerEmail?.toLowerCase() || "";
    const search = searchQuery.toLowerCase();
    
    const searchMatch = name.includes(search) || email.includes(search);
    if (!searchMatch) return false;

    if (!booking.startDate) return filterMonth === "all" && filterYear === "all";
    
    const date = new Date(booking.startDate);
    if (isNaN(date.getTime())) return filterMonth === "all" && filterYear === "all";
    
    const monthMatch = filterMonth === "all" || (date.getMonth() + 1).toString() === filterMonth;
    const yearMatch = filterYear === "all" || date.getFullYear().toString() === filterYear;
    
    return monthMatch && yearMatch;
  });

  const handleStatusUpdate = async (id: number, status: string) => {
    if (error) {
      setLocalBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      toast({
        title: `Status diperbarui ke ${status}`,
        description: "Perubahan disimpan secara lokal (mode simulasi).",
      });
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking((prev: any) => ({ ...prev, status }));
      }
      return;
    }

    try {
      await updateBooking.mutateAsync({
        id,
        data: { status },
      });
      await queryClient.invalidateQueries({ queryKey: getGetBookingsQueryKey() });
      toast({
        title: `Status diperbarui ke ${status}`,
        description: "Perubahan tersimpan di server.",
      });
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking((prev: any) => ({ ...prev, status }));
      }
    } catch {
      toast({
        title: "Gagal memperbarui status",
        description: "Periksa koneksi API atau coba lagi.",
        variant: "destructive",
      });
    }
  };

  const openDetail = (booking: any) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const openEdit = (booking: any) => {
    setSelectedBooking(booking);
    setEditFormData({
      customerName: booking.customerName || "",
      customerEmail: booking.customerEmail || "",
      customerPhone: booking.customerPhone || "",
      status: booking.status || "pending",
      startDate: booking.startDate ? new Date(booking.startDate).toISOString().split('T')[0] : "",
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    const startIso = editFormData.startDate
      ? new Date(editFormData.startDate).toISOString()
      : selectedBooking.startDate;

    if (error) {
      setLocalBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id
            ? { ...b, ...editFormData, startDate: startIso }
            : b,
        ),
      );
      toast({ title: "Berhasil diperbarui", description: "Data pesanan (mode simulasi)." });
      setIsEditOpen(false);
      return;
    }

    try {
      await updateBooking.mutateAsync({
        id: selectedBooking.id,
        data: {
          status: editFormData.status,
          customerName: editFormData.customerName,
          customerEmail: editFormData.customerEmail,
          customerPhone: editFormData.customerPhone || null,
          startDate: startIso,
        },
      });
      await queryClient.invalidateQueries({ queryKey: getGetBookingsQueryKey() });
      toast({ title: "Berhasil diperbarui", description: "Data pesanan tersimpan di server." });
      setIsEditOpen(false);
    } catch {
      toast({
        title: "Gagal menyimpan",
        description: "Periksa koneksi API atau data yang dimasukkan.",
        variant: "destructive",
      });
    }
  };

  // Get unique years from bookings for filter
  const years = Array.from(new Set(bookings
    .map(b => b && b.startDate ? new Date(b.startDate).getFullYear() : null)
    .filter((y): y is number => y !== null && !isNaN(y))
  )).sort((a, b) => b - a);
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
          <h1 className="text-3xl font-display font-bold">Kelola Pesanan</h1>
          <p className="text-muted-foreground mt-1">Daftar booking paket wisata dan rental mobil.</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex flex-wrap gap-4">
          <div className="relative max-w-sm flex-1 min-w-[200px]">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari pesanan (Nama, Email)..." 
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

        {isLoading ? (
          <LoadingSpinner className="my-12" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm bg-muted/10">
                  <th className="py-4 px-6 font-semibold w-16">ID</th>
                  <th className="py-4 px-6 font-semibold">Customer</th>
                  <th className="py-4 px-6 font-semibold">Tipe & Item</th>
                  <th className="py-4 px-6 font-semibold">Tanggal Mulai</th>
                  <th className="py-4 px-6 font-semibold">Total Harga</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredBookings?.map((booking) => (
                  <tr key={booking.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                    <td className="py-4 px-6 font-mono text-muted-foreground">#{booking.id}</td>
                    <td className="py-4 px-6">
                      <p className="font-bold">{booking.customerName}</p>
                      <p className="text-xs text-muted-foreground">{booking.customerEmail}</p>
                      <p className="text-xs text-muted-foreground">{booking.customerPhone}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${booking.type === 'package' ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-700'}`}>
                        {booking.type}
                      </span>
                      <p className="font-medium line-clamp-1">
                        {booking.type === 'package' ? booking.package?.title : (booking.vehicle?.name || "Layanan Wisata")}
                      </p>
                    </td>
                    <td className="py-4 px-6">{formatDate(booking.startDate)}</td>
                    <td className="py-4 px-6 font-bold text-primary">{formatRupiah(booking.totalPrice)}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        booking.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(booking)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          {booking.status === 'pending' && (
                            <>
                              <button onClick={() => handleStatusUpdate(booking.id, 'confirmed')} className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-md transition-colors" title="Konfirmasi">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleStatusUpdate(booking.id, 'cancelled')} className="p-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-md transition-colors" title="Batalkan">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                        <button 
                          onClick={() => openDetail(booking)}
                          className="px-3 py-1.5 border border-border rounded-md text-xs font-bold hover:bg-muted transition-colors"
                        >
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredBookings?.length && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      <Filter className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Tidak ada pesanan ditemukan dengan filter ini.</p>
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
            <DialogTitle className="text-2xl font-display font-bold">Edit Pesanan #{selectedBooking?.id}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1.5">Nama Pelanggan</label>
                <input 
                  type="text" 
                  required
                  value={editFormData.customerName}
                  onChange={e => setEditFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">Email</label>
                <input 
                  type="email" 
                  required
                  value={editFormData.customerEmail}
                  onChange={e => setEditFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">Telepon</label>
                <input 
                  type="text" 
                  required
                  value={editFormData.customerPhone}
                  onChange={e => setEditFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5">Status</label>
                  <select 
                    value={editFormData.status}
                    onChange={e => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none appearance-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">Tanggal Mulai</label>
                  <input 
                    type="date" 
                    required
                    value={editFormData.startDate}
                    onChange={e => setEditFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <button type="button" onClick={() => setIsEditOpen(false)} className="px-6 py-2 bg-muted rounded-xl font-bold">Batal</button>
              <button
                type="submit"
                disabled={updateBooking.isPending}
                className="px-6 py-2 bg-primary text-white rounded-xl font-bold disabled:opacity-60"
              >
                {updateBooking.isPending ? "Menyimpan…" : "Simpan"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">Detail Pesanan #{selectedBooking?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Informasi Pelanggan</h4>
                  <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-bold">{selectedBooking.customerName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-sm">{selectedBooking.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-sm">{selectedBooking.customerPhone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Status Pesanan</h4>
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    selectedBooking.status === 'confirmed' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                    selectedBooking.status === 'cancelled' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                    'bg-amber-50 border-amber-100 text-amber-700'
                  }`}>
                    <span className="font-bold uppercase tracking-widest text-xs">{selectedBooking.status}</span>
                    {selectedBooking.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')} className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')} className="p-1.5 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Detail Layanan</h4>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-4">
                    <div className="flex items-start gap-3">
                      {selectedBooking.type === 'package' ? <Package className="w-5 h-5 text-secondary shrink-0 mt-1" /> : <Car className="w-5 h-5 text-secondary shrink-0 mt-1" />}
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{selectedBooking.type === 'package' ? 'Paket Wisata' : 'Rental Mobil'}</p>
                        <p className="font-bold text-foreground leading-tight">{selectedBooking.type === 'package' ? selectedBooking.package?.title : (selectedBooking.vehicle?.name || "Layanan Wisata")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div className="text-sm">
                        <span className="text-muted-foreground">Mulai: </span>
                        <span className="font-bold">{formatDate(selectedBooking.startDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Rincian Biaya</h4>
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Pembayaran</span>
                      <span className="text-xl font-black text-primary">{formatRupiah(selectedBooking.totalPrice)}</span>
                    </div>
                  </div>
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

