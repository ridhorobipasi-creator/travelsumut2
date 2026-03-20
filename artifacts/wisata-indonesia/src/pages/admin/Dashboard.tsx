import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetAdminStats } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatRupiah } from "@/lib/utils";
import { ShoppingCart, Wallet, Compass, CarFront, Users, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  if (isLoading) {
    return <AdminLayout><div className="flex h-full items-center justify-center"><LoadingSpinner /></div></AdminLayout>;
  }

  const statCards = [
    { title: "Total Pendapatan", value: formatRupiah(stats?.totalRevenue || 0), icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", trend: "+12.5%" },
    { title: "Total Pesanan", value: stats?.totalBookings || 0, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50 border-blue-100", trend: "+5.2%" },
    { title: "Pesanan Aktif", value: stats?.activeBookings || 0, icon: Users, color: "text-amber-600", bg: "bg-amber-50 border-amber-100", trend: "0%" },
    { title: "Paket Wisata", value: stats?.totalPackages || 0, icon: Compass, color: "text-purple-600", bg: "bg-purple-50 border-purple-100", trend: "+2" },
    { title: "Permintaan Trip", value: stats?.totalCustomTrips || 0, icon: CarFront, color: "text-rose-600", bg: "bg-rose-50 border-rose-100", trend: "+8.1%" },
  ];

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-foreground">Dashboard WisataSumut</h1>
        <p className="text-muted-foreground mt-2 text-lg">Ringkasan performa platform pariwisata Sumatera Utara hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <div key={i} className={`bg-card p-6 rounded-2xl shadow-soft border ${stat.bg} flex flex-col`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-sm ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3" /> {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card rounded-3xl shadow-soft border border-border overflow-hidden">
          <div className="p-8 border-b border-border/50 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-display font-bold">Pesanan Terbaru</h2>
              <p className="text-muted-foreground mt-1">Transaksi wisata di Sumatera Utara</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-sm uppercase tracking-wider">
                  <th className="py-4 px-8 font-bold">ID</th>
                  <th className="py-4 px-8 font-bold">Pelanggan</th>
                  <th className="py-4 px-8 font-bold">Tipe</th>
                  <th className="py-4 px-8 font-bold">Tanggal</th>
                  <th className="py-4 px-8 font-bold">Total</th>
                  <th className="py-4 px-8 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats?.recentBookings?.map((booking) => (
                  <tr key={booking.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-5 px-8 font-mono text-xs font-medium text-muted-foreground">#{booking.id.toString().padStart(5, '0')}</td>
                    <td className="py-5 px-8 font-bold text-foreground">{booking.customerName}</td>
                    <td className="py-5 px-8">
                      <span className="px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                        {booking.type}
                      </span>
                    </td>
                    <td className="py-5 px-8 font-medium">{format(new Date(booking.startDate), 'dd MMM yyyy', { locale: id })}</td>
                    <td className="py-5 px-8 font-extrabold text-primary">{formatRupiah(booking.totalPrice)}</td>
                    <td className="py-5 px-8 text-center">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${
                        booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {booking.status === 'confirmed' ? 'Dikonfirmasi' : booking.status === 'pending' ? 'Menunggu' : 'Dibatalkan'}
                      </span>
                    </td>
                  </tr>
                ))}
                {!stats?.recentBookings?.length && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground font-medium">Belum ada pesanan terbaru</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-3xl shadow-soft border border-border p-8 flex flex-col justify-center items-center text-center">
           <div className="w-28 h-28 rounded-full bg-primary/5 flex items-center justify-center mb-8 relative">
             <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-[spin_10s_linear_infinite]" />
             <Compass className="w-12 h-12 text-primary" />
           </div>
           <h3 className="font-display font-bold text-2xl mb-3">Sistem Optimal</h3>
           <p className="text-muted-foreground text-base mb-8 px-4 leading-relaxed">
             Server API Sumatera Utara berjalan dengan baik. Layanan pemesanan dan manajemen konten siap digunakan.
           </p>
           <button className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-soft hover:shadow-soft-lg">
             Unduh Laporan Bulanan
           </button>
        </div>
      </div>
    </AdminLayout>
  );
}
