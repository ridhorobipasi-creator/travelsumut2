import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState } from "react";
import { User, Plus, Edit, Trash2, Search, Shield, ShieldOff, KeyRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MOCK_USERS = [
  { id: 1, name: "Super Admin", email: "superadmin@wisatasumut.com", role: "superadmin", lastLogin: "2026-03-21T10:00:00Z", isActive: true, avatar: "SA" },
  { id: 2, name: "Admin Sumut", email: "admin@wisatasumut.com", role: "admin", lastLogin: "2026-03-20T15:30:00Z", isActive: true, avatar: "AS" },
  { id: 3, name: "Content Manager", email: "content@wisatasumut.com", role: "editor", lastLogin: "2026-03-19T09:15:00Z", isActive: true, avatar: "CM" },
  { id: 4, name: "Finance Staff", email: "finance@wisatasumut.com", role: "staff", lastLogin: "2026-03-15T14:00:00Z", isActive: false, avatar: "FS" },
];

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  superadmin: { label: "Super Admin", color: "bg-purple-100 text-purple-700" },
  admin: { label: "Admin", color: "bg-blue-100 text-blue-700" },
  editor: { label: "Editor", color: "bg-amber-100 text-amber-700" },
  staff: { label: "Staff", color: "bg-gray-100 text-gray-600" },
};

const emptyForm = { name: "", email: "", role: "staff", password: "", isActive: true };

export default function AdminUser() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const openAdd = () => {
    setEditingUser(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (user: typeof MOCK_USERS[0]) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, password: "", isActive: user.isActive });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (id === 1) return alert("Super Admin tidak dapat dihapus.");
    if (confirm("Yakin hapus pengguna ini?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleToggleActive = (id: number) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers((prev) => prev.map((u) => u.id === editingUser.id ? { ...u, ...formData, avatar: formData.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) } : u));
    } else {
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData,
        lastLogin: "-",
        avatar: formData.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      };
      setUsers((prev) => [newUser, ...prev]);
    }
    setIsFormOpen(false);
  };

  const formatDate = (dateStr: string) => {
    if (dateStr === "-") return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Manajemen Pengguna</h1>
          <p className="text-muted-foreground mt-1">Kelola akun admin dan hak akses sistem.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" /> Tambah Pengguna
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Pengguna", value: users.length, color: "text-primary" },
          { label: "Aktif", value: users.filter(u => u.isActive).length, color: "text-emerald-600" },
          { label: "Nonaktif", value: users.filter(u => !u.isActive).length, color: "text-rose-500" },
          { label: "Admin", value: users.filter(u => ["admin", "superadmin"].includes(u.role)).length, color: "text-purple-600" },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-5">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-sm bg-muted/10">
                <th className="py-4 px-6 font-semibold">Pengguna</th>
                <th className="py-4 px-6 font-semibold">Role</th>
                <th className="py-4 px-6 font-semibold">Login Terakhir</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((user) => {
                const roleInfo = ROLE_LABELS[user.role] || ROLE_LABELS.staff;
                return (
                  <tr key={user.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border-2 border-primary/20">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-bold">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${roleInfo.color}`}>{roleInfo.label}</span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{formatDate(user.lastLogin)}</td>
                    <td className="py-4 px-6">
                      {user.isActive ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Aktif</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">Nonaktif</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleToggleActive(user.id)} className={`p-2 rounded-lg transition-colors ${user.isActive ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"}`} title={user.isActive ? "Nonaktifkan" : "Aktifkan"}>
                          {user.isActive ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-bold mb-1.5">Nama Lengkap</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none text-sm"
                placeholder="Nama lengkap pengguna"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">Email</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none text-sm"
                placeholder="email@wisatasumut.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none text-sm"
              >
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" /> {editingUser ? "Password Baru (kosongkan jika tidak diubah)" : "Password"}
              </label>
              <input
                type="password"
                required={!editingUser}
                value={formData.password}
                onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none text-sm"
                placeholder="••••••••"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                className="w-4 h-4 rounded border-border text-primary"
              />
              <span className="text-sm font-medium">Pengguna Aktif</span>
            </label>
            <DialogFooter className="pt-4 border-t border-border">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 bg-muted text-muted-foreground font-bold rounded-xl hover:bg-muted/80 transition-colors">
                Batal
              </button>
              <button type="submit" className="px-7 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
                {editingUser ? "Simpan" : "Tambah"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
