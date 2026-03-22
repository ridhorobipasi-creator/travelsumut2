import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState } from "react";
import { Plus, Edit, Trash2, Tag, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MOCK_CATEGORIES = [
  { id: 1, name: "Alam & Pegunungan", slug: "alam-pegunungan", description: "Wisata alam, hiking, dan pemandangan gunung.", packageCount: 15, isActive: true },
  { id: 2, name: "Pantai & Pulau", slug: "pantai-pulau", description: "Destinasi pantai pasir putih dan pulau tropis.", packageCount: 8, isActive: true },
  { id: 3, name: "Budaya & Sejarah", slug: "budaya-sejarah", description: "Wisata edukasi, desa adat, dan bangunan bersejarah.", packageCount: 12, isActive: true },
  { id: 4, name: "Kuliner Khas", slug: "kuliner", description: "Tour khusus mencicipi makanan lokal otentik.", packageCount: 5, isActive: false },
  { id: 5, name: "Petualangan Ekstrim", slug: "petualangan", description: "Rafting, off-road, jungle trekking intens.", packageCount: 3, isActive: true },
];

const emptyForm = { name: "", description: "", isActive: true };

export default function Category() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<typeof MOCK_CATEGORIES[0] | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const openAdd = () => {
    setEditingCategory(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (category: typeof MOCK_CATEGORIES[0]) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description, isActive: category.isActive });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    const category = categories.find(c => c.id === id);
    if (category && category.packageCount > 0) {
      return alert("Gagal! Kategori ini masih digunakan oleh " + category.packageCount + " Paket Wisata. Kosongkan paket terlebih dahulu.");
    }
    if (confirm("Yakin hapus kategori ini? Tindakan ini tidak dapat dibatalkan.")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleToggleActive = (id: number) => {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories((prev) => prev.map((c) => c.id === editingCategory.id ? { ...c, name: formData.name, slug: generateSlug(formData.name), description: formData.description, isActive: formData.isActive } : c));
    } else {
      setCategories((prev) => [...prev, { id: Math.max(...prev.map(c => c.id)) + 1, name: formData.name, slug: generateSlug(formData.name), description: formData.description, isActive: formData.isActive, packageCount: 0 }]);
    }
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <Tag className="w-8 h-8 text-primary" /> Kategori Paket Wisata
          </h1>
          <p className="text-muted-foreground mt-1">Kelola tipe/kategori tur untuk memudahkan pencarian tamu.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" /> Tambah Kategori
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
           <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama kategori..."
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
                <th className="py-4 px-6 font-semibold w-16">No</th>
                <th className="py-4 px-6 font-semibold w-[250px]">Nama Kategori</th>
                <th className="py-4 px-6 font-semibold">Deskripsi</th>
                <th className="py-4 px-6 font-semibold text-center w-32">Total Paket Terkait</th>
                <th className="py-4 px-6 font-semibold w-24">Status</th>
                <th className="py-4 px-6 font-semibold text-right w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((cat, idx) => (
                <tr key={cat.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                  <td className="py-4 px-6 text-muted-foreground font-mono">{idx + 1}</td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-foreground text-base mb-0.5">{cat.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">/{cat.slug}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-muted-foreground leading-relaxed line-clamp-2">{cat.description}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg bg-primary/10 text-primary font-bold text-sm">
                      {cat.packageCount}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <label className="flex items-center gap-2 cursor-pointer w-max">
                      <input
                        type="checkbox"
                        checked={cat.isActive}
                        onChange={() => handleToggleActive(cat.id)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50"
                      />
                      <span className="text-xs font-bold text-foreground">{cat.isActive ? 'Publik' : 'Sembunyi'}</span>
                    </label>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Kategori">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className={`p-2 rounded-lg transition-colors ${cat.packageCount > 0 ? "text-gray-400 cursor-not-allowed" : "text-rose-600 hover:bg-rose-50"}`} disabled={cat.packageCount > 0} title={cat.packageCount > 0 ? "Gagal hapus, masih digunakan pada paket" : "Hapus Kategori"}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={6} className="py-12 text-center text-muted-foreground font-medium">
                     <Tag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                     Kategori tidak ditemukan.
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
              <Tag className="w-5 h-5 text-primary" />
              {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
            </DialogTitle>
             <p className="text-sm text-muted-foreground mt-1">Kategori membantu mengelompokkan paket wisata yang sejenis.</p>
          </DialogHeader>
          <form id="categoryForm" onSubmit={handleSubmit} className="space-y-4 py-2 mt-2">
            <div>
              <label className="block text-sm font-bold mb-1.5 text-foreground">Nama Kategori</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                placeholder="Ex. Petualangan Alam"
              />
              <p className="text-xs text-muted-foreground mt-1 font-mono">URL-Slug: /{generateSlug(formData.name || 'namakategori')}</p>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5 text-foreground">Deskripsi Singkat (Opsional)</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm resize-none shadow-sm"
                placeholder="Jelaskan jenis aktivitas atau pengalaman pada kategori ini..."
              />
            </div>
            <div className="bg-muted/30 p-3 rounded-xl border border-border flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" className="sr-only peer" 
                  checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                />
                <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <div>
                <p className="text-sm font-bold text-foreground">{formData.isActive ? "Kategori Aktif & Ditampilkan" : "Kategori Disembunyikan (Draft)"}</p>
              </div>
            </div>
          </form>
          <DialogFooter className="pt-4 border-t border-border mt-4">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 bg-background border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors mr-2">
              Batal
            </button>
            <button form="categoryForm" type="submit" className="px-7 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
              {editingCategory ? "Simpan Perubahan" : "Simpan Kategori"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
