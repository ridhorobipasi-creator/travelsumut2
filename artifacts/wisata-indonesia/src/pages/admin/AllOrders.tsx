import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetBookings } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatRupiah, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function AllOrders() {
  const { data: fetchedBookings, isLoading, error, refetch } = useGetBookings();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (error) {
      toast({
        title: "Gagal memuat data",
        description: "Tidak dapat mengambil data pesanan.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const bookings = Array.isArray(fetchedBookings) ? fetchedBookings : [];
  const filteredBookings = bookings.filter((b) => {
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    const matchSearch =
      b.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Yakin hapus pesanan ini?")) {
      toast({ title: "Pesanan dihapus" });
      refetch();
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Semua Pesanan</h1>
        <p className="text-muted-foreground mt-1">Daftar lengkap semua pesanan user.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Cari nama/email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-48 px-4 py-2 rounded-lg border border-border bg-white text-sm"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="done">Selesai</option>
          <option value="cancelled">Batal</option>
        </select>
      </div>
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-x-auto">
        {isLoading ? (
          <LoadingSpinner className="my-12" />
        ) : (
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-sm bg-muted/10">
                <th className="py-4 px-6 font-semibold">ID</th>
                <th className="py-4 px-6 font-semibold">Nama</th>
                <th className="py-4 px-6 font-semibold">Email</th>
                <th className="py-4 px-6 font-semibold">Tanggal</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Total</th>
                <th className="py-4 px-6 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-6">#{b.id}</td>
                  <td className="py-4 px-6">{b.customerName}</td>
                  <td className="py-4 px-6">{b.customerEmail}</td>
                  <td className="py-4 px-6">{formatDate(b.startDate)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${b.status === "done" ? "bg-emerald-100 text-emerald-700" : b.status === "cancelled" ? "bg-rose-100 text-rose-700" : "bg-muted text-muted-foreground"}`}>{b.status}</span>
                  </td>
                  <td className="py-4 px-6 font-bold">{formatRupiah((b as any).total || 0)}</td>
                  <td className="py-4 px-6">
                    <button
                      className="text-rose-600 hover:underline mr-2"
                      onClick={() => handleDelete(b.id)}
                    >
                      Hapus
                    </button>
                    {/* <button className="text-primary hover:underline">Detail</button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
