import { DeliveryAgent, Order } from '../types';

export const initialAgents: DeliveryAgent[] = [
  {
    id: 'agent-1',
    name: 'Alice Smith',
    location: { lat: 40.7128, lng: -74.0060 }, // NYC
    availability: 'Available',
    activeOrdersCount: 0,
    assignedOrders: []
  },
  {
    id: 'agent-2',
    name: 'Bob Johnson',
    location: { lat: 40.7306, lng: -73.9352 }, // Queens
    availability: 'Busy',
    activeOrdersCount: 2,
    assignedOrders: ['order-1', 'order-2']
  },
  {
    id: 'agent-3',
    name: 'Charlie Davis',
    location: { lat: 40.6782, lng: -73.9442 }, // Brooklyn
    availability: 'Available',
    activeOrdersCount: 1,
    assignedOrders: ['order-3']
  },
  {
    id: 'agent-4',
    name: 'Diana Evans',
    location: { lat: 40.7891, lng: -73.1350 }, // Long Island
    availability: 'Offline',
    activeOrdersCount: 0,
    assignedOrders: []
  }
];

export const initialOrders: Order[] = [
  {
    id: 'order-1',
    customerName: 'John Doe',
    customerContact: '555-0101',
    customerLocation: { lat: 40.7580, lng: -73.9855 }, // Times Square
    address: 'Times Square, New York, NY',
    details: 'Pizza delivery',
    priority: 'High',
    status: 'Picked Up',
    assignedAgentId: 'agent-2',
    createdAt: Date.now() - 3600000
  },
  {
    id: 'order-2',
    customerName: 'Jane Roe',
    customerContact: '555-0102',
    customerLocation: { lat: 40.7484, lng: -73.9857 }, // Empire State
    address: 'Empire State Building, New York, NY',
    details: 'Documents',
    priority: 'Medium',
    status: 'In Transit',
    assignedAgentId: 'agent-2',
    createdAt: Date.now() - 7200000
  },
  {
    id: 'order-3',
    customerName: 'Mike Ross',
    customerContact: '555-0103',
    customerLocation: { lat: 40.6892, lng: -74.0445 }, // Statue of Liberty
    address: 'Statue of Liberty, New York, NY',
    details: 'Gift box',
    priority: 'Low',
    status: 'Assigned',
    assignedAgentId: 'agent-3',
    createdAt: Date.now() - 1800000
  }
];
