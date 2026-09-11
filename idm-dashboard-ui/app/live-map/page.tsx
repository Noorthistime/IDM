import { MapPin } from "lucide-react";

export default function LiveMapPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Live Map</h1>
      <div className="bg-white rounded-xl border border-gray-200 min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <MapPin className="w-10 h-10 text-gray-300 mb-3" />
        <p className="font-medium text-gray-500">Map integration coming soon</p>
        <p className="text-sm text-gray-400 mt-1 max-w-sm">
          This page will show live agent and order pins once a map provider (Google Maps or Mapbox) is wired up.
        </p>
      </div>
    </div>
  );
}
