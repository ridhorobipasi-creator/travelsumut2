import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState } from "react";
import { Plus, Edit, Trash2, HelpCircle, Search, ChevronDown, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MOCK_FAQS = [
  { id: 1, question: "Apakah harga paket wisata sudah termasuk tiket pesawat?", answer: "Tidak, harga paket wisata yang tertera di website kami hanya mencakup akomodasi, transportasi darat, makan, dan tiket masuk wisata lokal sesuai itinerary. Tiket pesawat dari kota asal ke Medan (KNO) diluar tanggungan paket kami.", isActive: true, order: 1 },
  { id: 2, question: "Bagaimana sistem pembayaran untuk pemesanan paket?", answer: "Sistem pembayaran dilakukan melalui transfer bank. Pembayaran DP (Down Payment) minimal 30% dari total harga harus dilakukan saat konfirmasi pemesanan, dan pelunasan paling lambat H-3 sebelum keberangkatan.", isActive: true, order: 2 },
  { id: 3, question: "Apakah bisa request itinerary khusus di luar paket yang ada?", answer: "Tentu saja! Kami melayani Custom Trip. Anda dapat menghubungi customer service kami via WhatsApp untuk merancang jadwal perjalanan yang disesuaikan dengan keinginan, jumlah peserta, dan anggaran Anda.", isActive: true, order: 3 },
  { id: 4, question: "Berapa kapasitas maksimal peserta untuk open trip?", answer: "Tergantung jenis open trip, namun rata-rata maksimum adalah 15 orang per grup menggunakan mobil Toyota Hiace (1 driver, 1 guide, 13 peserta).", isActive: false, order: 4 },
];

const emptyForm = { question: "", answer: "", isActive: true };

export default function General() { // Component represents general FAQ settings
  const [faqs, setFaqs] = useState(MOCK_FAQS.sort((a,b) => a.order - b.order));
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<typeof MOCK_FAQS[0] | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filtered = faqs.filter((f) => f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase()));

  const openAdd = () => {
    setEditingFaq(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (faq: typeof MOCK_FAQS[0]) => {
    setEditingFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer, isActive: faq.isActive });
    setIsFormOpen(true);
    setExpandedFaq(faq.id);
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus pertanyaan ini dari daftar FAQ website?")) {
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleToggleActive = (id: number) => {
    setFaqs((prev) => prev.map((f) => f.id === id ? { ...f, isActive: !f.isActive } : f));
  };


  const handleMoveOrder = (id: number, direction: 'up' | 'down') => {
     setFaqs(prev => {
        const index = prev.findIndex(f => f.id === id);
        if (direction === 'up' && index > 0) {
           const newFaqs = [...prev];
           const temp = newFaqs[index].order;
           newFaqs[index].order = newFaqs[index - 1].order;
           newFaqs[index - 1].order = temp;
           return newFaqs.sort((a,b) => a.order - b.order);
        }
        if (direction === 'down' && index < prev.length - 1) {
           const newFaqs = [...prev];
           const temp = newFaqs[index].order;
           newFaqs[index].order = newFaqs[index + 1].order;
           newFaqs[index + 1].order = temp;
           return newFaqs.sort((a,b) => a.order - b.order);
        }
        return prev;
     });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaq) {
      setFaqs((prev) => prev.map((f) => f.id === editingFaq.id ? { ...f, ...formData } : f));
    } else {
      setFaqs((prev) => [...prev, { id: Math.max(...prev.map(f => f.id), 0) + 1, ...formData, order: prev.length + 1 }]);
    }
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-display font-bold flex items-center gap-3">
             <HelpCircle className="w-8 h-8 text-primary" /> Pengaturan FAQ Umum
           </h1>
           <p className="text-muted-foreground mt-1">Kelola daftar Pertanyaan yang Sering Diajukan.</p>
        </div>
        <button
           onClick={openAdd}
           className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" /> Tulis FAQ Baru
        </button>
      </div>

       <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari kata kunci dalam pertanyaan/jawaban..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
        </div>

        <div className="divide-y divide-border/50">
           {filtered.length === 0 && (
             <div className="py-12 text-center text-muted-foreground font-medium">
                <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                Daftar FAQ kosong.
             </div>
           )}

           {filtered.map((faq, index) => {
              const isExpanded = expandedFaq === faq.id;
              return (
                 <div key={faq.id} className="p-5 hover:bg-muted/10 transition-colors">
                    <div className="flex items-start gap-4">
                       <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
                          <button onClick={() => handleMoveOrder(faq.id, 'up')} disabled={index === 0} className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-20 transition-colors">
                             <ChevronDown className="w-4 h-4 rotate-180" />
                          </button>
                          <span className="text-xs font-mono font-bold">{faq.order}</span>
                          <button onClick={() => handleMoveOrder(faq.id, 'down')} disabled={index === filtered.length - 1} className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-20 transition-colors">
                             <ChevronDown className="w-4 h-4" />
                          </button>
                       </div>
                       
                       <div className="flex-1 cursor-pointer select-none" onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}>
                          <div className="flex items-center gap-3">
                             {isExpanded ? <ChevronDown className="w-5 h-5 text-primary" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                             <h4 className={`font-bold text-base ${isExpanded ? 'text-primary' : 'text-foreground'}`}>
                                {faq.question}
                             </h4>
                             {!faq.isActive && <span className="ml-2 px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold">DISSEMBUNYIKAN</span>}
                          </div>
                          
                          {isExpanded && (
                             <div className="mt-4 pl-8 pr-4 text-foreground leading-relaxed text-sm whitespace-pre-line border-l-2 border-primary/20 bg-muted/20 py-3 rounded-r-lg">
                                {faq.answer}
                             </div>
                          )}
                       </div>

                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity self-start mt-1 shrink-0">
                           <label className="flex items-center cursor-pointer mr-3 group" title="Tampilkan/Sembunyikan dari Publik">
                             <input
                               type="checkbox" className="sr-only peer" 
                               checked={faq.isActive}
                               onChange={() => handleToggleActive(faq.id)}
                             />
                             <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                           </label>
                           <button onClick={() => openEdit(faq)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Data">
                             <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDelete(faq.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus Permanen">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                    </div>
                 </div>
              )
           })}
        </div>
      </div>

       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              {editingFaq ? "Ubah Konten FAQ" : "Buat Pertanyaan & Jawaban"}
            </DialogTitle>
          </DialogHeader>
          <form id="faqForm" onSubmit={handleSubmit} className="space-y-6 py-2">
            <div>
               <label className="block text-sm font-bold mb-1.5 text-foreground">Pertanyaan (Q)</label>
               <input
                 required
                 type="text"
                 value={formData.question}
                 onChange={(e) => setFormData((p) => ({ ...p, question: e.target.value }))}
                 className="w-full px-4 py-3 border border-border focus:border-primary outline-none transition-all font-bold text-foreground bg-white rounded-xl shadow-sm"
                 placeholder="Ketik pertanyaan pelanggan..."
               />
            </div>
            
            <div>
               <label className="block text-sm font-bold mb-1.5 text-foreground">Jawaban Lengkap (A)</label>
               <textarea
                 required
                 rows={6}
                 value={formData.answer}
                 onChange={(e) => setFormData((p) => ({ ...p, answer: e.target.value }))}
                 className="w-full px-4 py-3 border border-border focus:border-primary outline-none transition-all text-sm leading-relaxed bg-white rounded-xl shadow-sm resize-none"
                 placeholder="Tulis jawaban informatif secara lengkap dan jelas..."
               />
            </div>

            <div className="flex items-start gap-3 bg-muted/20 p-4 rounded-xl border border-border">
               <label className="relative inline-flex items-center cursor-pointer mt-0.5">
                 <input 
                   type="checkbox" className="sr-only peer" 
                   checked={formData.isActive}
                   onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                 />
                 <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
               </label>
               <div>
                  <div className="font-bold text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 mt-[-2px] mb-1 text-xs rounded uppercase border border-emerald-100">{formData.isActive ? "Sedang MENGUDARA" : "Sedang DRAFT"}</div>
                  <p className="text-sm font-medium">Publikasikan FAQ ini ke halaman pengguna / Tamu.</p>
               </div>
            </div>
          </form>
          <DialogFooter className="pt-4 border-t border-border mt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 bg-background border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors mr-2">
              Batal
            </button>
            <button form="faqForm" type="submit" className="px-7 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
              {editingFaq ? "Simpan Perbaikan" : "Simpan & Tampilkan"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
