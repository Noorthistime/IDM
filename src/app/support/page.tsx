import { Phone, Clock } from "lucide-react";

export default function SupportPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Support</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-lg">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
          <Phone className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="font-semibold text-gray-900 mb-1">Need help?</h2>
        <p className="text-sm text-gray-500 mb-6">Our support team is available to help with orders, deliveries, or account issues.</p>
        <a href="tel:9322401297" className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors mb-3">
          <Phone className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-xs text-gray-400">Call us</p>
            <p className="text-sm font-semibold text-gray-900">9322401297</p>
          </div>
        </a>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
          <Clock className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Availability</p>
            <p className="text-sm font-medium text-gray-700">Mon-Sat, 9 AM - 8 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
