import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState } from "react";
import { Instagram, Plus, Edit, Trash2, RefreshCw, ExternalLink, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MOCK_FEEDS = [
  { id: 1, imageUrl: "https://images.unsplash.com/photo-1599408913599-71e0ea9283fa?w=400", caption: "Keindahan Danau Toba yang memesona 🌊 #DanauToba #WisataSumut", likes: 1243, link: "https://instagram.com/p/abc1", isVisible: true },
  { id: 2, imageUrl: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400", caption: "Petualangan seru di hutan Bukit Lawang 🌿 #BukitLawang #Orangutan", likes: 876, link: "https://instagram.com/p/abc2", isVisible: true },
  { id: 3, imageUrl: "https://images.unsplash.com/photo-1601152264065-0cbf24fc4820?w=400", caption: "Udara segar Berastagi dan Air Terjun Sipiso-piso ✨ #Berastagi", likes: 2109, link: "https://instagram.com/p/abc3", isVisible: true },
  { id: 4, imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", caption: "Surfing di pantai eksotis Pulau Nias 🏄 #Nias #Surfing", likes: 543, link: "https://instagram.com/p/abc4", isVisible: false },
  { id: 5, imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400", caption: "Matahari terbenam di Pulau Samosir yang menakjubkan 🌅 #Samosir", likes: 1876, link: "https://instagram.com/p/abc5", isVisible: true },
  { id: 6, imageUrl: "https://images.unsplash.com/photo-1596402184320-417d717867cd?w=400", caption: "Air Terjun tersembunyi di pedalaman Sumatera 💦 #NatureLovers", likes: 934, link: "https://instagram.com/p/abc6", isVisible: true },
];

const emptyForm = { imageUrl: "", caption: "", link: "", isVisible: true };

export default function InstagramFeeds() {
  const [feeds, setFeeds] = useState(MOCK_FEEDS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState<typeof MOCK_FEEDS[0] | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [lastSync] = useState("21 Maret 2026, 08:00 WIB");
  const [instagramToken, setInstagramToken] = useState("IG_ACCESS_TOKEN_PLACEHOLDER_xxxx");

  const openAdd = () => {
    setEditingFeed(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (feed: typeof MOCK_FEEDS[0]) => {
    setEditingFeed(feed);
    setFormData({ imageUrl: feed.imageUrl, caption: feed.caption, link: feed.link, isVisible: feed.isVisible });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus feed ini dari tampilan website?")) {
      setFeeds((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleToggleVisible = (id: number) => {
    setFeeds((prev) => prev.map((f) => f.id === id ? { ...f, isVisible: !f.isVisible } : f));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFeed) {
      setFeeds((prev) => prev.map((f) => f.id === editingFeed.id ? { ...f, ...formData } : f));
    } else {
      setFeeds((prev) => [...prev, { id: Math.max(...prev.map(f => f.id)) + 1, ...formData, likes: 0 }]);
    }
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <Instagram className="w-8 h-8 text-pink-500" /> Instagram Feeds
          </h1>
          <p className="text-muted-foreground mt-1">Kelola foto Instagram yang ditampilkan di website.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert("Sinkronisasi Instagram Feed memerlukan koneksi API Instagram.")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card font-bold text-sm hover:bg-muted/50 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Sync
          </button>
          <button
            onClick={openAdd}
            className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-pink-500/25 transition-all"
          >
            <Plus className="w-5 h-5" /> Tambah Feed
          </button>
        </div>
      </div>

      {/* Integration Status Card */}
      <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 border border-pink-200 rounded-2xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Instagram className="w-5 h-5 text-pink-500" />
              <span className="font-bold text-base">Status Integrasi Instagram</span>
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 rounded-full">Demo Mode</span>
            </div>
            <p className="text-sm text-muted-foreground">Sinkronisasi terakhir: {lastSync}</p>
          </div>
          <div className="flex-1 max-w-md">
            <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Instagram Access Token</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={instagramToken}
                onChange={(e) => setInstagramToken(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-border text-sm bg-white focus:outline-none focus:border-pink-400"
              />
              <button className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-bold hover:bg-pink-600 transition-colors">Simpan</button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Feed", value: feeds.length, color: "text-pink-500" },
          { label: "Ditampilkan", value: feeds.filter(f => f.isVisible).length, color: "text-emerald-600" },
          { label: "Total Likes", value: feeds.reduce((acc, f) => acc + f.likes, 0).toLocaleString("id-ID"), color: "text-purple-600" },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-5">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Feed Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {feeds.map((feed) => (
          <div key={feed.id} className={`group relative rounded-2xl overflow-hidden border-2 transition-all ${feed.isVisible ? "border-pink-200" : "border-gray-200 opacity-60"}`}>
            <img
              src={feed.imageUrl}
              alt={feed.caption}
              className="w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
              <p className="text-white text-xs text-center line-clamp-3">{feed.caption}</p>
              <div className="flex gap-1 mt-1">
                <button onClick={() => openEdit(feed)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white" title="Edit">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleToggleVisible(feed.id)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white" title={feed.isVisible ? "Sembunyikan" : "Tampilkan"}>
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <a href={feed.link} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white" title="Buka di Instagram">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button onClick={() => handleDelete(feed.id)} className="p-1.5 bg-rose-500/70 hover:bg-rose-600/80 rounded-lg text-white" title="Hapus">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="absolute top-2 left-2">
              {!feed.isVisible && <span className="bg-gray-900/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">Tersembunyi</span>}
            </div>
            <div className="absolute bottom-2 right-2">
              <span className="bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                ❤️ {feed.likes.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-500" />
              {editingFeed ? "Edit Feed" : "Tambah Feed Instagram"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-bold mb-1.5">URL Gambar</label>
              <input
                required
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-pink-400 outline-none text-sm"
                placeholder="https://images.unsplash.com/..."
              />
              {formData.imageUrl && (
                <img src={formData.imageUrl} alt="Preview" className="mt-2 w-24 h-24 rounded-xl object-cover border border-border" />
              )}
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">Caption</label>
              <textarea
                rows={3}
                value={formData.caption}
                onChange={(e) => setFormData((p) => ({ ...p, caption: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-pink-400 outline-none text-sm resize-none"
                placeholder="Caption Instagram post..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">Link Post Instagram</label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData((p) => ({ ...p, link: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-pink-400 outline-none text-sm"
                placeholder="https://instagram.com/p/..."
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) => setFormData((p) => ({ ...p, isVisible: e.target.checked }))}
                className="w-4 h-4 rounded border-border text-pink-500"
              />
              <span className="text-sm font-medium">Tampilkan di website</span>
            </label>
            <DialogFooter className="pt-4 border-t border-border">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 bg-muted text-muted-foreground font-bold rounded-xl hover:bg-muted/80 transition-colors">
                Batal
              </button>
              <button type="submit" className="px-7 py-2.5 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 shadow-lg shadow-pink-500/20 transition-all">
                {editingFeed ? "Simpan" : "Tambah Feed"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
