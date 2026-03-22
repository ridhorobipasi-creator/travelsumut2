import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState } from "react";
import { Plus, Edit, Trash2, Languages, DollarSign, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MOCK_CURRENCIES = [
  { id: 1, code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", rate: 1, isDefault: true, isActive: true },
  { id: 2, code: "USD", name: "US Dollar", symbol: "$", rate: 0.000065, isDefault: false, isActive: true },
  { id: 3, code: "EUR", name: "Euro", symbol: "€", rate: 0.000059, isDefault: false, isActive: true },
  { id: 4, code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 0.000087, isDefault: false, isActive: false },
  { id: 5, code: "MYR", name: "Malaysian Ringgit", symbol: "RM", rate: 0.00031, isDefault: false, isActive: false },
];

const emptyForm = { code: "", name: "", symbol: "", rate: 1, isDefault: false, isActive: true };

export default function LanguageCurrency() {
  const [currencies, setCurrencies] = useState(MOCK_CURRENCIES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<typeof MOCK_CURRENCIES[0] | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const openAdd = () => {
    setEditingCurrency(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (currency: typeof MOCK_CURRENCIES[0]) => {
    setEditingCurrency(currency);
    setFormData({ ...currency });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    const currency = currencies.find(c => c.id === id);
    if (currency?.isDefault) return alert("Mata uang default tidak dapat dihapus.");
    if (confirm("Yakin hapus mata uang ini?")) {
      setCurrencies((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleSetDefault = (id: number) => {
    setCurrencies((prev) => prev.map((c) => ({
      ...c,
      isDefault: c.id === id,
      isActive: c.id === id ? true : c.isActive, // otomatis aktifkan jika di-set default
    })));
  };

  const handleToggleActive = (id: number) => {
    const currency = currencies.find(c => c.id === id);
    if (currency?.isDefault && currency.isActive) return alert("Mata uang default harus selalu aktif.");
    setCurrencies((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCurrency) {
      setCurrencies((prev) => prev.map((c) => c.id === editingCurrency.id ? { ...c, ...formData } : c));
    } else {
      setCurrencies((prev) => [...prev, { id: Math.max(...prev.map(c => c.id)) + 1, ...formData }]);
    }
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <Languages className="w-8 h-8 text-primary" /> Bahasa & Mata Uang
          </h1>
          <p className="text-muted-foreground mt-1">Pengaturan multi-bahasa dan nilai tukar kurs website.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" /> Tambah Mata Uang
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Languages Section */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/20">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <GlobeIcon className="w-5 h-5 text-blue-500" /> Bahasa Didukung
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇮🇩</span>
                <div>
                  <p className="font-bold text-blue-900">Bahasa Indonesia</p>
                  <p className="text-xs text-blue-700">Default (Selalu Aktif)</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-200 text-blue-800 text-xs font-bold">Aktif</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
               <div className="flex items-center gap-3">
                <span className="text-2xl opacity-50">🇬🇧</span>
                <div>
                  <p className="font-bold text-muted-foreground">English</p>
                  <p className="text-xs text-muted-foreground">Segera Hadir</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold">Draft</span>
            </div>
            <button className="w-full text-sm font-bold text-primary px-4 py-2 border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors border-dashed">
              + Ajukan Tambah Bahasa
            </button>
          </div>
        </div>

        {/* Currency Table Section */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border bg-muted/20">
            <h2 className="text-lg font-bold flex items-center gap-2">
               <Wallet className="w-5 h-5 text-emerald-500" /> Pengaturan Mata Uang & Kurs
            </h2>
          </div>
          <div className="overflow-x-auto flex-1">
             <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm bg-muted/5">
                  <th className="py-4 px-6 font-semibold">Mata Uang</th>
                  <th className="py-4 px-6 font-semibold">Kurs (vs IDR)</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {currencies.map((curr) => (
                  <tr key={curr.id} className={`border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group ${curr.isDefault ? 'bg-emerald-50/30' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-bold text-foreground">
                          {curr.symbol}
                        </div>
                        <div>
                          <p className="font-bold">{curr.code} - {curr.name}</p>
                          {curr.isDefault && <p className="text-xs text-emerald-600 font-semibold">Mata Uang Dasar</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-mono text-xs">{curr.isDefault ? '1' : curr.rate}</p>
                    </td>
                    <td className="py-4 px-6">
                       <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={curr.isActive}
                          onChange={() => handleToggleActive(curr.id)}
                          disabled={curr.isDefault}
                          className="w-4 h-4 rounded border-border text-primary disabled:opacity-50"
                        />
                        <span className="text-xs font-semibold">{curr.isActive ? 'Aktif' : 'Nonaktif'}</span>
                      </label>
                    </td>
                    <td className="py-4 px-6">
                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!curr.isDefault && (
                          <button onClick={() => handleSetDefault(curr.id)} className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors mr-2">
                             Set Default
                          </button>
                        )}
                        <button onClick={() => openEdit(curr)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(curr.id)} disabled={curr.isDefault} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              {editingCurrency ? "Edit Mata Uang" : "Tambah Mata Uang"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1.5">Kode Kurs (USD, EUR, dll)</label>
                <input
                  required
                  type="text"
                  maxLength={3}
                  value={formData.code}
                  onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-emerald-400 outline-none uppercase font-mono text-sm"
                  placeholder="USD"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">Simbol ($, €, dll)</label>
                <input
                  required
                  type="text"
                  maxLength={5}
                  value={formData.symbol}
                  onChange={(e) => setFormData((p) => ({ ...p, symbol: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-emerald-400 outline-none font-bold text-sm text-center"
                  placeholder="$"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">Nama Lengkap Mata Uang</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-emerald-400 outline-none text-sm"
                placeholder="US Dollar"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">Nilai Tukar terhadap IDR (1 IDR = ?)</label>
               <input
                  required
                  type="number"
                  step="0.000001"
                  min="0"
                  value={formData.rate}
                  onChange={(e) => setFormData((p) => ({ ...p, rate: parseFloat(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-emerald-400 outline-none text-sm font-mono"
                  placeholder="0.000065"
                />
                <p className="text-xs text-muted-foreground mt-2 bg-muted/50 p-2 rounded-lg">Contoh Kasus: 1 IDR = 0.000065 USD. Jika harga paket 1.000.000 IDR, maka di web akan tampil sebagai 65 USD.</p>
            </div>
            
            <DialogFooter className="pt-4 border-t border-border mt-6">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 bg-muted text-muted-foreground font-bold rounded-xl hover:bg-muted/80 transition-colors">
                Batal
              </button>
              <button type="submit" className="px-7 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all">
                 Simpan Kurs
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

// Simple Globe Icon fallback
function GlobeIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
