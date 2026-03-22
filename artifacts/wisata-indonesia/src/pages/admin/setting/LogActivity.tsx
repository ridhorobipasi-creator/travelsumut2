import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState } from "react";
import { Activity, Search, Filter, ShieldAlert, Monitor, LogIn, FileEdit, Trash2, CheckCircle, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

const MOCK_LOGS = [
  { id: 101, timestamp: "2026-03-21T09:15:30Z", user: "Admin (budi)", action: "login", target: "System Auth", details: "Successful login from IP 114.120.x.x", type: "auth" },
  { id: 102, timestamp: "2026-03-21T09:20:12Z", user: "Admin (budi)", action: "update", target: "Package (ID: 2)", details: "Updated price and quota for package 'Petualangan Bukit Lawang'", type: "content" },
  { id: 103, timestamp: "2026-03-21T10:05:00Z", user: "System Auto", action: "sync", target: "Instagram API", details: "Failed to fetch feeds: Access Token Expired", type: "system", isError: true },
  { id: 104, timestamp: "2026-03-21T10:45:22Z", user: "Staff (nina)", action: "approve", target: "Booking (ORD-20260401-1)", details: "Verified payment and approved booking status", type: "transaction" },
  { id: 105, timestamp: "2026-03-21T11:30:10Z", user: "Editor (dodi)", action: "create", target: "Static Page", details: "Created new page '/halaman/promo-ramadhan'", type: "content" },
  { id: 106, timestamp: "2026-03-21T14:12:05Z", user: "Admin (budi)", action: "delete", target: "User Review (ID: 6)", details: "Deleted span/rejected review permanently", type: "moderation", isWarning: true },
  { id: 107, timestamp: "2026-03-21T15:00:00Z", user: "System DB", action: "backup", target: "Database System", details: "Automated daily backup completed successfully", type: "system" },
];

const LOG_ICONS = {
  auth: LogIn,
  content: FileEdit,
  system: Monitor,
  transaction: CheckCircle,
  moderation: ShieldAlert,
};

const LOG_COLORS = {
  auth: "text-blue-600 bg-blue-50",
  content: "text-emerald-600 bg-emerald-50",
  system: "text-purple-600 bg-purple-50",
  transaction: "text-amber-600 bg-amber-50",
  moderation: "text-rose-600 bg-rose-50",
};

export default function LogActivity() {
  const [logs] = useState(MOCK_LOGS.reverse()); // Show newest first
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filtered = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = log.user.toLowerCase().includes(q) || log.action.toLowerCase().includes(q) || log.target.toLowerCase().includes(q) || log.details.toLowerCase().includes(q);
    const matchType = filterType === "all" || log.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-display font-bold flex items-center gap-3">
             <Activity className="w-8 h-8 text-primary" /> System Activity Log
           </h1>
           <p className="text-muted-foreground mt-1">Audit trail (Rekam jejak) aktivitas admin dan background job system.</p>
        </div>
        <button
           className="px-4 py-2.5 rounded-xl border border-border bg-card font-bold text-sm flex items-center gap-2 hover:bg-muted/50 transition-all text-muted-foreground cursor-not-allowed"
           disabled
           title="Hanya Superadmin (Database Level) yang dapat membersihkan log."
        >
          <Trash2 className="w-4 h-4" /> Clear Log (Restricted)
        </button>
      </div>

       <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col min-h-[600px]">
        {/* Filters Top Bar */}
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari user, aktivitas, referensi target, atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-mono placeholder:font-sans"
            />
          </div>
          <div className="flex gap-2 items-center">
             <div className="px-3 py-2 bg-white rounded-lg border border-border flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground"/>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-transparent text-sm focus:outline-none font-bold outline-none cursor-pointer"
                >
                  <option value="all">Semua Tipe Event</option>
                  <option value="auth">Authentikasi (Login/Logout)</option>
                  <option value="content">Manajemen Konten (CRUD)</option>
                  <option value="transaction">Transaksi & Order</option>
                  <option value="moderation">Moderasi Sistem</option>
                  <option value="system">Sistem (Auto/Job/Error)</option>
                </select>
             </div>
          </div>
        </div>

        {/* List of logs / timeline */}
        <div className="flex-1 overflow-y-auto bg-muted/5 p-4 md:p-6 pb-20">
           <div className="max-w-4xl mx-auto space-y-4">
              {filtered.length === 0 ? (
                 <div className="py-20 text-center text-muted-foreground font-medium">
                   <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
                   Tidak ada rekam log sesuai filter pencarian.
                 </div>
              ) : (
                 filtered.map((log) => {
                    const Icon = LOG_ICONS[log.type as keyof typeof LOG_ICONS] || Activity;
                    const colorClass = LOG_COLORS[log.type as keyof typeof LOG_COLORS] || "text-gray-600 bg-gray-100";
                    const isSystemAlert = log.isError || log.isWarning;

                    return (
                       <div key={log.id} className={`group flex gap-4 p-4 rounded-xl border transition-all hover:shadow-sm bg-white ${isSystemAlert ? (log.isError ? "border-rose-200 bg-rose-50/30" : "border-amber-200 bg-amber-50/30") : "border-border/60 hover:border-border"}`}>
                          
                          {/* Icon Left */}
                          <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${colorClass}`}>
                             <Icon className="w-5 h-5" />
                          </div>

                          {/* Content Right */}
                          <div className="flex-1 min-w-0">
                             <div className="flex flex-col sm:flex-row xl:items-center justify-between gap-1 sm:gap-4 mb-2">
                                <p className="font-bold text-foreground flex items-center flex-wrap gap-2 text-sm leading-tight">
                                   <span className="bg-muted px-2 py-0.5 rounded text-muted-foreground text-[10px] font-mono border border-border">[{log.user}]</span>
                                   <span className="uppercase text-[11px] tracking-wider font-extrabold px-1.5 rounded" style={{background: 'rgba(0,0,0,0.05)'}}>{log.action}</span>
                                   pada
                                   <span className="font-mono text-[13px] break-all">{log.target}</span>
                                </p>
                                <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5 shrink-0 bg-white sm:bg-transparent py-1 w-max rounded">
                                   <Clock className="w-3 h-3" />
                                   {formatDate(log.timestamp.split('T')[0])} · {log.timestamp.split('T')[1].slice(0,5)}
                                </span>
                             </div>

                             <div className={`text-sm leading-relaxed p-3 rounded-lg border border-dashed font-mono ${isSystemAlert ? (log.isError ? "bg-rose-50 border-rose-200 text-rose-800" : "bg-amber-50 border-amber-200 text-amber-800") : "bg-muted/30 border-border/50 text-muted-foreground"}`}>
                                {isSystemAlert && "⚠️ SYSTEM ALERT: "}
                                {log.details}
                             </div>
                          </div>
                          
                       </div>
                    )
                 })
              )}
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
