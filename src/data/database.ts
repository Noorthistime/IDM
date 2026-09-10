import { DeliveryAgent, Order } from '../types';
import { initialAgents, initialOrders } from './seed';

class Database {
  public agents: Map<string, DeliveryAgent>;
  public orders: Map<string, Order>;

  constructor() {
    this.agents = new Map();
    this.orders = new Map();
    this.seed();
  }

  private seed() {
    initialAgents.forEach(agent => this.agents.set(agent.id, agent));
    initialOrders.forEach(order => this.orders.set(order.id, order));
  }
}

// Global reference to avoid re-instantiation in Next.js development (hot reload)
const globalForDb = global as unknown as { db: Database };

export const db = globalForDb.db || new Database();

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
