import React from "react";
import { Activity, ShieldCheck, Clock } from "lucide-react";

export default function Sidebar({
  reports,
  selectedId,
  onSelect,
  status,
}: any) {
  return (
    <aside className="w-80 h-screen bg-white/40 backdrop-blur-3xl border-r border-slate-200/50 flex flex-col z-20">
      <div className="p-8 flex flex-col items-center gap-3">
        <h1 className="text-xl font-semibold text-[#3c4043] tracking-tighter leading-none">
          Dashboard
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col justify-center items-center gap-1">
        <p className="w-full text-center text-[11px] font-bold text-[#5f6368] uppercase tracking-widest mb-4">
          Recent Reports
        </p>
        <div className="w-full space-y-3 flex flex-col items-center">
          {/* CONDITIONAL CHECK */}
          {reports && reports.length > 0 ? (
            reports.slice(0, 5).map((r: any) => (
              <button
                key={r.id}
                onClick={() => onSelect(r.id)}
                className={`w-[90%] py-4 px-2 rounded-2xl transition-all text-sm text-center ${
                  selectedId === r.id
                    ? "bg-[#e8f0fe] text-[#1967d2] font-semibold shadow-sm"
                    : "text-[#3c4043] hover:bg-[#f1f3f4]"
                }`}
              >
                {r.filename}
              </button>
            ))
          ) : (
            /* EMPTY STATE MESSAGE */
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] text-center mt-4">
              No Recent Reports
            </p>
          )}
        </div>
      </nav>

      <div className="p-8 mt-auto border-t border-slate-100/30 bg-slate-50/20">
        {/* Header Label */}
        <div className="flex items-center gap-2 mb-4 px-1">
          <ShieldCheck size={14} className="text-slate-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            System Health
          </span>
        </div>

        {/* Status Cards */}
        <div className="space-y-2">
          <StatusItem label="Database" status={status.database} />
        </div>
      </div>
    </aside>
  );
}

const StatusItem = ({ label, status }: { label: string; status: string }) => {
  const isOnline = status === "Online" || status === "connected";

  return (
    <div className="flex items-center justify-between bg-white/60 p-3 rounded-xl border border-white shadow-sm">
      <span className="text-[10px] font-bold text-slate-500 uppercase">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <div
          className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-red-400"}`}
        />
        <span className="text-[10px] font-black uppercase text-slate-700">
          {status}
        </span>
      </div>
    </div>
  );
};
