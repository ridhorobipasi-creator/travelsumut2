import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetPackages, useDeletePackage } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatRupiah } from "@/lib/utils";
import { Plus, Edit, Trash2, Search, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPackages() {
  const { data: packages, isLoading, refetch } = useGetPackages();
  const { mutate: deletePkg } = useDeletePackage();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if(confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
      deletePkg({ id }, {
        onSuccess: () => {
          toast({ title: "Berhasil dihapus" });
          refetch();
        }
      });
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Paket Wisata</h1>
          <p className="text-muted-foreground mt-1">Kelola seluruh paket tur dan liburan.</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all">
          <Plus className="w-5 h-5" />
          Tambah Paket
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari paket wisata..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner className="my-12" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm bg-muted/10">
                  <th className="py-4 px-6 font-semibold w-16">ID</th>
                  <th className="py-4 px-6 font-semibold">Info Paket</th>
                  <th className="py-4 px-6 font-semibold">Harga</th>
                  <th className="py-4 px-6 font-semibold">Durasi</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {packages?.map((pkg) => (
                  <tr key={pkg.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                    <td className="py-4 px-6 text-muted-foreground">#{pkg.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={pkg.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=150"} 
                          alt="" 
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-base mb-0.5 line-clamp-1">{pkg.title}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {pkg.city?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold">{formatRupiah(pkg.price)}</td>
                    <td className="py-4 px-6">{pkg.duration} Hari</td>
                    <td className="py-4 px-6">
                      {pkg.isActive ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Aktif</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold">Draft</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(pkg.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!packages?.length && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <Compass className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Belum ada paket wisata.</p>
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
