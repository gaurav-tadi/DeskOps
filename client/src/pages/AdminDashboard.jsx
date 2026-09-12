import { useState } from 'react';
import TicketQueue from '../components/TicketQueue';
import UserManagementTable from '../components/UserManagementTable';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('tickets');

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Administrator Portal</h1>
          <p className="mt-1 text-sm text-gray-500">
            Oversee system operations, manage user accounts, and review ticket queues.
          </p>
        </div>

        <div className="flex border-b border-gray-200 gap-6">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`pb-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'tickets'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Ticket Queue
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'users'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            User & Agent Management
          </button>
        </div>

        {activeTab === 'tickets' && <TicketQueue />}
        {activeTab === 'users' && <UserManagementTable />}
      </div>
    </div>
  );
}