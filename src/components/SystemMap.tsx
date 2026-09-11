"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Order, DeliveryAgent } from "@/types";

// Create custom icons for agents and orders
const createIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #111827; box-shadow: 0 0 6px rgba(0,0,0,0.8);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const agentIcon = createIcon('#3b82f6'); // Blue for agents
const orderIcon = createIcon('#ef4444'); // Red for orders

export default function SystemMap() {
  const [mounted, setMounted] = useState(false);
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const [agentsRes, ordersRes] = await Promise.all([
          fetch('/api/agents'),
          fetch('/api/orders')
        ]);
        if (agentsRes.ok) setAgents(await agentsRes.json());
        if (ordersRes.ok) setOrders(await ordersRes.json());
      } catch (err) {}
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  // New York City default center
  const center: [number, number] = [40.7128, -74.0060];

  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: "100%", width: "100%", zIndex: 0, borderRadius: "inherit" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {agents.map(agent => (
        <Marker key={agent.id} position={[agent.location.lat, agent.location.lng]} icon={agentIcon}>
          <Popup>
            <div className="text-sm">
              <strong className="block text-gray-900">{agent.name} (Agent)</strong>
              <span className="text-gray-600">Status: {agent.availability}</span>
            </div>
          </Popup>
        </Marker>
      ))}
      {orders.map(order => (
        <Marker key={order.id} position={[order.customerLocation.lat, order.customerLocation.lng]} icon={orderIcon}>
          <Popup>
            <div className="text-sm">
              <strong className="block text-gray-900">Order #{order.id}</strong>
              <span className="block text-gray-600">{order.details}</span>
              <span className="text-gray-600">Status: {order.status}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
