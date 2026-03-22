import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState } from "react";
import { Plus, Edit, Trash2, Hotel as HotelIcon, Search, MapPin, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MOCK_HOTELS = [
  { id: 1, name: "Hotel Inna Parapat", location: "Danau Toba, Parapat", type: "Resort", stars: 4, isRecommended: true, imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8454c57104?w=400", priceRange: "Rp 800.000 - Rp 1.500.000" },
  { id: 2, name: "JW Marriott Hotel Medan", location: "Medan Pusat", type: "Hotel", stars: 5, isRecommended: true, imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c0d588fa?w=400", priceRange: "Rp 1.500.000 - Rp 3.000.000" },
  { id: 3, name: "Sibuatan Basecamp", location: "Karo, Berastagi", type: "Guesthouse", stars: 2, isRecommended: false, imageUrl: "https://images.unsplash.com/photo-1620182470650-6a0ea002ebbc?w=400", priceRange: "Rp 200.000 - Rp 400.000" },
  { id: 4, name: "Ecolodge Bukit Lawang", location: "Bukit Lawang, Langkat", type: "Lodge", stars: 3, isRecommended: true, imageUrl: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=400", priceRange: "Rp 400.000 - Rp 800.000" },
  { id: 5, name: "Nias Surf Resort", location: "Pulau Nias", type: "Resort", stars: 4, isRecommended: false, imageUrl: "https://images.unsplash.com/photo-1582610116397-edb318620f90?w=400", priceRange: "Rp 1.000.000 - Rp 2.500.000" },
];

const emptyForm = { name: "", location: "", type: "Hotel", stars: 3, isRecommended: false, imageUrl: "", priceRange: "" };
const HOTEL_TYPES = ["Hotel", "Resort", "Villa", "Guesthouse", "Lodge", "Camping", "Lainnya"];

function StarDisplay({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" title={`${count} Bintang`}>
       {Array.from({ length: 5 }).map((_, i) => (
         <Star key={i} className={`w-3.5 h-3.5 ${i < count ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
       ))}
    </div>
  )
}

export default function Hotel() {
  const [hotels, setHotels] = useState(MOCK_HOTELS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<typeof MOCK_HOTELS[0] | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = hotels.filter((h) => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.location.toLowerCase().includes(searchQuery.toLowerCase()));

  const openAdd = () => {
    setEditingHotel(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (hotel: typeof MOCK_HOTELS[0]) => {
    setEditingHotel(hotel);
    setFormData({ ...hotel });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus data akomodasi ini? Paket mungkin menggunakan referensi ini.")) {
      setHotels((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHotel) {
      setHotels((prev) => prev.map((h) => h.id === editingHotel.id ? { ...h, ...formData } : h));
    } else {
      setHotels((prev) => [...prev, { id: Math.max(...prev.map(h => h.id), 0) + 1, ...formData }]);
    }
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <HotelIcon className="w-8 h-8 text-primary" /> Daftar Akomodasi
          </h1>
          <p className="text-muted-foreground mt-1">Database hotel dan penginapan yang bekerjasama.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" /> Registrasi Hotel
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari akomodasi atau wilayah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-sm bg-muted/5">
                <th className="py-4 px-6 font-semibold w-24">Media</th>
                <th className="py-4 px-6 font-semibold w-[280px]">Nama & Kelas</th>
                <th className="py-4 px-6 font-semibold">Tipe Akmodasi</th>
                <th className="py-4 px-6 font-semibold">Estimasi Harga / Malam</th>
                <th className="py-4 px-6 font-semibold text-center w-28">Status</th>
                <th className="py-4 px-6 font-semibold text-right w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((hotel) => (
                <tr key={hotel.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                  <td className="py-4 px-6">
                     <img src={hotel.imageUrl || `https://via.placeholder.com/100?text=${hotel.name.charAt(0)}`} alt={hotel.name} className="w-12 h-12 rounded-xl object-cover bg-white border border-border/50" />
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-foreground text-base mb-0.5">{hotel.name}</p>
                    <div className="flex items-center gap-2 mb-1">
                      <StarDisplay count={hotel.stars} />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 line-clamp-1 border-t border-border/30 pt-1 mt-1">
                      <MapPin className="w-3 h-3" /> {hotel.location}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase rounded-full tracking-wider border border-border/50">
                      {hotel.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-foreground font-mono text-xs font-semibold">
                    {hotel.priceRange || 'Harga Hubungi CS'}
                  </td>
                  <td className="py-4 px-6 text-center">
                     {hotel.isRecommended ? (
                       <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-full tracking-wider">Pilihan</span>
                     ) : (
                       <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase rounded-full tracking-wider">Standar</span>
                     )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(hotel)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Data">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(hotel.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus Akomodasi">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={6} className="py-12 text-center text-muted-foreground font-medium">
                     <HotelIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                     Data akomodasi tidak ditemukan.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
              <HotelIcon className="w-5 h-5 text-primary" />
              {editingHotel ? "Update Data Hotel" : "Pendaftaran Hotel Baru"}
            </DialogTitle>
          </DialogHeader>
          <form id="hotelForm" onSubmit={handleSubmit} className="space-y-4 py-2 mt-2">
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1.5 text-foreground">Nama Hotel/Akomodasi</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                    placeholder="Ex. Resort Danau Toba"
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold mb-1.5 text-foreground">Tipe Penamaan (Untuk Listing)</label>
                  <select
                     value={formData.type}
                     onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                     className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm text-foreground"
                  >
                     {HOTEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
               </div>
                <div>
                   <label className="block text-sm font-bold mb-1.5 text-foreground">Bintang / Kelas (1-5)</label>
                   <input
                    required
                    type="number"
                    min="1"
                    max="5"
                    value={formData.stars}
                    onChange={(e) => setFormData((p) => ({ ...p, stars: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                  />
               </div>
               <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1.5 text-foreground flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Wilayah / Lokasi Persis</label>
                  <input
                    required
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                    placeholder="Ex. Parapat, Danau Toba / Medan City Center"
                  />
               </div>
               <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1.5 text-foreground">Harga Estimasi (Hanya untuk Display Tabel)</label>
                  <input
                    type="text"
                    value={formData.priceRange}
                    onChange={(e) => setFormData((p) => ({ ...p, priceRange: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                    placeholder="Ex. Rp 500.000 - Rp 1.000.000"
                  />
               </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5 text-foreground">Foto Sampul Utama URL</label>
               <input
                required
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-3">
              <label className="relative inline-flex items-center cursor-pointer mt-0.5">
                <input 
                  type="checkbox" className="sr-only peer" 
                  checked={formData.isRecommended}
                  onChange={(e) => setFormData((p) => ({ ...p, isRecommended: e.target.checked }))}
                />
                <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <div>
                <p className="text-sm font-bold">Jadikan Pilihan Rekomendasi</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Hotel yang direkomendasikan sering disematkan pertama di penawaran paket.</p>
              </div>
            </div>

          </form>
          <DialogFooter className="pt-4 border-t border-border mt-4">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 bg-background border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors mr-2">
              Batal
            </button>
            <button form="hotelForm" type="submit" className="px-7 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
              {editingHotel ? "Update Master Data" : "Simpan Master Data"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
