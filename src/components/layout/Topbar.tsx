"use client";

import { Search, Bell } from "lucide-react";

interface TopbarProps {
  userName?: string;
}

export default function Topbar({ userName = "Admin" }: TopbarProps) {
  return (
    <header className="flex items-center justify-end gap-6 px-8 py-4 border-b border-gray-800 bg-gray-900">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search orders, agents, or locations..."
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      <button className="relative text-gray-400 hover:text-gray-200" aria-label="Notifications">
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm font-semibold">
          {userName.charAt(0)}
        </div>
        <span className="text-sm font-medium text-gray-200">{userName}</span>
      </div>
    </header>
  );
}
