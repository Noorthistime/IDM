"use client";

import { useState } from 'react';
import CreateOrder from '@/components/CreateOrder';
import AgentRegistration from '@/components/AgentRegistration';
import Dispatcher from '@/components/Dispatcher';
import AgentDashboard from '@/components/AgentDashboard';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'register' | 'dispatch' | 'dashboard'>('dispatch');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Intelligent Delivery Management (IDM)</h1>
          <p className="mt-2 text-blue-100">Smart routing and assignment system</p>
        </div>
      </header>

      <nav className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-4">
          <button 
            onClick={() => setActiveTab('dispatch')}
            className={`py-4 px-2 border-b-2 font-medium transition-colors ${activeTab === 'dispatch' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Dispatcher / Assign
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`py-4 px-2 border-b-2 font-medium transition-colors ${activeTab === 'create' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Create Order
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            className={`py-4 px-2 border-b-2 font-medium transition-colors ${activeTab === 'register' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Agent Registration
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`py-4 px-2 border-b-2 font-medium transition-colors ${activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Agent Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pb-12">
        {activeTab === 'dispatch' && <Dispatcher />}
        {activeTab === 'create' && <CreateOrder />}
        {activeTab === 'register' && <AgentRegistration />}
        {activeTab === 'dashboard' && <AgentDashboard />}
      </main>
    </div>
  );
}
