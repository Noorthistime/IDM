"use client";

import { useState } from "react";
import AgentDashboard from "@/components/AgentDashboard";
import AgentRegistration from "@/components/AgentRegistration";

export default function AgentsPage() {
  const [tab, setTab] = useState<"list" | "register">("list");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("list")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "list" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Agents
          </button>
          <button
            onClick={() => setTab("register")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "register" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            + Register Agent
          </button>
        </div>
      </div>

      {tab === "list" ? <AgentDashboard /> : <AgentRegistration />}
    </div>
  );
}
