"use client";

import { useState, useEffect } from 'react';
import { DeliveryAgent, Order, DeliveryStatus } from '@/types';

export default function AgentDashboard() {
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [agentRoute, setAgentRoute] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agents');
      const data = await res.json();
      setAgents(data);
      if (data.length > 0 && !selectedAgentId) {
        setSelectedAgentId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchRoute = async () => {
    if (!selectedAgentId) return;
    setRouteLoading(true);
    try {
      const res = await fetch(`/api/agents/${selectedAgentId}/route-sequence`);
      if (res.ok) {
        const data = await res.json();
        setAgentRoute(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRouteLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, [selectedAgentId]);

  const handleStatusUpdate = async (orderId: string, newStatus: DeliveryStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchRoute();
        fetchAgents(); // Refresh workload
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="text-center p-8">Loading agents...</div>;

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800 text-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="w-full md:w-auto">
          <h2 className="text-xl font-semibold mb-2">Select Agent View</h2>
          <select 
            value={selectedAgentId} 
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="p-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 w-full md:w-64"
          >
            {agents.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.availability})</option>
            ))}
          </select>
        </div>
        
        {selectedAgent && (
          <div className="flex gap-8 md:border-l md:pl-8 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Status</div>
              <div className="font-semibold text-lg text-gray-100">{selectedAgent.availability}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Workload</div>
              <div className="font-semibold text-lg text-gray-100">{selectedAgent.activeOrdersCount} active orders</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Location</div>
              <div className="font-mono text-sm mt-1 text-gray-100">{selectedAgent.location.lat.toFixed(3)}, {selectedAgent.location.lng.toFixed(3)}</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800 text-gray-100">
        <h3 className="text-xl font-semibold mb-6 flex justify-between items-center">
          Smart Route Sequence
          <button onClick={fetchRoute} className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded transition text-gray-100">Refresh Route</button>
        </h3>

        {routeLoading ? (
          <div className="text-center py-8 text-gray-400 animate-pulse">Calculating optimal route...</div>
        ) : agentRoute.length === 0 ? (
          <div className="text-center py-8 text-gray-400 bg-gray-800/50 rounded border border-gray-700 border-dashed">No active orders assigned to this agent.</div>
        ) : (
          <div className="space-y-4 relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200 z-0 hidden md:block"></div>
            {agentRoute.map((order, index) => (
              <div key={order.id} className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 border-4 border-white hidden md:flex items-center justify-center font-bold text-blue-600 shadow-sm shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 border border-gray-700 rounded-md p-5 bg-gray-800 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="font-semibold text-lg mb-1 text-gray-100">{order.details}</div>
                    <div className="text-sm text-gray-400 mb-2">
                      <span className="font-medium text-gray-200">{order.customerName}</span> • {order.customerContact}
                    </div>
                    <div className="text-sm text-gray-400 bg-gray-900 inline-block px-2 py-1 rounded border border-gray-700 mb-3">
                      📍 {order.address || `${order.customerLocation.lat.toFixed(4)}, ${order.customerLocation.lng.toFixed(4)}`}
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                        order.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        order.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>{order.priority}</span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-800 border border-blue-100 rounded text-xs font-medium">{order.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full md:w-40 shrink-0 justify-center">
                    {order.status === 'Assigned' && (
                      <button onClick={() => handleStatusUpdate(order.id, 'Picked Up')} className="bg-purple-600 text-white px-3 py-2 text-sm rounded hover:bg-purple-700 transition shadow-sm font-medium">Mark Picked Up</button>
                    )}
                    {order.status === 'Picked Up' && (
                      <button onClick={() => handleStatusUpdate(order.id, 'In Transit')} className="bg-yellow-600 text-white px-3 py-2 text-sm rounded hover:bg-yellow-700 transition shadow-sm font-medium">Mark In Transit</button>
                    )}
                    {order.status === 'In Transit' && (
                      <button onClick={() => handleStatusUpdate(order.id, 'Delivered')} className="bg-green-600 text-white px-3 py-2 text-sm rounded hover:bg-green-700 transition shadow-sm font-medium">Mark Delivered</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
