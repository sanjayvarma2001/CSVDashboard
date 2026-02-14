"use client";
import React, { useState } from "react";
import { Send, X } from "lucide-react";

export default function ChatInterface({
  history,
  onSend,
  onClose,
  loading,
}: any) {
  const [input, setInput] = useState("");

  return (
    /* Positioned at the bottom right instead of full-height right */
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-8 duration-500">
      {/* Reduced Width to 360px and added a max-height */}
      <div className="w-[360px] h-[550px] bg-white/80 backdrop-blur-3xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-white">
        {/* Compact Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h3 className="font-semibold text-[#202124] text-sm">Assistant</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        {/* Messages with Tighter Padding */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {history.map((m: any, i: number) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3.5 px-4 rounded-2xl text-[13px] leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#202124] text-white"
                    : "bg-white border border-slate-100 text-[#3c4043] shadow-sm"
                }`}
              >
                {typeof m.parts === "string" ? m.parts : m.parts?.[0]?.text || m.parts?.[0] || ""}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">
              Gemini is thinking...
            </div>
          )}
        </div>

        {/* Smaller Input Form */}
        <form
          className="p-5 bg-white/40 border-t border-slate-100"
          onSubmit={(e) => {
            e.preventDefault();
            onSend(input);
            setInput("");
          }}
        >
          <div className="relative flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-10 text-[13px] outline-none focus:border-[#202124] transition-all"
              placeholder="Ask a question..."
            />
            <button type="submit" className="absolute right-2 p-1.5 bg-[#202124] text-white rounded-lg hover:bg-black transition-colors">
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
