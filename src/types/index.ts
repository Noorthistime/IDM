export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type DeliveryStatus = 'Pending' | 'Assigned' | 'Picked Up' | 'In Transit' | 'Delivered' | 'Cancelled';
export type AgentAvailability = 'Available' | 'Busy' | 'Offline';

export interface Location {
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerContact: string;
  customerLocation: Location;
  details: string;
  priority: Priority;
  status: DeliveryStatus;
  assignedAgentId: string | null;
  createdAt: number;
}

export interface DeliveryAgent {
  id: string;
  name: string;
  location: Location;
  availability: AgentAvailability;
  activeOrdersCount: number;
  assignedOrders: string[];
}

export interface AssignmentResult {
  recommendedAgentId: string | null;
  reasoning: string;
  scores: Record<string, number>;
}
