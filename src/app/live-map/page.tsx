"use client";

import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const SystemMap = dynamic(() => import("@/components/SystemMap"), { ssr: false, loading: () => <div className="w-full h-full animate-pulse bg-gray-800" /> });

export default function LiveMapPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Live Map</h1>
      <div className="bg-gray-900 rounded-xl border border-gray-800 h-[70vh] flex flex-col overflow-hidden relative">
        <SystemMap />
      </div>
    </div>
  );
}
