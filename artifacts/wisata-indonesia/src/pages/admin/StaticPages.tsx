import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState } from "react";
import { Plus, Edit, Trash2, Layers, Search, Eye, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MOCK_PAGES = [
  { id: 1, title: "Tentang Kami", slug: "tentang-kami", lastUpdated: "2026-03-20 10:15", isPublished: true, isSystem: true },
  { id: 2, title: "Syarat & Ketentuan", slug: "syarat-ketentuan", lastUpdated: "2026-03-15 08:30", isPublished: true, isSystem: true },
  { id: 3, title: "Kebijakan Privasi", slug: "kebijakan-privasi", lastUpdated: "2026-03-15 09:00", isPublished: true, isSystem: true },
  { id: 4, title: "FAQ", slug: "faq", lastUpdated: "2026-03-18 14:20", isPublished: true, isSystem: false },
  { id: 5, title: "Panduan Pemesanan", slug: "panduan-pemesanan", lastUpdated: "2026-03-21 09:45", isPublished: false, isSystem: false },
];

const emptyForm = { title: "", slug: "", content: "", isPublished: true };

export default function StaticPages() {
  const [pages, setPages] = useState(MOCK_PAGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<typeof MOCK_PAGES[0] | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = pages.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const openAdd = () => {
    setEditingPage(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (page: typeof MOCK_PAGES[0]) => {
    setEditingPage(page);
    setFormData({ title: page.title, slug: page.slug, content: "Contoh konten statis untuk " + page.title, isPublished: page.isPublished });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    const page = pages.find(p => p.id === id);
    if (page?.isSystem) return alert("Halaman sistem esensial tidak dapat dihapus, hanya bisa diedit isinya.");
    if (confirm("Hapus halaman statis ini? Halaman tidak akan bisa diakses lagi.")) {
      setPages((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!editingPage?.isSystem) {
      setFormData(prev => ({ ...prev, title, slug: generateSlug(title) }));
    } else {
      setFormData(prev => ({ ...prev, title }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    if (editingPage) {
      setPages((prev) => prev.map((p) => p.id === editingPage.id ? { ...p, title: formData.title, slug: formData.slug, isPublished: formData.isPublished, lastUpdated: now } : p));
    } else {
      setPages((prev) => [...prev, { id: Math.max(...prev.map(p => p.id)) + 1, title: formData.title, slug: formData.slug, isPublished: formData.isPublished, lastUpdated: now, isSystem: false }]);
    }
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" /> Halaman Statis
          </h1>
          <p className="text-muted-foreground mt-1">Kelola konten halaman informasi statis website.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" /> Buat Halaman
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
             <input
              type="text"
              placeholder="Cari judul halaman..."
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
                <th className="py-4 px-6 font-semibold w-12">ID</th>
                <th className="py-4 px-6 font-semibold">Judul Halaman</th>
                <th className="py-4 px-6 font-semibold">Tipe</th>
                <th className="py-4 px-6 font-semibold">Update Terakhir</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((page) => (
                <tr key={page.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                  <td className="py-4 px-6 text-muted-foreground">#{page.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-base mb-1">{page.title}</p>
                    <p className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded inline-block">/halaman/{page.slug}</p>
                  </td>
                  <td className="py-4 px-6">
                    {page.isSystem ? (
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase rounded-full tracking-wider">Sistem</span>
                    ) : (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-full tracking-wider">Kustom</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">{page.lastUpdated}</td>
                  <td className="py-4 px-6">
                    {page.isPublished ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full tracking-wider">Dipublikasikan</span>
                    ) : (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-full tracking-wider">Draft</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Lihat Halaman">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(page)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Konten">
                        <Edit className="w-4 h-4" />
                      </button>
                      {!page.isSystem && (
                        <button onClick={() => handleDelete(page.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={6} className="py-12 text-center text-muted-foreground font-medium">
                     <Layers className="w-12 h-12 mx-auto mb-3 opacity-20" />
                     Belum ada halaman statis
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-border shrink-0">
            <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {editingPage ? "Edit Halaman Statis" : "Buat Halaman Statis Baru"}
            </DialogTitle>
             {editingPage?.isSystem && (
              <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg mt-3 flex items-start gap-2 max-w-lg">
                <span className="shrink-0 text-amber-500 font-bold block mt-0.5">ⓘ</span> Halaman ini adalah halaman esensial sistem. Pengubahan URL/Slug telah dinonaktifkan untuk mencegah error link.
              </p>
            )}
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto w-full p-6">
            <form id="pageForm" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-foreground">Judul Halaman</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all text-sm shadow-sm"
                    placeholder="Cth: FAQ Wisata Sumut"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-foreground flex justify-between">
                    URL Slug 
                    <span className="text-muted-foreground text-xs font-normal bg-muted px-2 py-0.5 rounded">Otomatis / Kustom</span>
                  </label>
                  <div className="flex">
                    <span className="px-3 border border-r-0 border-border rounded-l-xl bg-muted py-3 text-sm text-muted-foreground whitespace-nowrap">
                       /halaman/
                    </span>
                    <input
                      required
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                      disabled={editingPage?.isSystem}
                      className="w-full px-4 py-3 border border-border focus:border-primary outline-none transition-all text-sm shadow-sm rounded-r-xl bg-card disabled:bg-muted/50 disabled:cursor-not-allowed"
                      placeholder="faq-wisata-sumut"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-foreground flex justify-between items-end">
                   Konten Teks (HTML / Markdown Supported)
                   <button type="button" className="text-primary text-xs font-bold hover:underline">Gunakan Visual Editor</button>
                </label>
                <textarea
                  required
                  rows={15}
                  value={formData.content}
                  onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                  className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-border focus:border-primary outline-none transition-all text-sm font-mono leading-relaxed resize-y min-h-[300px]"
                  placeholder="<h2>Mulai menulis konten di sini...</h2>\n<p>HTML markup diizinkan.</p>"
                />
              </div>

               <div className="bg-muted/30 p-4 rounded-xl border border-border flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">Publikasikan Halaman</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Halaman dapat diakses oleh umum (Tamu & User)</p>
                  </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" value="" className="sr-only peer" 
                      checked={formData.isPublished}
                      onChange={(e) => setFormData(p => ({ ...p, isPublished: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
               </div>
            </form>
          </div>

          <DialogFooter className="p-6 border-t border-border shrink-0 bg-muted/10">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2.5 bg-background border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors mr-2">
              Batal
            </button>
            <button form="pageForm" type="submit" className="px-8 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
              {editingPage ? "Simpan Perubahan" : "Simpan & Buat Halaman"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
