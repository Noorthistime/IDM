"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import type { Order, Priority, DeliveryStatus } from "@/types";

const priorityStyles: Record<Priority, string> = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-600",
  Urgent: "bg-purple-100 text-purple-700",
};

const statusStyles: Record<DeliveryStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Assigned: "bg-blue-100 text-blue-700",
  "Picked Up": "bg-indigo-100 text-indigo-700",
  "In Transit": "bg-indigo-100 text-indigo-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-gray-100 text-gray-500",
};

export default function RecentOrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load orders");
        return res.json();
      })
      .then((data: Order[]) => {
        const sorted = [...data].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
        setOrders(sorted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Recent Orders</h3>
        <Link href="/orders" className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading && <p className="text-sm text-gray-400 py-6 text-center">Loading orders...</p>}
      {error && <p className="text-sm text-red-500 py-6 text-center">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="text-sm text-gray-400 py-6 text-center">No orders yet.</p>
      )}

      <div className="space-y-1">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-blue-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                #{order.id} &middot; {order.customerName}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {order.customerLocation.lat.toFixed(3)}, {order.customerLocation.lng.toFixed(3)}
              </p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${priorityStyles[order.priority]}`}>
              {order.priority}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${statusStyles[order.status]}`}>
              {order.status}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
