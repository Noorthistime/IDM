"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import type { Order, Priority, DeliveryStatus } from "@/types";

const priorityStyles: Record<Priority, string> = {
  Low: "bg-gray-800 text-gray-400",
  Medium: "bg-amber-500/10 text-amber-500",
  High: "bg-red-500/10 text-red-500",
  Urgent: "bg-purple-500/10 text-purple-400",
};

const statusStyles: Record<DeliveryStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-500",
  Assigned: "bg-blue-500/10 text-blue-400",
  "Picked Up": "bg-indigo-500/10 text-indigo-400",
  "In Transit": "bg-indigo-500/10 text-indigo-400",
  Delivered: "bg-green-500/10 text-green-500",
  Cancelled: "bg-gray-800 text-gray-400",
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
    <div className="glass-panel metallic-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-100">Recent Orders</h3>
        <Link href="/orders" className="text-sm text-emerald-400 font-medium flex items-center gap-1 hover:underline">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading && <p className="text-sm text-gray-500 py-6 text-center">Loading orders...</p>}
      {error && <p className="text-sm text-red-500 py-6 text-center">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="text-sm text-gray-500 py-6 text-center">No orders yet.</p>
      )}

      <div className="space-y-1">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="flex items-center gap-3 py-3 px-3 -mx-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 glow-text-emerald group-hover:bg-emerald-500/20 transition-all">
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-100 truncate">
                #{order.id} &middot; {order.customerName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {order.address || `${order.customerLocation.lat.toFixed(3)}, ${order.customerLocation.lng.toFixed(3)}`}
              </p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${priorityStyles[order.priority]}`}>
              {order.priority}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${statusStyles[order.status]}`}>
              {order.status}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
