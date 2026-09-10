"use client";

import { useState } from 'react';
import { AgentAvailability } from '@/types';

export default function AgentRegistration() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: '',
    availability: 'Available' as AgentAvailability
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

      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          location: { lat, lng },
          availability: formData.availability
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register agent');
      }

      const newAgent = await response.json();
      setSuccess(`Agent registered successfully: ${newAgent.id}`);
      setFormData({
        name: '',
        lat: '',
        lng: '',
        availability: 'Available'
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Register Delivery Agent</h2>
      
      {success && <div className="p-4 mb-6 text-green-700 bg-green-50 rounded-md border border-green-200">{success}</div>}
      {error && <div className="p-4 mb-6 text-red-700 bg-red-50 rounded-md border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Latitude</label>
            <input required type="number" step="any" value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} placeholder="e.g. 40.7128" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Longitude</label>
            <input required type="number" step="any" value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} placeholder="e.g. -74.0060" className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Initial Availability</label>
          <select value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value as AgentAvailability})} className="w-full p-2 border rounded-md bg-white">
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? 'Registering...' : 'Register Agent'}
          </button>
        </div>
      </form>
    </div>
  );
}
