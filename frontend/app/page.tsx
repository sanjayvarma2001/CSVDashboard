"use client";
import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import InsightsView from "@/components/InsightsView";
import TableView from "@/components/TableView";
import ChatInterface from "@/components/ChatInterface";
import { ArrowLeft, Upload } from "lucide-react";

export default function Page() {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState<any>(null);
  const [view, setView] = useState<"insights" | "preview">("insights");
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState({ database: "...", llm: "..." });

  const fetchHistory = async () => {
    const data = await api.getRecentReports();
    setReports(data);
  };

  useEffect(() => {
    fetchHistory();
    api
      .checkHealth()
      .then(setHealth)
      .catch(() => setHealth({ database: "OFFLINE", llm: "OFFLINE" }));
  }, []);

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const data = await api.uploadCSV(file);
      setSelected(data);
      await fetchHistory();
      setView("insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-[#f8f9fa]">
      <Sidebar
        reports={reports}
        selectedId={selected?.id}
        onSelect={async (id: number) => {
          const report = await api.getReportById(id);
          setSelected(report);
          setView("insights");
        }}
        status={health}
      />

      <section className="flex-1 flex items-center justify-center">
        {!selected ? (
          /* --- UPLOAD STATE --- */
          <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-1000">
            <h1 className="text-[56px] font-light text-[#202124] tracking-tight leading-tight mb-12 max-w-2xl">
              Unlock insights from your data.
            </h1>

            <label className="group relative cursor-pointer">
              <div className="absolute -inset-1 bg-slate-200 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

              <div className="relative bg-white border border-[#dadce0] px-12 py-5 rounded-full font-medium text-[#3c4043] shadow-sm group-hover:bg-[#f1f3f4] transition-all flex items-center gap-3">
                <Upload size={20} className="text-[#1a73e8]" />
                {loading ? "Analyzing Dataset..." : "Choose CSV file"}
              </div>
              <input
                type="file"
                hidden
                onChange={handleUpload}
                accept=".csv"
                disabled={loading}
              />
            </label>

            {loading && (
              <p className="mt-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">
                Processing with Gemini AI
              </p>
            )}
          </div>
        ) : (
          /* --- ANALYSIS STATE --- */
          <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={() => setSelected(null)}
              className="group flex items-center gap-2 text-[12px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#1a73e8] mb-10 transition-colors"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to upload
            </button>

            {view === "insights" ? (
              <InsightsView
                insights={selected.ai_insights || selected.insight}
                data={selected.raw_data || selected.preview}
                onTogglePreview={() => setView("preview")}
                onToggleChat={() => setShowChat(true)}
              />
            ) : (
              <TableView
                data={selected.raw_data || selected.preview}
                onBack={() => setView("insights")}
              />
            )}
          </div>
        )}

        {showChat && (
          <ChatInterface
            history={selected?.chat_history || []}
            onClose={() => setShowChat(false)}
            onSend={async (msg: string) => {
              const res = await api.sendChatMessage(selected.id, msg);
              setSelected({ ...selected, chat_history: res.history });
            }}
            loading={false}
          />
        )}
      </section>
    </main>
  );
}
