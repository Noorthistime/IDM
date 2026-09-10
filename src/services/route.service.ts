import { db } from '../data/database';
import { calculateDistance } from '../utils/distance';
import { Order } from '../types';

export class RouteService {
  static getRouteSequence(agentId: string): Order[] {
    const agent = db.agents.get(agentId);
    if (!agent) throw new Error("Agent not found");

    // Get all orders assigned to this agent that are active
    const activeOrderIds = agent.assignedOrders.filter(orderId => {
      const order = db.orders.get(orderId);
      return order && (order.status === 'Assigned' || order.status === 'Picked Up' || order.status === 'In Transit');
    });

    const activeOrders = activeOrderIds.map(id => db.orders.get(id)!).filter(Boolean);

    if (activeOrders.length === 0) return [];

    // Simple priority levels
    const priorityLevel: Record<string, number> = {
      'Urgent': 4,
      'High': 3,
      'Medium': 2,
      'Low': 1
    };

    let currentLocation = agent.location;
    const remainingOrders = [...activeOrders];
    const sequencedOrders: Order[] = [];

    // Build the sequence iteratively
    while (remainingOrders.length > 0) {
      // Find the highest priority among remaining
      const highestPriorityVal = Math.max(...remainingOrders.map(o => priorityLevel[o.priority]));
      
      // Filter candidates that have this highest priority
      const candidates = remainingOrders.filter(o => priorityLevel[o.priority] === highestPriorityVal);

      // From candidates, find the one closest to currentLocation
      let nearestCandidate = candidates[0];
      let minDistance = calculateDistance(currentLocation, nearestCandidate.customerLocation);

      for (let i = 1; i < candidates.length; i++) {
        const dist = calculateDistance(currentLocation, candidates[i].customerLocation);
        if (dist < minDistance) {
          minDistance = dist;
          nearestCandidate = candidates[i];
        } else if (dist === minDistance) {
          // tie breaker
          if (candidates[i].id.localeCompare(nearestCandidate.id) < 0) {
            nearestCandidate = candidates[i];
          }
        }
      }

      // Add to sequence
      sequencedOrders.push(nearestCandidate);
      
      // Update location and remaining orders
      currentLocation = nearestCandidate.customerLocation;
      const index = remainingOrders.findIndex(o => o.id === nearestCandidate.id);
      remainingOrders.splice(index, 1);
    }

    return sequencedOrders;
  }
}
