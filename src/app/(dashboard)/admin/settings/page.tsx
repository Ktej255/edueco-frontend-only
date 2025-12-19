"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings as SettingsIcon,
  Save,
  Bell,
  Users,
  Server,
  Shield,
  Mail,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Holistic Learning Ecosystem",
    maxUploadSize: "10",
    allowRegistration: true,
    requireEmailVerification: false,
    maintenanceMode: false,
    analyticsEnabled: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real implementation, this would save to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Header with Gradient */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30">
            <SettingsIcon className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-400 mt-1">
              Manage your account settings and preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Notifications Section */}
        <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800/50 border-gray-800/50 p-6 backdrop-blur-sm shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
              <Bell className="h-5 w-5 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Notifications</h3>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Configure how you want to receive notifications.
          </p>

          <div className="space-y-6">
            {/* Email Notifications */}
            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-cyan-400 mt-1" />
                  <div>
                    <p className="text-white font-semibold">
                      Email Notifications
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Receive emails about your streak, rewards, and activity.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      requireEmailVerification:
                        !settings.requireEmailVerification,
                    })
                  }
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 shadow-lg ${
                    settings.requireEmailVerification
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/30"
                      : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${
                      settings.requireEmailVerification
                        ? "translate-x-7"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Marketing Emails */}
            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-purple-400 mt-1" />
                  <div>
                    <p className="text-white font-semibold">Marketing Emails</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Receive emails about new features and special offers.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      analyticsEnabled: !settings.analyticsEnabled,
                    })
                  }
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 shadow-lg ${
                    settings.analyticsEnabled
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-purple-500/30"
                      : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${
                      settings.analyticsEnabled
                        ? "translate-x-7"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Settings Section */}
        <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800/50 border-gray-800/50 p-6 backdrop-blur-sm shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Profile Settings</h3>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Update your personal information.
          </p>

          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50">
              <p className="text-gray-300 mb-3">
                To update your profile details, please visit the Profile page.
              </p>
              <Button
                variant="outline"
                className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50 hover:border-purple-400 hover:bg-purple-600/30 transition-all duration-300"
              >
                Go to Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* System Settings (Admin Only) */}
        <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800/50 border-gray-800/50 p-6 backdrop-blur-sm shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30">
              <Server className="h-5 w-5 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white">System Settings</h3>
            <span className="px-2 py-1 rounded-md bg-orange-500/20 text-orange-400 text-xs font-semibold">
              Admin
            </span>
          </div>

          <div className="space-y-4">
            {/* Site Name */}
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-medium">
                Site Name
              </label>
              <Input
                type="text"
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
                className="bg-gray-800/80 border-gray-700/50 text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Max Upload Size */}
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-medium">
                Max Upload Size (MB)
              </label>
              <Input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) =>
                  setSettings({ ...settings, maxUploadSize: e.target.value })
                }
                className="bg-gray-800/80 border-gray-700/50 text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Toggles */}
            <div className="pt-4 space-y-4">
              {/* Allow Registration */}
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-white font-semibold">
                        Allow Registration
                      </p>
                      <p className="text-gray-400 text-sm">
                        Enable new user signups
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        allowRegistration: !settings.allowRegistration,
                      })
                    }
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 shadow-lg ${
                      settings.allowRegistration
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/30"
                        : "bg-gray-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${
                        settings.allowRegistration
                          ? "translate-x-7"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Maintenance Mode */}
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-red-500/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="text-white font-semibold">
                        Maintenance Mode
                      </p>
                      <p className="text-gray-400 text-sm">
                        Disable access for non-admin users
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        maintenanceMode: !settings.maintenanceMode,
                      })
                    }
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 shadow-lg ${
                      settings.maintenanceMode
                        ? "bg-gradient-to-r from-red-500 to-orange-500 shadow-red-500/30"
                        : "bg-gray-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${
                        settings.maintenanceMode
                          ? "translate-x-7"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="sticky bottom-8 z-10">
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-lg py-7 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] font-semibold"
          >
            {saved ? (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2 animate-pulse" />
                Settings Saved!
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
