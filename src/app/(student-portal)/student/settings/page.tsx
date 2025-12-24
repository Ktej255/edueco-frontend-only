"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    User,
    Bell,
    Moon,
    Sun,
    Lock,
    Shield,
    Globe,
    ChevronRight,
    Save,
    Eye,
    EyeOff,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function StudentSettingsPage() {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form states
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        dailyReminder: true,
        streakAlerts: true,
    });

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSaveNotifications = async () => {
        setSaving(true);
        // In real implementation, save to backend
        await new Promise(resolve => setTimeout(resolve, 500));
        setSaving(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords don't match");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            return;
        }

        setSaving(true);
        // In real implementation, call API to change password
        await new Promise(resolve => setTimeout(resolve, 500));
        setSaving(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage your account preferences and settings
                    </p>
                </div>

                {/* Account Section */}
                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Email</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || "Not set"}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Name</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.full_name || "Not set"}</p>
                            </div>
                            <Link href="/student/profile">
                                <Button variant="outline" size="sm">
                                    Edit Profile <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                {/* Appearance Section */}
                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            {theme === 'dark' ? (
                                <Moon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            ) : (
                                <Sun className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            )}
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Toggle between light and dark themes
                            </p>
                        </div>
                        <Switch
                            checked={theme === 'dark'}
                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                        />
                    </div>
                </Card>

                {/* Notifications Section */}
                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Receive updates via email
                                </p>
                            </div>
                            <Switch
                                checked={notifications.email}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, email: checked })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Daily Reminder</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Get reminded to complete daily activities
                                </p>
                            </div>
                            <Switch
                                checked={notifications.dailyReminder}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, dailyReminder: checked })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Streak Alerts</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Get notified before losing your streak
                                </p>
                            </div>
                            <Switch
                                checked={notifications.streakAlerts}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, streakAlerts: checked })
                                }
                            />
                        </div>
                        <Button
                            onClick={handleSaveNotifications}
                            disabled={saving}
                            className="mt-4"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Save Preferences
                        </Button>
                    </div>
                </Card>

                {/* Security Section */}
                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security</h2>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="pr-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pr-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm New Password
                            </label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                placeholder="Confirm new password"
                            />
                        </div>

                        {passwordError && (
                            <p className="text-red-500 text-sm">{passwordError}</p>
                        )}

                        <Button type="submit" disabled={saving || !currentPassword || !newPassword}>
                            <Lock className="mr-2 h-4 w-4" />
                            Change Password
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Link href="/settings/2fa-setup">
                            <Button variant="outline" className="w-full justify-between">
                                <span className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Two-Factor Authentication
                                </span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
