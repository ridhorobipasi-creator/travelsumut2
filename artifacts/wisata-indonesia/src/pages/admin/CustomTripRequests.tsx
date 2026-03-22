import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetCustomTrips } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function CustomTripRequests() {
  const { data: fetchedCustomTrips, isLoading, error, refetch } = useGetCustomTrips();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (error) {
      toast({
        title: "Gagal memuat data",
        description: "Tidak dapat mengambil data permintaan custom trip.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const customTrips = Array.isArray(fetchedCustomTrips) ? fetchedCustomTrips : [];
  const filteredCustomTrips = customTrips.filter((c) => {
    return (
      (c as any).name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c as any).email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Yakin hapus permintaan ini?")) {
      toast({ title: "Permintaan dihapus" });
      refetch();
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Permintaan Custom Trip</h1>
        <p className="text-muted-foreground mt-1">Daftar permintaan custom trip dari pelanggan.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Cari nama/email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
        />
      </div>
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-x-auto">
        {isLoading ? (
          <LoadingSpinner className="my-12" />
        ) : (
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-sm bg-muted/10">
                <th className="py-4 px-6 font-semibold">ID</th>
                <th className="py-4 px-6 font-semibold">Nama</th>
                <th className="py-4 px-6 font-semibold">Email</th>
                <th className="py-4 px-6 font-semibold">Tujuan</th>
                <th className="py-4 px-6 font-semibold">Pesan</th>
                <th className="py-4 px-6 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredCustomTrips.map((c) => (
                <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-6">#{c.id}</td>
                  <td className="py-4 px-6">{(c as any).name}</td>
                  <td className="py-4 px-6">{(c as any).email}</td>
                  <td className="py-4 px-6">{(c as any).destination}</td>
                  <td className="py-4 px-6">{(c as any).message}</td>
                  <td className="py-4 px-6">
                    <button
                      className="text-rose-600 hover:underline"
                      onClick={() => handleDelete(c.id)}
                    >
                      Hapus
                    </button>
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
