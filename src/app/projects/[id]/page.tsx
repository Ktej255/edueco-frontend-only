"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";

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

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [project, setProject] = useState<Project | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    file_url: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
      fetchTeams();
      fetchMilestones();
    }
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
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Project Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              <p className="text-muted-foreground mb-4">{project.description}</p>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Due: {new Date(project.deadline).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Max {project.max_team_size} per team
                </span>
                <Badge className="capitalize">{project.status.replace("_", " ")}</Badge>
              </div>
            </div>
            {!userTeam && (
              <Button onClick={handleCreateTeam}>
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            )}
          </div>

          {userTeam && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border">
              <h3 className="font-medium mb-2">Your Team: {userTeam.name}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {userTeam.members.map((member) => (
                    <span key={member.id} className="text-sm">
                      {member.user.full_name}
                      {member.role === "leader" && " (Leader)"}
                    </span>
                  ))}
                </div>
                {!userTeam.submission && (
                  <Button size="sm" onClick={() => setShowSubmissionForm(true)}>
                    <Upload className="w-3 h-3 mr-1" />
                    Submit Project
                  </Button>
                )}
                {userTeam.submission && (
                  <span className="text-sm text-green-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Submitted
                    {userTeam.submission.grade && ` - Grade: ${userTeam.submission.grade}%`}
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Dialog */}
      <Dialog open={showSubmissionForm} onOpenChange={setShowSubmissionForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitProject} className="space-y-4">
            <div>
              <Label htmlFor="file_url">File URL</Label>
              <Input
                id="file_url"
                type="url"
                value={submissionData.file_url}
                onChange={(e) =>
                  setSubmissionData({
                    ...submissionData,
                    file_url: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={submissionData.description}
                onChange={(e) =>
                  setSubmissionData({
                    ...submissionData,
                    description: e.target.value,
                  })
                }
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSubmissionForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <FileText className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="teams">
            <Users className="w-4 h-4 mr-2" />
            Teams ({teams.length})
          </TabsTrigger>
          <TabsTrigger value="milestones">
            <Target className="w-4 h-4 mr-2" />
            Milestones ({milestones.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                <dd className="mt-1 text-sm">{project.description}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="mt-1">
                  <Badge className="capitalize">{project.status.replace("_", " ")}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Teams</dt>
                <dd className="mt-1 text-sm">{teams.length} teams formed</dd>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team) => (
              <Card key={team.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    {!userTeam && team.members.length < project.max_team_size && (
                      <Button size="sm" onClick={() => handleJoinTeam(team.id)}>
                        <UserPlus className="w-3 h-3 mr-1" />
                        Join
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {team.members.map((member) => (
                      <div key={member.id} className="flex items-center space-x-2 text-sm">
                        <span>{member.user.full_name}</span>
                        {member.role === "leader" && (
                          <Badge variant="secondary" className="text-xs">Leader</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  {team.submission && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Submitted
                        </span>
                        {team.submission.grade && (
                          <span className="font-medium flex items-center">
                            <Award className="w-4 h-4 mr-1" />
                            {team.submission.grade}%
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="mt-6">
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Checkbox checked={milestone.is_completed} disabled className="mt-1" />
                      <div>
                        <h3
                          className={`font-medium ${milestone.is_completed ? "line-through text-muted-foreground" : ""}`}
                        >
                          {milestone.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(milestone.due_date).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
