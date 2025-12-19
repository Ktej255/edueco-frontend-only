"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Ban, ShieldCheck, Trash2, RefreshCw } from "lucide-react";
import api from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      const params: any = { limit: 50 };
      if (search) params.search = search;

      const response = await api.get("/admin/users", { params });
      setUsers(response.data.users);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (userId: number) => {
    if (!confirm("Are you sure you want to ban this user?")) return;

    try {
      await api.put(`/admin/users/${userId}/ban`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to ban user:", error);
      alert("Failed to ban user");
    }
  };

  const handleUnban = async (userId: number) => {
    try {
      await api.put(`/admin/users/${userId}/unban`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to unban user:", error);
      alert("Failed to unban user");
    }
  };

  const handlePromote = async (userId: number) => {
    if (!confirm("Promote this user to admin?")) return;

    try {
      await api.put(`/admin/users/${userId}/promote`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to promote user:", error);
      alert("Failed to promote user");
    }
  };

  const handleDelete = async (userId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This cannot be undone.",
      )
    )
      return;

    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
        <p className="text-gray-400">Manage all platform users</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white"
          />
        </div>
        <Button
          onClick={fetchUsers}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <p className="text-gray-400">
          Total Users: <span className="text-white font-bold">{total}</span>
        </p>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-white text-center py-12">Loading...</div>
      ) : (
        <Card className="bg-gray-900 border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-800">
                <tr className="text-left">
                  <th className="p-4 text-gray-400 font-semibold">ID</th>
                  <th className="p-4 text-gray-400 font-semibold">Email</th>
                  <th className="p-4 text-gray-400 font-semibold">Name</th>
                  <th className="p-4 text-gray-400 font-semibold">Role</th>
                  <th className="p-4 text-gray-400 font-semibold">Coins</th>
                  <th className="p-4 text-gray-400 font-semibold">Streak</th>
                  <th className="p-4 text-gray-400 font-semibold">Status</th>
                  <th className="p-4 text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-800 hover:bg-gray-800/50"
                  >
                    <td className="p-4 text-white">{user.id}</td>
                    <td className="p-4 text-white">{user.email}</td>
                    <td className="p-4 text-white">{user.full_name || "-"}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-white">{user.coins}</td>
                    <td className="p-4 text-white">{user.streak_days}</td>
                    <td className="p-4">
                      {user.is_banned ? (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-red-600 text-white">
                          Banned
                        </span>
                      ) : user.is_active ? (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-600 text-white">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-600 text-white">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        {user.is_banned ? (
                          <button
                            onClick={() => handleUnban(user.id)}
                            className="p-2 bg-green-600 hover:bg-green-700 rounded text-white"
                            title="Unban user"
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBan(user.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded text-white"
                            title="Ban user"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        )}

                        {user.role !== "admin" && (
                          <>
                            <button
                              onClick={() => handlePromote(user.id)}
                              className="p-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
                              title="Promote to admin"
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
