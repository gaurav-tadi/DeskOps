import { useState, useEffect } from "react";
import api from "../api/axios";

export default function TicketQueue() {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    totalPages: 1,
    totalTickets: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [fetching, setFetching] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    let isMounted = true;

    const fetchTickets = async () => {
      setFetching(true);
      try {
        const response = await api.get(`/tickets?page=${page}&limit=5`);
        if (!isMounted) return;

        setTickets(response.data.data || []);
        setPaginationMeta({
          totalPages: response.data.pagination?.totalPages || 1,
          totalTickets: response.data.pagination?.totalTickets || 0,
          hasNextPage: response.data.pagination?.hasNextPage || false,
          hasPrevPage: response.data.pagination?.hasPreviousPage || false,
        });
      } catch (err) {
        if (!isMounted) return;
        setMessage({
          type: "error",
          text: err.response?.data?.message || "Failed to fetch tickets queue.",
        });
      } finally {
        if (isMounted) {
          setFetching(false);
        }
      }
    };

    fetchTickets();

    return () => {
      isMounted = false;
    };
  }, [page]);

  const handleResolveTicket = async (ticketId) => {
    try {
      setActionLoadingId(ticketId);
      setMessage({ type: "", text: "" });
      const response = await api.patch(`/tickets/${ticketId}/resolve`);
      setMessage({
        type: "success",
        text: response.data?.message || "Ticket resolved successfully!",
      });

      const refreshResponse = await api.get(`/tickets?page=${page}&limit=5`);
      setTickets(refreshResponse.data.data || []);
      setPaginationMeta({
        totalPages: refreshResponse.data.pagination?.totalPages || 1,
        totalTickets: refreshResponse.data.pagination?.totalTickets || 0,
        hasNextPage: refreshResponse.data.pagination?.hasNextPage || false,
        hasPrevPage: refreshResponse.data.pagination?.hasPreviousPage || false,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to resolve ticket.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "RESOLVED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "HIGH":
        return "text-red-600 font-semibold";
      case "MEDIUM":
        return "text-amber-600 font-medium";
      case "LOW":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-4">
      {message.text && (
        <div
          className={`rounded-md p-4 text-sm border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Support Ticket Queue
          </h2>
          <span className="text-xs text-gray-500">
            Total Tickets:{" "}
            <strong className="text-gray-900">
              {paginationMeta.totalTickets}
            </strong>
          </span>
        </div>

        {fetching ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Loading ticket queue...
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No tickets found in the system queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3">Ticket Info</th>
                  <th className="px-6 py-3">Submitted By</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {ticket.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {ticket.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <div className="font-medium text-gray-800">
                        {ticket.createdBy?.name || "Unknown Client"}
                      </div>
                      <div className="text-gray-400">
                        {ticket.createdBy?.email}
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 text-xs ${getPriorityBadge(ticket.priority)}`}
                    >
                      {ticket.priority}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(ticket.status)}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {ticket.status === "RESOLVED" ? (
                        <span className="text-xs text-emerald-600 font-medium">
                          ✓ Resolved
                        </span>
                      ) : (
                        <button
                          onClick={() => handleResolveTicket(ticket._id)}
                          disabled={actionLoadingId === ticket._id}
                          className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-500 focus:outline-none disabled:opacity-50 transition"
                        >
                          {actionLoadingId === ticket._id
                            ? "Resolving..."
                            : "Resolve Ticket"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-3">
          <div className="text-xs text-gray-600">
            Page <span className="font-semibold text-gray-900">{page}</span> of{" "}
            <span className="font-semibold text-gray-900">
              {paginationMeta.totalPages}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={!paginationMeta.hasPrevPage || fetching}
              className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!paginationMeta.hasNextPage || fetching}
              className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
