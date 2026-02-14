"use client";
import React from "react";
import { Sparkles, Table, MessageCircle, BarChart3 } from "lucide-react";
import VisualizationsView from "./VisualizationsView";

export default function InsightsView({
  insights,
  data,
  onTogglePreview,
  onToggleChat,
}: any) {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Combined Card: insights + visualizations */}
      <div className="bg-white/60 backdrop-blur-3xl p-6 rounded-[32px] border border-white shadow-sm mb-6 max-w-full">
        <div className="flex items-center gap-3 text-[#1a73e8] mb-4">
          <Sparkles size={20} className="fill-[#1a73e8]/10" />
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
            AI Strategy Summary
          </span>
        </div>

        {/* Content area: fixed max height with scroll for long insights or many charts */}
        <div className="max-h-[640px] overflow-y-auto pr-4">
          <div className="text-[#3c4043] text-[16px] leading-[1.7] whitespace-pre-wrap font-normal tracking-tight mb-6">
            {(() => {
              if (!insights) return null;
              const parts = String(insights).split(/\n\s*\n/);
              return parts[0]?.trim();
            })()}
          </div>

          {data && (
            <div className="space-y-8">
              <VisualizationsView data={data} />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons below the boxed card */}
      <div className="flex gap-5">
        <button
          onClick={onTogglePreview}
          className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-[24px] font-semibold text-[#3c4043] hover:bg-slate-50 transition-all shadow-sm"
        >
          <Table size={18} className="text-slate-400" />
          Preview Data
        </button>

        <button
          onClick={onToggleChat}
          className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-[#202124] rounded-[24px] font-semibold text-white hover:bg-black transition-all shadow-xl shadow-black/10"
        >
          <MessageCircle size={18} />
          Follow up
        </button>
      </div>
    </div>
  );
}
