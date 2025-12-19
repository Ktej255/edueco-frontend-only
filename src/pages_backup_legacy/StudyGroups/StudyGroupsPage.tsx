import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Plus, Lock, Globe, UserPlus, Search } from "lucide-react";
import { api } from "../../services/api";

interface StudyGroup {
  id: number;
  name: string;
  description: string;
  group_type: "study" | "project" | "discussion" | "peer_support";
  privacy: "public" | "private" | "invite_only";
  course_id?: number;
  max_members: number;
  is_active: boolean;
  created_at: string;
  member_count?: number;
}

export const StudyGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get("/social/groups");
      setGroups(response.data);
    } catch (error) {
      console.error("Failed to fetch study groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || group.group_type === filterType;
    return matchesSearch && matchesType;
  });

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case "public":
        return <Globe className="w-4 h-4" />;
      case "private":
        return <Lock className="w-4 h-4" />;
      default:
        return <UserPlus className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      study: "bg-blue-100 text-blue-800",
      project: "bg-green-100 text-green-800",
      discussion: "bg-purple-100 text-purple-800",
      peer_support: "bg-orange-100 text-orange-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Groups</h1>
          <p className="mt-2 text-gray-600">
            Join or create groups to learn together
          </p>
        </div>
        <Link
          to="/groups/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Group
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="study">Study</option>
          <option value="project">Project</option>
          <option value="discussion">Discussion</option>
          <option value="peer_support">Peer Support</option>
        </select>
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No groups found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? "Try adjusting your search"
              : "Get started by creating a new group"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(group.group_type)}`}
                  >
                    {group.group_type}
                  </span>
                  <span className="text-gray-500">
                    {getPrivacyIcon(group.privacy)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {group.member_count || 0}/{group.max_members}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {group.name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {group.description || "No description available"}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Created {new Date(group.created_at).toLocaleDateString()}
                </span>
                {group.is_active && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
