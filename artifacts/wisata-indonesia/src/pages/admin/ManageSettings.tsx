import { AdminLayout } from "@/components/layout/AdminLayout";
import { Link } from "wouter";
import { 
  Settings as SettingsIcon, 
  Map, 
  Briefcase, 
  Languages, 
  Activity, 
  HelpCircle,
  ShieldCheck,
  Globe
} from "lucide-react";

export default function ManageSettings() {
  const settingsMenu = [
    {
      title: "Sistem & Pengaturan",
      desc: "Konfigurasi utama aplikasi, informasi situs, kontak, social media, dan toggle maintenance.",
      icon: SettingsIcon,
      href: "/admin/settings",
      color: "text-blue-500",
      bgColor: "bg-blue-100/50"
    },
    {
      title: "Bahasa & Kurs",
      desc: "Pengaturan multi-bahasa dan nilai tukar mata uang yang digunakan pada transaksi.",
      icon: Languages,
      href: "/admin/language-currency",
      color: "text-emerald-500",
      bgColor: "bg-emerald-100/50"
    },
    {
      title: "Pengaturan FAQ Umum",
      desc: "Kelola daftar Pertanyaan yang Sering Diajukan (FAQ) pada layanan utama.",
      icon: HelpCircle,
      href: "/admin/setting/general",
      color: "text-indigo-500",
      bgColor: "bg-indigo-100/50"
    },
    {
      title: "Profil Biz & Layanan",
      desc: "Daftar layanan jasa unggulan (Sewa Mobil, Custom Tour, Pemandu) untuk ditampilkan di Frontpage.",
      icon: Briefcase,
      href: "/admin/setting/business-profile",
      color: "text-amber-500",
      bgColor: "bg-amber-100/50"
    },
    {
      title: "Master Data Trip (Wilayah)",
      desc: "Database wilayah / destinasi wisata default untuk menghubungkan paket dengan peta/wilayah.",
      icon: Map,
      href: "/admin/setting/trip-data",
      color: "text-rose-500",
      bgColor: "bg-rose-100/50"
    },
    {
      title: "Server & Activity Log",
      desc: "Keamanan: Pantau jejak aktivitas admin, sinkronisasi sistem, dan perubahan sensitif database.",
      icon: Activity,
      href: "/admin/setting/log-activity",
      color: "text-slate-500",
      bgColor: "bg-slate-100/50"
    }
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary" /> Pusat Kelola Pengaturan
        </h1>
        <p className="text-muted-foreground mt-1">Halaman direktori parameter sistem dan konfigurasi aplikasi.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {settingsMenu.map((menu, i) => (
          <Link key={i} href={menu.href}>
            <div className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col hover:-translate-y-1">
               <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${menu.bgColor}`}>
                    <menu.icon className={`w-7 h-7 ${menu.color}`} />
                  </div>
                  <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-muted rounded-full text-muted-foreground">
                     <Globe className="w-4 h-4" />
                  </div>
               </div>
               <h3 className="text-xl font-bold font-display text-foreground mb-2 group-hover:text-primary transition-colors">{menu.title}</h3>
               <p className="text-sm text-muted-foreground leading-relaxed flex-1">{menu.desc}</p>
               
               <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-primary text-sm font-bold">
                  Buka Pengaturan &rarr;
               </div>
            </div>
          </Link>
        ))}
      </div>

       {/* Banner Note */}
       <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex gap-4 items-start max-w-4xl">
         <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
         <div>
            <h4 className="font-bold text-amber-800 text-sm mb-1 uppercase tracking-wider">Peringatan Akses Hak Istimewa</h4>
            <p className="text-amber-700 text-sm leading-relaxed">Menu di halaman ini mengandung pengaturan sensitif yang dapat merubah fungsionalitas utama hingga menyebabkan eror integrasi apabila salah dirubah. Pastikan tindakan Anda terekam dalam log aktivitas atau dilakukan oleh level jabatan <b>Superadmin / Webmaster</b>.</p>
         </div>
       </div>

    </AdminLayout>
  );
}
