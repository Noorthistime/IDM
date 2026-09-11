"use client";

import { useState, useEffect } from 'react';
import { Priority } from '@/types';
import dynamic from 'next/dynamic';

const LocationMap = dynamic(() => import('./LocationMap'), { ssr: false, loading: () => <div className="h-full w-full bg-gray-800 rounded-lg animate-pulse" /> });

export default function CreateOrder() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');

  const [formData, setFormData] = useState({
    customerName: '',
    customerContact: '',
    lat: '40.7128',
    lng: '-74.0060',
    details: '',
    priority: 'Medium' as Priority
  });

  // Reverse Geocoding with debounce
  useEffect(() => {
    const lat = parseFloat(formData.lat);
    const lng = parseFloat(formData.lng);
    
    if (isNaN(lat) || isNaN(lng)) {
      setAddress('');
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        if (data && data.display_name) {
          setAddress(data.display_name);
        } else {
          setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
      } catch (err) {
        setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [formData.lat, formData.lng]);

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
          address: address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
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
      setAddress('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parsedLat = parseFloat(formData.lat);
  const parsedLng = parseFloat(formData.lng);
  const hasValidCoords = !isNaN(parsedLat) && !isNaN(parsedLng);

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-100">Create New Order</h2>
      
      {success && <div className="p-4 mb-6 text-green-400 bg-green-500/10 rounded-md border border-green-500/20">{success}</div>}
      {error && <div className="p-4 mb-6 text-red-400 bg-red-500/10 rounded-md border border-red-500/20">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Customer Name</label>
              <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Contact Info</label>
              <input required type="text" value={formData.customerContact} onChange={e => setFormData({...formData, customerContact: e.target.value})} className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Order Details</label>
            <textarea required value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:border-blue-500" rows={3}></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Latitude</label>
              <input required type="number" step="any" value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} placeholder="e.g. 40.7128" className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Longitude</label>
              <input required type="number" step="any" value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} placeholder="e.g. -74.0060" className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Location Address (Auto-resolved)</label>
            <div className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-md text-gray-300 text-sm min-h-[42px] flex items-center">
              {address || "Enter coordinates to resolve address..."}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
            <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as Priority})} className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:border-blue-500">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>

        {/* Map Column */}
        <div className="h-[400px] lg:h-auto rounded-xl border border-gray-800 overflow-hidden relative bg-gray-800/50">
          {hasValidCoords ? (
            <LocationMap lat={parsedLat} lng={parsedLng} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 flex-col">
              <span className="text-4xl mb-2">🗺️</span>
              <p>Enter valid coordinates to view map</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
