import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetBookings, useUpdateBooking } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatRupiah, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Search, Filter } from "lucide-react";

export default function AdminOrders() {
  const { data: bookings, isLoading, refetch } = useGetBookings();
  const { mutate: updateBooking } = useUpdateBooking();
  const { toast } = useToast();

  const handleStatusUpdate = (id: number, status: string) => {
    updateBooking({ id, data: { status } }, {
      onSuccess: () => {
        toast({ title: `Status diperbarui ke ${status}` });
        refetch();
      }
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Kelola Pesanan</h1>
          <p className="text-muted-foreground mt-1">Daftar booking paket wisata dan rental mobil.</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari pesanan (Nama, Email)..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-border bg-white rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
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
                {bookings?.map((booking) => (
                  <tr key={booking.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
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
                        {booking.type === 'package' ? booking.package?.title : booking.vehicle?.name || `Item #${booking.packageId || booking.vehicleId}`}
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
                        <button className="px-3 py-1.5 border border-border rounded-md text-xs font-bold hover:bg-muted transition-colors">
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!bookings?.length && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      Tidak ada pesanan ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
