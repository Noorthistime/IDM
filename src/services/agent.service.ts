import { db } from '../data/database';
import { DeliveryAgent, Location, AgentAvailability } from '../types';

export class AgentService {
  static getAllAgents(): DeliveryAgent[] {
    return Array.from(db.agents.values());
  }

  static getAgentById(id: string): DeliveryAgent | undefined {
    return db.agents.get(id);
  }

  static registerAgent(data: { name: string; location: Location; availability?: AgentAvailability }): DeliveryAgent {
    if (!data.name || !data.location || typeof data.location.lat !== 'number' || typeof data.location.lng !== 'number') {
      throw new Error("Invalid agent data");
    }

    const id = `agent-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newAgent: DeliveryAgent = {
      id,
      name: data.name,
      location: data.location,
      availability: data.availability || 'Available',
      activeOrdersCount: 0,
      assignedOrders: []
    };

    db.agents.set(id, newAgent);
    return newAgent;
  }

  static updateAvailability(id: string, availability: AgentAvailability): DeliveryAgent {
    const agent = db.agents.get(id);
    if (!agent) throw new Error("Agent not found");

    const valid: AgentAvailability[] = ['Available', 'Busy', 'Offline'];
    if (!valid.includes(availability)) throw new Error("Invalid availability");

    agent.availability = availability;
    return agent;
  }

  static updateLocation(id: string, location: Location): DeliveryAgent {
    const agent = db.agents.get(id);
    if (!agent) throw new Error("Agent not found");

    if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      throw new Error("Invalid location");
    }

    agent.location = location;
    return agent;
  }
}
