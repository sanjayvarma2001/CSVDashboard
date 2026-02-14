"use client";
import React from "react";

export default function TableView({ data, onBack }: any) {
  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];
  const headData = data?.slice(0, 10) || [];

  return (
    <div className="w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-[11px] font-black text-[#3c4043] uppercase tracking-[0.25em]">
          Data Preview (Top 10 Rows)
        </h3>
        <button
          onClick={onBack}
          className="text-[11px] font-black text-[#1a73e8] uppercase tracking-widest hover:underline"
        >
          Close Preview
        </button>
      </div>

      <div className="bg-white/60 backdrop-blur-3xl rounded-[32px] border border-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#f8f9fa] z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="p-6 text-[10px] font-black text-[#3c4043] uppercase tracking-widest whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {headData.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-white/40 transition-colors">
                  {headers.map((header) => (
                    <td
                      key={header}
                      className="p-6 text-sm text-slate-600 font-medium whitespace-nowrap"
                    >
                      {String(row[header])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
