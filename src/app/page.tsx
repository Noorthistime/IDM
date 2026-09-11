"use client";

import { useEffect, useState } from "react";
import { Package, Users, Zap, Clock, CheckCircle2, UserCheck } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import RecentOrdersList from "@/components/dashboard/RecentOrdersList";
import LiveMapPanel from "@/components/dashboard/LiveMapPanel";
import type { Order, DeliveryAgent } from "@/types";

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);

  useEffect(() => {
    fetch("/api/orders").then((r) => r.json()).then(setOrders).catch(() => setOrders([]));
    fetch("/api/agents").then((r) => r.json()).then(setAgents).catch(() => setAgents([]));
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const availableAgents = agents.filter((a) => a.availability === "Available").length;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Good Morning!</h1>
          <p className="text-sm text-gray-400 mt-1">Here&apos;s what&apos;s happening with your deliveries today.</p>
        </div>
        <p className="text-sm text-gray-400 mt-1">{today}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <QuickActionCard
          icon={<Package className="w-6 h-6 text-emerald-400 glow-text-emerald" />}
          iconBg="bg-emerald-500/10 border border-emerald-500/20"
          title="Create New Order"
          description="Add a new delivery with location, package details and priority."
          ctaLabel="Create Order"
          ctaBg="bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          href="/orders"
        />
        <QuickActionCard
          icon={<Users className="w-6 h-6 text-emerald-400 glow-text-emerald" />}
          iconBg="bg-emerald-500/10 border border-emerald-500/20"
          title="Register New Agent"
          description="Add a delivery agent with availability and current location."
          ctaLabel="Register Agent"
          ctaBg="bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          href="/agents"
        />
        <QuickActionCard
          icon={<Zap className="w-6 h-6 text-emerald-400 glow-text-emerald" />}
          iconBg="bg-emerald-500/10 border border-emerald-500/20"
          title="Live Tracking"
          description="View all orders and agents on the map in real time."
          ctaLabel="Open Live Map"
          ctaBg="bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          href="/live-map"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Package className="w-5 h-5 text-emerald-400 glow-text-emerald" />}
          iconBg="bg-emerald-500/10 border border-emerald-500/20"
          label="Total Orders"
          value={totalOrders}
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-emerald-400 glow-text-emerald" />}
          iconBg="bg-emerald-500/10 border border-emerald-500/20"
          label="Pending Orders"
          value={pendingOrders}
        />
        <StatCard
          icon={<UserCheck className="w-5 h-5 text-emerald-400 glow-text-emerald" />}
          iconBg="bg-emerald-500/10 border border-emerald-500/20"
          label="Available Agents"
          value={`${availableAgents} / ${agents.length}`}
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400 glow-text-emerald" />}
          iconBg="bg-emerald-500/10 border border-emerald-500/20"
          label="Delivered Orders"
          value={deliveredOrders}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LiveMapPanel />
        <RecentOrdersList />
      </div>
    </>
  );
}
