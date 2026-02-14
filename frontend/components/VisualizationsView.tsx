"use client";
import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function VisualizationsView({ data }: any) {
  if (!data || data.length === 0) {
    return (
      <div className="text-slate-400">No data available for visualization</div>
    );
  }

  const numericData = data.map((row: any) => {
    const filtered: any = {};
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === "number") {
        filtered[key] = value;
      } else if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        !isNaN(Number(value))
      ) {
        filtered[key] = Number(value);
      }
    }
    return filtered;
  });

  const numericKeys = numericData.length > 0 ? Object.keys(numericData[0]) : [];

  if (numericKeys.length === 0) {
    return (
      <div className="text-slate-400">No numeric columns to visualize</div>
    );
  }

  const key1 = numericKeys[0];
  const key2 = numericKeys[1] || numericKeys[0];

  const sampleData = numericData
    .slice(0, 10)
    .map((row: any, i: number) => ({ index: i + 1, ...row }));

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp size={22} className="text-[#1a73e8]" />
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
          Data Visualizations
        </span>
      </div>

      {/* Bar Chart */}
      <div className="bg-white/60 backdrop-blur-3xl p-8 rounded-[32px] border border-white shadow-sm">
        <h3 className="text-[14px] font-semibold text-[#3c4043] mb-6">
          Distribution: {key1}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e8e8e8",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey={key1} fill="#1a73e8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      {numericKeys.length > 1 && (
        <div className="bg-white/60 backdrop-blur-3xl p-8 rounded-[32px] border border-white shadow-sm">
          <h3 className="text-[14px] font-semibold text-[#3c4043] mb-6">
            Trend: {key1} vs {key2}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e8e8e8",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={key1}
                stroke="#1a73e8"
                strokeWidth={2}
                dot={false}
              />
              {key2 !== key1 && (
                <Line
                  type="monotone"
                  dataKey={key2}
                  stroke="#ea4335"
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Scatter Chart for Outliers */}
      {numericKeys.length > 1 && (
        <div className="bg-white/60 backdrop-blur-3xl p-8 rounded-[32px] border border-white shadow-sm">
          <h3 className="text-[14px] font-semibold text-[#3c4043] mb-6">
            Correlation: {key1} vs {key2}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
              <XAxis dataKey={key1} name={key1} />
              <YAxis dataKey={key2} name={key2} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e8e8e8",
                  borderRadius: "8px",
                }}
              />
              <Scatter
                name={`${key1} vs ${key2}`}
                data={sampleData}
                fill="#34a853"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="text-[12px] text-slate-500 p-4 bg-slate-50/50 rounded-xl">
        📊 Showing first 10 records for clarity. Full dataset contains{" "}
        {data.length} records.
      </div>
    </div>
  );
}
