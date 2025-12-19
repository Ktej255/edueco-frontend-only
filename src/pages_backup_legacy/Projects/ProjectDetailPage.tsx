import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Briefcase,
  Users,
  Clock,
  FileText,
  Upload,
  Award,
  CheckCircle,
  Plus,
  UserPlus,
  Target,
} from "lucide-react";
import { api } from "../../services/api";

interface Team {
  id: number;
  name: string;
  created_at: string;
  members: TeamMember[];
  submission?: Submission;
}

interface TeamMember {
  id: number;
  role: "leader" | "member";
  user: {
    id: number;
    full_name: string;
    email: string;
  };
}

interface Milestone {
  id: number;
  title: string;
  description: string;
  due_date: string;
  is_completed: boolean;
}

interface Submission {
  id: number;
  file_url: string;
  description: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  deadline: string;
  max_team_size: number;
  created_at: string;
}

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "teams" | "milestones"
  >("overview");
  const [userTeam, setUserTeam] = useState<Team | null>(null);

  // Submission state
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    file_url: "",
    description: "",
  });

  useEffect(() => {
    fetchProjectDetails();
    fetchTeams();
    fetchMilestones();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.get(`/projects/${id}/teams`);
      setTeams(response.data);

      // Find user's team
      const currentUserId = parseInt(localStorage.getItem("userId") || "0");
      const myTeam = response.data.find((team: Team) =>
        team.members.some((m) => m.user.id === currentUserId),
      );
      setUserTeam(myTeam || null);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  };

  const fetchMilestones = async () => {
    try {
      const response = await api.get(`/projects/${id}/milestones`);
      setMilestones(response.data);
    } catch (error) {
      console.error("Failed to fetch milestones:", error);
    }
  };

  const handleCreateTeam = async () => {
    const teamName = prompt("Enter team name:");
    if (!teamName) return;

    try {
      await api.post(`/projects/${id}/teams`, { name: teamName });
      fetchTeams();
    } catch (error) {
      console.error("Failed to create team:", error);
    }
  };

  const handleJoinTeam = async (teamId: number) => {
    try {
      await api.post(`/projects/${id}/teams/${teamId}/join`);
      fetchTeams();
    } catch (error) {
      console.error("Failed to join team:", error);
    }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userTeam) return;

    try {
      await api.post(
        `/projects/${id}/teams/${userTeam.id}/submit`,
        submissionData,
      );
      setShowSubmissionForm(false);
      setSubmissionData({ file_url: "", description: "" });
      fetchTeams();
    } catch (error) {
      console.error("Failed to submit project:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {project.title}
            </h1>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Due: {new Date(project.deadline).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Max {project.max_team_size} per team
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {project.status.replace("_", " ")}
              </span>
            </div>
          </div>
          {!userTeam && (
            <button
              onClick={handleCreateTeam}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create Team
            </button>
          )}
        </div>

        {/* User's Team Info */}
        {userTeam && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <h3 className="font-medium text-indigo-900 mb-2">
              Your Team: {userTeam.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {userTeam.members.map((member) => (
                  <span key={member.id} className="text-sm text-indigo-700">
                    {member.user.full_name}
                    {member.role === "leader" && " (Leader)"}
                  </span>
                ))}
              </div>
              {!userTeam.submission && (
                <button
                  onClick={() => setShowSubmissionForm(true)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                >
                  <Upload className="w-3 h-3 inline mr-1" />
                  Submit Project
                </button>
              )}
              {userTeam.submission && (
                <span className="text-sm text-green-700 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Submitted
                  {userTeam.submission.grade &&
                    ` - Grade: ${userTeam.submission.grade}%`}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submission Form Modal */}
      {showSubmissionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Submit Project</h3>
            <form onSubmit={handleSubmitProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File URL
                </label>
                <input
                  type="url"
                  value={submissionData.file_url}
                  onChange={(e) =>
                    setSubmissionData({
                      ...submissionData,
                      file_url: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={submissionData.description}
                  onChange={(e) =>
                    setSubmissionData({
                      ...submissionData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSubmissionForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText className="w-5 h-5 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("teams")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "teams"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Teams ({teams.length})
          </button>
          <button
            onClick={() => setActiveTab("milestones")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "milestones"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Target className="w-5 h-5 inline mr-2" />
            Milestones ({milestones.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "teams" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {team.name}
                </h3>
                {!userTeam && team.members.length < project.max_team_size && (
                  <button
                    onClick={() => handleJoinTeam(team.id)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                  >
                    <UserPlus className="w-3 h-3 inline mr-1" />
                    Join
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {team.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <span className="text-gray-700">
                      {member.user.full_name}
                    </span>
                    {member.role === "leader" && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                        Leader
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {team.submission && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Submitted
                    </span>
                    {team.submission.grade && (
                      <span className="font-medium text-gray-900">
                        <Award className="w-4 h-4 inline mr-1" />
                        {team.submission.grade}%
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "milestones" && (
        <div className="space-y-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={milestone.is_completed}
                    readOnly
                    className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <div>
                    <h3
                      className={`font-medium ${milestone.is_completed ? "line-through text-gray-500" : "text-gray-900"}`}
                    >
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {milestone.description}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(milestone.due_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "overview" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Project Details</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {project.description}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {project.status.replace("_", " ")}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Teams</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {teams.length} teams formed
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
};
