import { db } from '../data/database';
import { calculateDistance } from '../utils/distance';
import { AssignmentResult, Order } from '../types';

export class AssignmentService {
  static getSmartAssignment(orderId: string): AssignmentResult {
    const order = db.orders.get(orderId);
    if (!order) throw new Error("Order not found");

    if (order.status !== 'Pending') {
      throw new Error("Order is not in Pending status");
    }

    const agents = Array.from(db.agents.values());
    const availableAgents = agents.filter(a => a.availability === 'Available');

    if (availableAgents.length === 0) {
      return {
        recommendedAgentId: null,
        reasoning: "No agents are currently available.",
        scores: {}
      };
    }

    const priorityWeights: Record<string, number> = {
      'Low': 0,
      'Medium': 20,
      'High': 50,
      'Urgent': 100
    };

    const priorityScore = priorityWeights[order.priority] || 0;
    
    // Calculate scores
    const scores: Record<string, number> = {};
    const agentData: Record<string, { distance: number, workload: number, id: string }> = {};

    availableAgents.forEach(agent => {
      const distance = calculateDistance(agent.location, order.customerLocation);
      const workload = agent.activeOrdersCount;
      
      // Distance penalty: -2 points per km
      const distancePenalty = distance * 2;
      // Workload penalty: -15 points per active order
      const workloadPenalty = workload * 15;

      const finalScore = priorityScore - distancePenalty - workloadPenalty;
      
      scores[agent.id] = parseFloat(finalScore.toFixed(2));
      agentData[agent.id] = { distance, workload, id: agent.id };
    });

    // Sort agents
    const sortedAgents = availableAgents.sort((a, b) => {
      const scoreDiff = scores[b.id] - scores[a.id];
      if (Math.abs(scoreDiff) > 0.01) return scoreDiff; // Higher score first

      // Tie breaker 1: Workload
      if (agentData[a.id].workload !== agentData[b.id].workload) {
        return agentData[a.id].workload - agentData[b.id].workload; // Lower workload first
      }

      // Tie breaker 2: Distance
      if (Math.abs(agentData[a.id].distance - agentData[b.id].distance) > 0.01) {
        return agentData[a.id].distance - agentData[b.id].distance; // Closer first
      }

      // Tie breaker 3: Deterministic ID comparison
      return a.id.localeCompare(b.id);
    });

    const recommendedAgentId = sortedAgents[0].id;
    const reasoning = `Selected agent ${sortedAgents[0].name} with score ${scores[recommendedAgentId]}. Priority weight: ${priorityScore}. Distance penalty: -${(agentData[recommendedAgentId].distance * 2).toFixed(2)}. Workload penalty: -${agentData[recommendedAgentId].workload * 15}.`;

    return {
      recommendedAgentId,
      reasoning,
      scores
    };
  }

  static assignOrder(orderId: string, agentId: string): Order {
    const order = db.orders.get(orderId);
    if (!order) throw new Error("Order not found");
    if (order.status !== 'Pending') throw new Error("Order is not Pending");

    const agent = db.agents.get(agentId);
    if (!agent) throw new Error("Agent not found");
    // Defensive check
    if (agent.availability !== 'Available') throw new Error("Agent is not Available");

    order.assignedAgentId = agent.id;
    order.status = 'Assigned';
    
    agent.activeOrdersCount += 1;
    agent.assignedOrders.push(order.id);

    return order;
  }
}
