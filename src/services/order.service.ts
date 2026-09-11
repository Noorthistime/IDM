import { db } from '../data/database';
import { Order, Priority, DeliveryStatus, Location } from '../types';

export class OrderService {
  static getAllOrders(): Order[] {
    return Array.from(db.orders.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  static getOrderById(id: string): Order | undefined {
    return db.orders.get(id);
  }

  static createOrder(data: {
    customerName: string;
    customerContact: string;
    customerLocation: Location;
    address: string;
    details: string;
    priority: Priority;
  }): Order {
    if (!data.customerName || !data.customerContact || !data.customerLocation || !data.details || !data.priority || !data.address) {
      throw new Error("Missing required fields");
    }

    if (typeof data.customerLocation.lat !== 'number' || typeof data.customerLocation.lng !== 'number') {
      throw new Error("Invalid location format");
    }

    const id = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const newOrder: Order = {
      id,
      customerName: data.customerName,
      customerContact: data.customerContact,
      customerLocation: data.customerLocation,
      address: data.address,
      details: data.details,
      priority: data.priority,
      status: 'Pending',
      assignedAgentId: null,
      createdAt: Date.now()
    };

    db.orders.set(id, newOrder);
    return newOrder;
  }

  static updateDeliveryStatus(id: string, status: DeliveryStatus): Order {
    const order = db.orders.get(id);
    if (!order) throw new Error("Order not found");

    const validStatuses: DeliveryStatus[] = ['Pending', 'Assigned', 'Picked Up', 'In Transit', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status");
    }

    order.status = status;

    if ((status === 'Delivered' || status === 'Cancelled') && order.assignedAgentId) {
      const agent = db.agents.get(order.assignedAgentId);
      if (agent) {
        agent.activeOrdersCount = Math.max(0, agent.activeOrdersCount - 1);
      }
    }

    return order;
  }
}
