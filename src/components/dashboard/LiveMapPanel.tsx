"use client";

import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const SystemMap = dynamic(() => import("../SystemMap"), { ssr: false, loading: () => <div className="w-full h-full animate-pulse bg-gray-800" /> });

export default function LiveMapPanel() {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <h3 className="font-semibold text-gray-100">Live Map</h3>
          <span className="text-xs text-gray-500 ml-1">Real-time agent and order locations</span>
        </div>
        <Link href="/live-map" className="text-sm text-blue-400 font-medium flex items-center gap-1 hover:underline shrink-0">
          View Full Map <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex-1 min-h-[260px] rounded-lg bg-gray-800/50 border border-gray-700 flex flex-col overflow-hidden relative">
        <SystemMap />
      </div>
    </div>
  );
}
