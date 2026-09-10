"use client";

import { useState } from 'react';
import { Priority } from '@/types';

export default function CreateOrder() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerContact: '',
    lat: '',
    lng: '',
    details: '',
    priority: 'Medium' as Priority
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const lat = parseFloat(formData.lat);
      const lng = parseFloat(formData.lng);
      
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Invalid coordinates");
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerContact: formData.customerContact,
          customerLocation: { lat, lng },
          details: formData.details,
          priority: formData.priority
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const newOrder = await response.json();
      setSuccess(`Order created successfully: ${newOrder.id}`);
      setFormData({
        customerName: '',
        customerContact: '',
        lat: '',
        lng: '',
        details: '',
        priority: 'Medium'
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Create New Order</h2>
      
      {success && <div className="p-4 mb-6 text-green-700 bg-green-50 rounded-md border border-green-200">{success}</div>}
      {error && <div className="p-4 mb-6 text-red-700 bg-red-50 rounded-md border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
            <input required type="text" value={formData.customerContact} onChange={e => setFormData({...formData, customerContact: e.target.value})} className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Details</label>
          <textarea required value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full p-2 border rounded-md" rows={3}></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input required type="number" step="any" value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} placeholder="e.g. 40.7128" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input required type="number" step="any" value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} placeholder="e.g. -74.0060" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as Priority})} className="w-full p-2 border rounded-md bg-white">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
