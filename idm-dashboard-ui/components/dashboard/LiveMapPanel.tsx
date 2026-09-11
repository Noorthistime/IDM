import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";

export default function LiveMapPanel() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <h3 className="font-semibold text-gray-900">Live Map</h3>
          <span className="text-xs text-gray-400 ml-1">Real-time agent and order locations</span>
        </div>
        <Link href="/live-map" className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline shrink-0">
          View Full Map <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex-1 min-h-[260px] rounded-lg bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6">
        <MapPin className="w-8 h-8 text-gray-300 mb-2" />
        <p className="text-sm font-medium text-gray-500">Map integration coming soon</p>
        <p className="text-xs text-gray-400 mt-1">This panel will show live agent and order pins once a map provider is wired up.</p>
      </div>
    </div>
  );
}
