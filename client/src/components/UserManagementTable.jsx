import { useState, useEffect } from "react";
import api from "../api/axios";

export default function UserManagementTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get("/users");
        if (!isMounted) return;
        setUsers(response.data.users || []);
      } catch (err) {
        if (!isMounted) return;
        setMessage({
          type: "error",
          text: err.response?.data?.message || "Failed to fetch user accounts.",
        });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setActionLoadingId(userId);
      setMessage({ type: "", text: "" });

      await api.put(`/users/${userId}`, { role: newRole });

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
      );

      setMessage({ type: "success", text: "User role updated successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update user role.",
      });
    } finally {
      setActionLoadingId(null);
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
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            System Accounts & Roles
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Loading user list...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No users found in database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Current Role</th>
                  <th className="px-6 py-3 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 border border-gray-200">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={user.role}
                        disabled={actionLoadingId === user._id}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs bg-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="CLIENT">CLIENT</option>
                        <option value="AGENT">AGENT</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
