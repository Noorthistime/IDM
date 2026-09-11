"use client";

import { useState } from "react";
import Dispatcher from "@/components/Dispatcher";
import CreateOrder from "@/components/CreateOrder";

export default function OrdersPage() {
  const [tab, setTab] = useState<"list" | "create">("list");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Orders</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("list")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "list" ? "bg-blue-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gray-800"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setTab("create")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "create" ? "bg-blue-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gray-800"
            }`}
          >
            + Create Order
          </button>
        </div>
      </div>

      {tab === "list" ? <Dispatcher /> : <CreateOrder />}
    </div>
  );
}
