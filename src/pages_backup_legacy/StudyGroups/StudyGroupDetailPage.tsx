import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Calendar,
  Settings,
  UserPlus,
  LogOut,
} from "lucide-react";
import { api } from "../../services/api";

interface GroupMember {
  id: number;
  user_id: number;
  role: "admin" | "moderator" | "member";
  joined_at: string;
  user: {
    id: number;
    full_name: string;
    email: string;
  };
}

interface GroupPost {
  id: number;
  user_id: number;
  content: string;
  is_pinned: boolean;
  likes_count: number;
  created_at: string;
  author: {
    id: number;
    full_name: string;
  };
}

interface StudyGroup {
  id: number;
  name: string;
  description: string;
  group_type: string;
  privacy: string;
  max_members: number;
  is_active: boolean;
  created_at: string;
}

export const StudyGroupDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "members">("posts");
  const [newPost, setNewPost] = useState("");
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    fetchGroupDetails();
    fetchMembers();
    fetchPosts();
  }, [id]);

  const fetchGroupDetails = async () => {
    try {
      const response = await api.get(`/social/groups/${id}`);
      setGroup(response.data);
    } catch (error) {
      console.error("Failed to fetch group details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await api.get(`/social/groups/${id}/members`);
      setMembers(response.data);
      // Check if current user is a member
      const currentUserId = parseInt(localStorage.getItem("userId") || "0");
      setIsMember(
        response.data.some((m: GroupMember) => m.user_id === currentUserId),
      );
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await api.get(`/social/groups/${id}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handleJoinGroup = async () => {
    try {
      await api.post(`/social/groups/${id}/join`);
      setIsMember(true);
      fetchMembers();
    } catch (error) {
      console.error("Failed to join group:", error);
    }
  };

  const handleLeaveGroup = async () => {
    if (window.confirm("Are you sure you want to leave this group?")) {
      try {
        await api.post(`/social/groups/${id}/leave`);
        setIsMember(false);
        fetchMembers();
      } catch (error) {
        console.error("Failed to leave group:", error);
      }
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      await api.post(`/social/groups/${id}/posts`, { content: newPost });
      setNewPost("");
      fetchPosts();
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Group not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Group Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {group.name}
            </h1>
            <p className="text-gray-600 mb-4">{group.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {members.length} members
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Created {new Date(group.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            {isMember ? (
              <>
                <button
                  onClick={handleLeaveGroup}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Leave Group
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Settings className="w-4 h-4 inline mr-2" />
                  Settings
                </button>
              </>
            ) : (
              <button
                onClick={handleJoinGroup}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <UserPlus className="w-4 h-4 inline mr-2" />
                Join Group
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("posts")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "posts"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <MessageSquare className="w-5 h-5 inline mr-2" />
            Posts
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "members"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Members
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "posts" ? (
        <div className="space-y-6">
          {/* Create Post */}
          {isMember && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleCreatePost}>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share something with the group..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Posts List */}
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {post.author.full_name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      {post.author.full_name}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{post.content}</p>
                  <div className="mt-3 flex items-center space-x-4">
                    <button className="text-sm text-gray-500 hover:text-indigo-600">
                      👍 {post.likes_count}
                    </button>
                    <button className="text-sm text-gray-500 hover:text-indigo-600">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No posts yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {isMember
                  ? "Be the first to post!"
                  : "Join the group to see posts"}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {members.map((member) => (
              <li
                key={member.id}
                className="p-6 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {member.user.full_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {member.user.full_name}
                    </h4>
                    <p className="text-sm text-gray-500">{member.user.email}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
