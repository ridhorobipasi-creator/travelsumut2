import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetAdminStats } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatRupiah } from "@/lib/utils";
import { ShoppingCart, Wallet, Compass, CarFront, Users } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  if (isLoading) {
    return <AdminLayout><LoadingSpinner /></AdminLayout>;
  }

  const statCards = [
    { title: "Total Pendapatan", value: formatRupiah(stats?.totalRevenue || 0), icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Total Pesanan", value: stats?.totalBookings || 0, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Pesanan Aktif", value: stats?.activeBookings || 0, icon: Users, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Paket Wisata", value: stats?.totalPackages || 0, icon: Compass, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Permintaan Trip", value: stats?.totalCustomTrips || 0, icon: CarFront, color: "text-rose-600", bg: "bg-rose-100" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Ringkasan performa platform Wisata Indonesia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl shadow-sm border border-border flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border p-6">
          <h2 className="text-xl font-bold mb-6">Pesanan Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm">
                  <th className="pb-3 font-semibold">ID</th>
                  <th className="pb-3 font-semibold">Pelanggan</th>
                  <th className="pb-3 font-semibold">Tipe</th>
                  <th className="pb-3 font-semibold">Tanggal</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats?.recentBookings?.map((booking) => (
                  <tr key={booking.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-4 font-mono text-xs">#{booking.id}</td>
                    <td className="py-4 font-medium">{booking.customerName}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                        {booking.type}
                      </span>
                    </td>
                    <td className="py-4">{format(new Date(booking.startDate), 'dd MMM yyyy')}</td>
                    <td className="py-4 font-bold">{formatRupiah(booking.totalPrice)}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!stats?.recentBookings?.length && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">Belum ada pesanan</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 flex flex-col justify-center items-center text-center">
           <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
             <img src={`${import.meta.env.BASE_URL}images/logo-wisata.png`} alt="Logo" className="w-16 h-16 object-contain" />
           </div>
           <h3 className="font-bold text-xl mb-2">Sistem Siap</h3>
           <p className="text-muted-foreground text-sm mb-6">Semua servis berjalan normal. Anda bisa mengelola konten dan pesanan melalui menu di samping.</p>
           <button className="w-full bg-primary text-white py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors">
             Lihat Laporan Lengkap
           </button>
        </div>
      </div>
    </AdminLayout>
  );
}
