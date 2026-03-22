import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState } from "react";
import { MessageSquare, Search, Trash2, Eye, Mail, Phone, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MOCK_MESSAGES = [
  { id: 1, name: "Andi Wijaya", email: "andi@email.com", phone: "081234567890", subject: "Pertanyaan tentang Paket Danau Toba", message: "Halo, saya ingin menanyakan ketersediaan paket Eksplorasi Danau Toba untuk tanggal 15-17 April. Apakah bisa untuk 5 orang? Terima kasih.", date: "2026-03-20T10:30:00Z", status: "new" },
  { id: 2, name: "Sari Dewi", email: "sari@gmail.com", phone: "087654321098", subject: "Harga Custom Trip Bukit Lawang", message: "Salam, saya ingin mendapatkan penawaran untuk custom trip ke Bukit Lawang selama 3 hari 2 malam untuk 8 orang dari komunitas kami. Mohon informasinya.", date: "2026-03-19T14:15:00Z", status: "replied" },
  { id: 3, name: "Budi Santoso", email: "budi.s@work.com", phone: "085123456789", subject: "Rental Mobil Hiace untuk Rombongan", message: "Tim kami ada 12 orang dan kami butuh rental Hiace dari Medan ke Berastagi PP. Apa harganya per hari? Kami juga membutuhkan driver yang berpengalaman.", date: "2026-03-18T09:00:00Z", status: "new" },
  { id: 4, name: "Maya Putri", email: "maya@outlook.com", phone: "089987654321", subject: "Konfirmasi Pembayaran", message: "Selamat siang, saya sudah transfer DP untuk pemesanan paket Nias (booking ID: #1048). Mohon dikonfirmasi. Terima kasih banyak.", date: "2026-03-17T16:45:00Z", status: "closed" },
  { id: 5, name: "Rizky Hidayat", email: "rizky@yahoo.com", phone: "081398765432", subject: "Apakah Ada Paket Bulan Madu?", message: "Halo, saya dan istri berencana bulan madu di Sumatera Utara. Apakah ada paket spesial honeymoon? Budget kami sekitar 5 juta untuk 3 hari. Advice dong.", date: "2026-03-16T11:20:00Z", status: "replied" },
];

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ComponentType<any> }> = {
  new: { label: "Baru", color: "bg-blue-100 text-blue-700", icon: Clock },
  replied: { label: "Dibalas", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  closed: { label: "Selesai", color: "bg-gray-100 text-gray-600", icon: XCircle },
};

export default function ContactMessages() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMsg, setSelectedMsg] = useState<typeof MOCK_MESSAGES[0] | null>(null);

  const filtered = messages.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDelete = (id: number) => {
    if (confirm("Yakin hapus pesan ini?")) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleStatusChange = (id: number, status: string) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Pesan Kontak</h1>
        <p className="text-muted-foreground mt-1">Kelola pesan masuk dari pengunjung website.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Pesan Baru", value: messages.filter(m => m.status === "new").length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Sudah Dibalas", value: messages.filter(m => m.status === "replied").length, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Pesan", value: messages.length, color: "text-primary", bg: "bg-primary/5" },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-2xl p-5 border border-border`}>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama, email, subjek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:border-primary"
          >
            <option value="all">Semua Status</option>
            <option value="new">Baru</option>
            <option value="replied">Dibalas</option>
            <option value="closed">Selesai</option>
          </select>
        </div>

        <div className="divide-y divide-border">
          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Tidak ada pesan ditemukan.</p>
            </div>
          )}
          {filtered.map((msg) => {
            const StatusInfo = STATUS_LABELS[msg.status] || STATUS_LABELS.new;
            const Icon = StatusInfo.icon;
            return (
              <div key={msg.id} className={`p-6 hover:bg-muted/20 transition-colors group ${msg.status === "new" ? "border-l-4 border-l-blue-400" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-base">{msg.name}</span>
                      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${StatusInfo.color}`}>
                        <Icon className="w-3 h-3" />{StatusInfo.label}
                      </span>
                    </div>
                    <p className="font-semibold text-sm text-foreground mb-1 truncate">{msg.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{msg.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{msg.phone}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(msg.date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => setSelectedMsg(msg)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedMsg} onOpenChange={() => setSelectedMsg(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold">Detail Pesan</DialogTitle>
          </DialogHeader>
          {selectedMsg && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Pengirim</p>
                  <p className="font-bold">{selectedMsg.name}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Status</p>
                  <select
                    className="w-full bg-transparent font-bold text-sm outline-none"
                    value={selectedMsg.status}
                    onChange={(e) => {
                      handleStatusChange(selectedMsg.id, e.target.value);
                      setSelectedMsg({ ...selectedMsg, status: e.target.value });
                    }}
                  >
                    <option value="new">Baru</option>
                    <option value="replied">Dibalas</option>
                    <option value="closed">Selesai</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-4 h-4" />{selectedMsg.email}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-4 h-4" />{selectedMsg.phone}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" />{formatDate(selectedMsg.date)}</div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Subjek</p>
                <p className="font-semibold text-base">{selectedMsg.subject}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Pesan</p>
                <p className="text-sm leading-relaxed bg-muted/30 rounded-xl p-4">{selectedMsg.message}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all text-sm"
                >
                  <Mail className="w-4 h-4" /> Balas via Email
                </a>
                <a
                  href={`https://wa.me/${selectedMsg.phone.replace(/^0/, "62")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all text-sm"
                >
                  <Phone className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
