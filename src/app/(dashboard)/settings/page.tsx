"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  User,
  Lock,
  Bell,
  Shield,
  Mail,
  Upload,
  RotateCcw,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Schemas
const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500).optional(),
  title: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal("")),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const emailNotificationSchema = z.object({
  enrollment_enabled: z.boolean(),
  assignment_enabled: z.boolean(),
  quiz_enabled: z.boolean(),
  certificate_enabled: z.boolean(),
  announcement_enabled: z.boolean(),
  review_enabled: z.boolean(),
  course_update_enabled: z.boolean(),
  general_enabled: z.boolean(),
  all_emails_enabled: z.boolean(),
});

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Forms
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      email: "",
      bio: "",
      title: "",
      website: "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const emailNotificationForm = useForm({
    resolver: zodResolver(emailNotificationSchema),
    defaultValues: {
      enrollment_enabled: true,
      assignment_enabled: true,
      quiz_enabled: true,
      certificate_enabled: true,
      announcement_enabled: true,
      review_enabled: true,
      course_update_enabled: true,
      general_enabled: true,
      all_emails_enabled: true,
    },
  });

  // Fetch user data and email preferences on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          toast.error("Please log in to access settings");
          return;
        }

        // Fetch user profile
        const userResponse = await axios.get(`${API_URL}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);
        profileForm.reset({
          full_name: userResponse.data.full_name || "",
          email: userResponse.data.email || "",
          bio: userResponse.data.bio || "",
          title: userResponse.data.title || "",
          website: userResponse.data.website || "",
        });

        // Fetch email notification preferences
        const emailPrefsResponse = await axios.get(
          `${API_URL}/api/v1/email-notifications/preferences`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        emailNotificationForm.reset(emailPrefsResponse.data);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        toast.error(error.response?.data?.detail || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle profile update
  const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(`${API_URL}/api/v1/users/me`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.detail || "Failed to update profile");
    }
  };

  // Handle password update
  const onPasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `${API_URL}/api/v1/auth/change-password`,
        {
          current_password: data.current_password,
          new_password: data.new_password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Password updated successfully!");
      passwordForm.reset();
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.response?.data?.detail || "Failed to update password");
    }
  };

  // Handle email notification preferences update
  const onEmailNotificationSubmit = async (
    data: z.infer<typeof emailNotificationSchema>,
  ) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `${API_URL}/api/v1/email-notifications/preferences`,
        data,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Email preferences saved successfully!");
    } catch (error: any) {
      console.error("Error updating email preferences:", error);
      toast.error(
        error.response?.data?.detail || "Failed to save email preferences",
      );
    }
  };

  // Handle reset email preferences to defaults
  const handleResetEmailPreferences = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.put(
        `${API_URL}/api/v1/email-notifications/preferences/reset`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      emailNotificationForm.reset(response.data);
      toast.success("Email preferences reset to defaults!");
    } catch (error: any) {
      console.error("Error resetting email preferences:", error);
      toast.error(
        error.response?.data?.detail || "Failed to reset preferences",
      );
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API_URL}/api/v1/users/me/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setUser({ ...user, avatar_url: response.data.avatar_url });
      toast.success("Avatar updated successfully!");
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error(error.response?.data?.detail || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">Loading settings...</div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-900">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="text-2xl bg-blue-600">
                    {user?.full_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors">
                      <Upload className="w-4 h-4" />
                      {uploading ? "Uploading..." : "Change Avatar"}
                    </div>
                    <Input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                  </Label>
                  <p className="text-sm text-gray-400 mt-2">
                    JPG, GIF or PNG. Max size of 2MB.
                  </p>
                </div>
              </div>

              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-gray-800 border-gray-700"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              className="bg-gray-800 border-gray-700 opacity-50"
                            />
                          </FormControl>
                          <FormDescription>
                            Email cannot be changed directly.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Senior Developer"
                            className="bg-gray-800 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Tell us about yourself..."
                            className="bg-gray-800 border-gray-700 min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://yourwebsite.com"
                            className="bg-gray-800 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-cyan-600 hover:bg-cyan-500"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>
                Manage your password and account security settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-4 max-w-md"
                >
                  <FormField
                    control={passwordForm.control}
                    name="current_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="password"
                              {...field}
                              className="pl-10 bg-gray-800 border-gray-700"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="password"
                              {...field}
                              className="pl-10 bg-gray-800 border-gray-700"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="password"
                              {...field}
                              className="pl-10 bg-gray-800 border-gray-700"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="bg-cyan-600 hover:bg-cyan-500 w-full"
                  >
                    Update Password
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Email Notification Preferences</CardTitle>
              <CardDescription>
                Choose which email notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailNotificationForm}>
                <form
                  onSubmit={emailNotificationForm.handleSubmit(
                    onEmailNotificationSubmit,
                  )}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <FormField
                      control={emailNotificationForm.control}
                      name="all_emails_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-semibold">
                              All Email Notifications
                            </FormLabel>
                            <FormDescription>
                              Master switch to enable or disable all email
                              notifications
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="h-px bg-gray-800 my-6" />

                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5" /> Course Activity
                    </h3>

                    <FormField
                      control={emailNotificationForm.control}
                      name="enrollment_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Course Enrollment
                            </FormLabel>
                            <FormDescription>
                              Receive emails when you enroll in a new course
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailNotificationForm.control}
                      name="course_update_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Course Updates
                            </FormLabel>
                            <FormDescription>
                              Get notified about new content in your enrolled
                              courses
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailNotificationForm.control}
                      name="assignment_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Assignment Grading
                            </FormLabel>
                            <FormDescription>
                              Receive emails when your assignments are graded
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailNotificationForm.control}
                      name="quiz_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Quiz Results
                            </FormLabel>
                            <FormDescription>
                              Get notified when you complete a quiz
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailNotificationForm.control}
                      name="certificate_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Certificate Achievement
                            </FormLabel>
                            <FormDescription>
                              Receive emails when you earn a certificate
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="h-px bg-gray-800 my-6" />

                    <h3 className="text-lg font-medium mb-4">
                      Community & Updates
                    </h3>

                    <FormField
                      control={emailNotificationForm.control}
                      name="announcement_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Course Announcements
                            </FormLabel>
                            <FormDescription>
                              Receive announcements from your instructors
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailNotificationForm.control}
                      name="review_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Course Reviews
                            </FormLabel>
                            <FormDescription>
                              Get notified about reviews on your courses
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailNotificationForm.control}
                      name="general_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              General Updates
                            </FormLabel>
                            <FormDescription>
                              Platform updates and important information
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetEmailPreferences}
                      className="border-gray-700"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset to Defaults
                    </Button>
                    <Button
                      type="submit"
                      className="bg-cyan-600 hover:bg-cyan-500"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TwoFactorAuthSection() {
  const [status, setStatus] = useState<{ is_enabled: boolean } | null>(null);
  const [setupData, setSetupData] = useState<{ secret: string; qr_code: string } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await api.get("/two-factor/status");
      setStatus(response.data);
    } catch (error) {
      console.error("Failed to fetch 2FA status", error);
    }
  };

  const handleSetup = async () => {
    setLoading(true);
    try {
      const response = await api.post("/two-factor/setup");
      setSetupData(response.data);
    } catch (error) {
      toast.error("Failed to initiate 2FA setup");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    if (!setupData) return;
    setLoading(true);
    try {
      const response = await api.post("/two-factor/verify-setup", {
        secret: setupData.secret,
        code: verificationCode
      });
      setBackupCodes(response.data.backup_codes);
      setStatus({ is_enabled: true });
      setSetupData(null);
      setVerificationCode("");
      toast.success("2FA enabled successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!verificationCode) {
      toast.error("Please enter your 2FA code to disable it");
      return;
    }
    setLoading(true);
    try {
      await api.post("/two-factor/disable", { code: verificationCode });
      setStatus({ is_enabled: false });
      setVerificationCode("");
      toast.success("2FA disabled successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  if (!status) return null;

  return (
    <Card className="bg-gray-900 border-gray-800 mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-500" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div>
            <p className="font-medium text-white">Status</p>
            <p className={status.is_enabled ? "text-green-400" : "text-yellow-400"}>
              {status.is_enabled ? "Enabled" : "Disabled"}
            </p>
          </div>
          {!status.is_enabled && !setupData && (
            <Button onClick={handleSetup} disabled={loading} className="bg-cyan-600 hover:bg-cyan-500">
              Enable 2FA
            </Button>
          )}
        </div>

        {setupData && (
          <div className="space-y-4 border-t border-gray-800 pt-4">
            <h3 className="text-lg font-medium text-white">Scan QR Code</h3>
            <p className="text-sm text-gray-400">
              Open your authenticator app (Google Authenticator, Authy, etc.) and scan this code.
            </p>
            <div className="flex justify-center p-4 bg-white rounded-lg w-fit mx-auto">
              <img src={`data:image/png;base64,${setupData.qr_code}`} alt="2FA QR Code" className="w-48 h-48" />
            </div>
            <div className="space-y-2">
              <Label>Or enter code manually:</Label>
              <code className="block p-2 bg-gray-800 rounded text-center font-mono text-cyan-400">
                {setupData.secret}
              </code>
            </div>
            <div className="space-y-2">
              <Label>Enter Verification Code</Label>
              <div className="flex gap-2">
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  className="bg-gray-800 border-gray-700 font-mono text-center tracking-widest"
                  maxLength={6}
                />
                <Button onClick={handleVerifySetup} disabled={loading || verificationCode.length !== 6}>
                  Verify & Enable
                </Button>
              </div>
            </div>
          </div>
        )}

        {status.is_enabled && (
          <div className="space-y-4 border-t border-gray-800 pt-4">
            <div className="space-y-2">
              <Label className="text-red-400">Disable 2FA</Label>
              <p className="text-sm text-gray-400 mb-2">
                Enter a code from your authenticator app to confirm disabling 2FA.
              </p>
              <div className="flex gap-2">
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  className="bg-gray-800 border-gray-700 font-mono text-center tracking-widest"
                  maxLength={6}
                />
                <Button
                  onClick={handleDisable}
                  variant="destructive"
                  disabled={loading || verificationCode.length !== 6}
                >
                  Disable 2FA
                </Button>
              </div>
            </div>
          </div>
        )}

        {backupCodes.length > 0 && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg space-y-2">
            <h4 className="font-bold text-yellow-500 flex items-center gap-2">
              <Lock className="h-4 w-4" /> Save your backup codes!
            </h4>
            <p className="text-sm text-yellow-200/80">
              If you lose access to your device, these codes are the only way to recover your account.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {backupCodes.map((code, i) => (
                <code key={i} className="bg-black/30 p-1 rounded text-center font-mono text-yellow-400">
                  {code}
                </code>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
              onClick={() => {
                navigator.clipboard.writeText(backupCodes.join("\n"));
                toast.success("Codes copied to clipboard");
              }}
            >
              Copy Codes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
