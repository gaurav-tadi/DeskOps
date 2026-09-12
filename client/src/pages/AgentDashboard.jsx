import TicketQueue from '../components/TicketQueue';

export default function AgentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">IT Agent Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage incoming support tickets and resolve client issues
          </p>
        </div>

        <TicketQueue />
      </div>
    </div>
  );
}