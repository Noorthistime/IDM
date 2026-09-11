import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  change?: string;
  changeLabel?: string;
}

export default function StatCard({ icon, iconBg, label, value, change, changeLabel }: StatCardProps) {
  return (
    <div className="glass-panel metallic-border p-5 flex items-center gap-4 hover:shadow-[0_0_20px_rgba(16,185,129,0.05)] transition-all duration-300">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-400">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-gray-100">{value}</p>
          {change && <span className="text-xs text-green-600 font-medium">{change}</span>}
        </div>
        {changeLabel && <p className="text-xs text-gray-500">{changeLabel}</p>}
      </div>
    </div>
  );
}
