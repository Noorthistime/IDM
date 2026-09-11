"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Users, Map, BarChart3, Settings, Box } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/agents", label: "Agents", icon: Users },
  { href: "/live-map", label: "Live Map", icon: Map },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 glass-panel metallic-border border-r-0 flex flex-col h-screen sticky top-0 relative z-10">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center glow-text-emerald">
          <Box className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="font-bold text-gray-100 leading-none">IDM</p>
          <p className="text-xs text-gray-400 mt-0.5">Delivering Possibilities</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                active
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
