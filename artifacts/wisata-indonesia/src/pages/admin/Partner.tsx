import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState } from "react";
import { Plus, Edit, Trash2, Users, Search, Link as LinkIcon, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MOCK_PARTNERS = [
  { id: 1, name: "Pesona Indonesia", type: "Pemerintah", logo: "https://images.unsplash.com/photo-1596402184320-417d717867cd?w=100&h=100&fit=crop", website: "https://indonesia.travel", description: "Kementerian Pariwisata RI", isActive: true },
  { id: 2, name: "Garuda Indonesia", type: "Transportasi", logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop", website: "https://garuda-indonesia.com", description: "Maskapai Nasional", isActive: true },
  { id: 3, name: "Traveloka", type: "OTA", logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop", website: "https://traveloka.com", description: "Online Travel Agent Partner", isActive: true },
  { id: 4, name: "ASITA Sumut", type: "Asosiasi", logo: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=100&h=100&fit=crop", website: "#", description: "Asosiasi Perusahaan Perjalanan Wisata", isActive: false },
];

const emptyForm = { name: "", type: "Lainnya", logo: "", website: "", description: "", isActive: true };

const PARTNER_TYPES = ["Pemerintah", "Transportasi", "Akomodasi", "OTA", "Asosiasi", "Komunitas", "Media", "Lainnya"];

export default function Partner() {
  const [partners, setPartners] = useState(MOCK_PARTNERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<typeof MOCK_PARTNERS[0] | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = partners.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === "all" || p.type === filterType;
    return matchSearch && matchType;
  });

  const openAdd = () => {
    setEditingPartner(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (partner: typeof MOCK_PARTNERS[0]) => {
    setEditingPartner(partner);
    setFormData({ ...partner });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus logo partner ini dari website?")) {
      setPartners((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleToggleActive = (id: number) => {
    setPartners((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPartner) {
      setPartners((prev) => prev.map((p) => p.id === editingPartner.id ? { ...p, ...formData } : p));
    } else {
      setPartners((prev) => [...prev, { id: Math.max(...prev.map(p => p.id), 0) + 1, ...formData }]);
    }
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" /> Daftar Partner
          </h1>
          <p className="text-muted-foreground mt-1">Kelola logo mitra bisnis dan sponsor layanan.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" /> Tambah Partner
        </button>
      </div>

       <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama partner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:border-primary"
          >
             <option value="all">Semua Tipe Partner</option>
             {PARTNER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-sm bg-muted/5">
                <th className="py-4 px-6 font-semibold w-24">Logo</th>
                <th className="py-4 px-6 font-semibold">Informasi Partner</th>
                <th className="py-4 px-6 font-semibold">Kategori</th>
                <th className="py-4 px-6 font-semibold text-center w-28">Tampil Web</th>
                <th className="py-4 px-6 font-semibold text-right w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((partner) => (
                <tr key={partner.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                  <td className="py-4 px-6">
                     {partner.logo ? (
                       <img src={partner.logo} alt={partner.name} className="w-12 h-12 rounded-xl object-cover bg-white border border-border/50 p-1" />
                     ) : (
                       <div className="w-12 h-12 rounded-xl bg-muted border border-border/50 flex items-center justify-center p-1">
                          <Building2 className="w-6 h-6 text-muted-foreground" />
                       </div>
                     )}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-foreground text-base">{partner.name}</p>
                    <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{partner.description}</p>
                    {partner.website && partner.website !== "#" && (
                       <a href={partner.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:underline font-mono bg-blue-50 px-2 py-0.5 rounded">
                         <LinkIcon className="w-3 h-3" /> {new URL(partner.website).hostname}
                       </a>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase rounded-full tracking-wider border border-border/50">
                      {partner.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <label className="flex items-center justify-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={partner.isActive}
                        onChange={() => handleToggleActive(partner.id)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50"
                      />
                    </label>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(partner)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Partner">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(partner.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus Partner">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-12 text-center text-muted-foreground font-medium">
                     <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                     Data partner tidak ditemukan.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              {editingPartner ? "Edit Data Partner" : "Pendaftaran Partner Baru"}
            </DialogTitle>
          </DialogHeader>
          <form id="partnerForm" onSubmit={handleSubmit} className="space-y-4 py-2 mt-2">
            <div>
              <label className="block text-sm font-bold mb-1.5 text-foreground">Nama Instansi/Perusahaan</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                placeholder="Ex. Kementerian Pariwisata"
              />
            </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold mb-1.5 text-foreground">Kategori Mitra</label>
                  <select
                     value={formData.type}
                     onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                     className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm text-foreground"
                  >
                     {PARTNER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
               </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-foreground">Website (Opsional)</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData((p) => ({ ...p, website: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                    placeholder="https://..."
                  />
               </div>
             </div>
            <div>
              <label className="block text-sm font-bold mb-1.5 text-foreground">URL Logo Partner</label>
               <input
                required
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData((p) => ({ ...p, logo: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                placeholder="https://images.unsplash.com/... (Harus kotak)"
              />
               {formData.logo && (
                 <div className="mt-2 text-xs text-muted-foreground flex items-center gap-3">
                   Preview <img src={formData.logo} alt="Preview" className="w-8 h-8 rounded border object-cover bg-white p-0.5" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                 </div>
               )}
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5 text-foreground">Keterangan Singkat</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm resize-none shadow-sm"
                placeholder="Institusi pemerintahan / Platform Booking dll."
              />
            </div>
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" className="sr-only peer" 
                  checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                />
                <div className="w-9 h-5 bg-emerald-200/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-emerald-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
              <div>
                <p className="text-sm font-bold">{formData.isActive ? "Langsung Publikasikan" : "Simpan Sebagai Draft"}</p>
              </div>
            </div>
          </form>
          <DialogFooter className="pt-4 border-t border-border mt-4">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 bg-background border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors mr-2">
              Batal
            </button>
            <button form="partnerForm" type="submit" className="px-7 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
              {editingPartner ? "Update Data" : "Simpan Partner"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
