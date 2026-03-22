import { AdminLayout } from "@/components/layout/AdminLayout";
import { Link } from "wouter";
import { 
  CalendarCheck,
  Calendar,
  Car,
  PenTool,
  Clock,
  ArrowRight
} from "lucide-react";

export default function OrderSchedule() {
  const scheduleMenu = [
    {
      title: "Jadwal Open Trip",
      desc: "Manajemen slot tanggal ketersediaan paket wisata, kuota peserta, dan penetapan pemandu wisata.",
      icon: Calendar,
      href: "/admin/trip-schedule",
      color: "text-emerald-500",
      bgColor: "bg-emerald-100/50"
    },
    {
      title: "Kalender Sewa Mobil",
      desc: "Blokir tanggal reservasi untuk armada rental agar tidak terjadi tumpang tindih pesanan di frontpage.",
      icon: Car,
      href: "/admin/rental-schedule",
      color: "text-rose-500",
      bgColor: "bg-rose-100/50"
    },
    {
      title: "Custom Trip Masuk",
      desc: "Tangani permintaan itinerary khusus yang diminta oleh tamu. Balas dan konversi menjadi invoice/booking.",
      icon: PenTool,
      href: "/admin/custom-trip-requests",
      color: "text-blue-500",
      bgColor: "bg-blue-100/50"
    }
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <CalendarCheck className="w-8 h-8 text-primary" /> Pengaturan Pesanan & Jadwal
        </h1>
        <p className="text-muted-foreground mt-1">Sistem kalender & perencanaan tanggal aktivitas operasional.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {scheduleMenu.map((menu, i) => (
          <Link key={i} href={menu.href}>
            <div className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer h-full flex flex-col hover:-translate-y-1 relative overflow-hidden">
               {/* Decorative Background */}
               <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${menu.bgColor} opacity-50 transition-all group-hover:scale-150 group-hover:opacity-10`} />

               <div className="flex items-start justify-between mb-4 relative">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${menu.bgColor}`}>
                    <menu.icon className={`w-7 h-7 ${menu.color}`} />
                  </div>
               </div>
               <h3 className="text-xl font-bold font-display text-foreground mb-2 group-hover:text-primary transition-colors relative">{menu.title}</h3>
               <p className="text-sm text-muted-foreground leading-relaxed flex-1 relative">{menu.desc}</p>
               
               <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-primary text-sm font-bold relative">
                  Buka Pengaturan Kalender <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
               </div>
            </div>
          </Link>
        ))}
      </div>

       {/* Widget Mini Notif */}
       <div className="mt-12 p-6 bg-muted/20 border border-border rounded-2xl grid md:grid-cols-2 gap-6 items-center max-w-4xl">
         <div>
            <h4 className="font-bold text-foreground text-sm mb-1 uppercase tracking-wider flex items-center gap-2">
               <Clock className="w-5 h-5 text-muted-foreground" />
               Aktivitas Mendatang (H-3)
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">Terdapat 2 Open Trip dan 1 Pemakaian Kendaraan dalam waktu sangat dekat. Pastikan PIC telah di assign.</p>
         </div>
          <div className="flex justify-start md:justify-end gap-3 font-mono font-bold text-sm">
             <div className="p-3 bg-white border border-border rounded-lg shadow-sm text-center">
                <span className="text-2xl text-emerald-600 block leading-none mb-1">2</span> Trip
             </div>
             <div className="p-3 bg-white border border-border rounded-lg shadow-sm text-center">
                <span className="text-2xl text-rose-600 block leading-none mb-1">1</span> Rental
             </div>
          </div>
       </div>

    </AdminLayout>
  );
}
