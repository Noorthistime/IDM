"use client";

import { useState, useEffect } from 'react';
import { Order, AssignmentResult } from '@/types';

export default function Dispatcher() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [recommendation, setRecommendation] = useState<{orderId: string, result: AssignmentResult} | null>(null);
  const [assigning, setAssigning] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRecommend = async (orderId: string) => {
    try {
      const res = await fetch('/api/assignment/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      setRecommendation({ orderId, result });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAssign = async (orderId: string, agentId: string) => {
    setAssigning(true);
    try {
      const res = await fetch('/api/assignment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, agentId })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      alert("Order assigned successfully");
      setRecommendation(null);
      fetchOrders();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  const pendingOrders = orders.filter(o => o.status === 'Pending');

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800 text-gray-100">
        <h2 className="text-2xl font-semibold mb-6 flex justify-between items-center">
          Pending Orders
          <button onClick={fetchOrders} className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded transition text-gray-100">Refresh</button>
        </h2>

        {pendingOrders.length === 0 ? (
          <p className="text-gray-400">No pending orders to assign.</p>
        ) : (
          <div className="space-y-4">
            {pendingOrders.map(order => (
              <div key={order.id} className="border border-gray-800 p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-800/50 text-gray-100">
                <div>
                  <div className="font-semibold text-lg">{order.details} <span className="text-sm font-normal text-gray-400">({order.id})</span></div>
                  <div className="text-sm text-gray-400">Customer: {order.customerName} - {order.customerContact}</div>
                  <div className="text-sm text-gray-400">Location: {order.address || `${order.customerLocation.lat.toFixed(4)}, ${order.customerLocation.lng.toFixed(4)}`}</div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      order.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                      order.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                      order.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.priority}
                    </span>
                  </div>
                </div>

                <div className="w-full md:w-auto">
                  {recommendation?.orderId === order.id ? (
                    <div className="bg-gray-800 p-4 rounded border border-blue-500/30 shadow-sm max-w-sm text-gray-100">
                      {recommendation.result.recommendedAgentId ? (
                        <>
                          <div className="text-sm font-semibold mb-2">Recommendation Reasoning</div>
                          <div className="text-xs text-gray-300 mb-4">{recommendation.result.reasoning}</div>
                          <button 
                            disabled={assigning}
                            onClick={() => handleAssign(order.id, recommendation.result.recommendedAgentId!)}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition"
                          >
                            {assigning ? 'Assigning...' : 'Confirm Assignment'}
                          </button>
                        </>
                      ) : (
                        <div className="text-red-600 text-sm font-medium">
                          {recommendation.result.reasoning}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleRecommend(order.id)}
                      className="w-full md:w-auto bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition font-medium"
                    >
                      Smart Assign
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800 text-gray-100">
        <h2 className="text-2xl font-semibold mb-4">All Orders Tracker</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-800/50 border-b border-gray-800">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-100">ID</th>
                <th className="px-4 py-3 font-medium text-gray-100">Details</th>
                <th className="px-4 py-3 font-medium text-gray-100">Priority</th>
                <th className="px-4 py-3 font-medium text-gray-100">Status</th>
                <th className="px-4 py-3 font-medium text-gray-100">Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-800 border-gray-800">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{order.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-200">{order.details}</td>
                  <td className="px-4 py-3 text-gray-300">{order.priority}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-800 rounded-full text-xs font-medium text-gray-300">{order.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{order.assignedAgentId || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
