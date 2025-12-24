"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { TwoFactorVerification } from "@/components/auth/TwoFactorVerification";
import { twoFactorService } from "@/services/twoFactorService";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const { login, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(email, password);

      // Check if 2FA is required
      if (response?.require_2fa) {
        setRequires2FA(true);
        setTempToken(response.access_token); // Temporary token for 2FA verification
      }
    } catch (err: any) {
      console.error(err);
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((e: any) => e.msg).join(", "));
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Invalid email or password");
      }
    }
  };

  const handle2FAVerification = async (code: string) => {
    try {
      // Store temp token for the API call
      if (tempToken) {
        localStorage.setItem("token", tempToken);
      }

      const response = await twoFactorService.verifyLogin(code);

      // Update with full access token
      localStorage.setItem("token", response.access_token);

      // Redirect to student portal (Master ID can access both portals)
      window.location.href = "/student/dashboard";
    } catch (err: any) {
      // Error will be handled by TwoFactorVerification component
      throw err;
    }
  };

  const handleCancel2FA = () => {
    setRequires2FA(false);
    setTempToken("");
    setEmail("");
    setPassword("");
  };

  // Show 2FA verification if required
  if (requires2FA) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="w-full max-w-md space-y-8 p-8 border border-gray-800 rounded-xl bg-gray-900/50 backdrop-blur-sm">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Two-Factor Authentication
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter the code from your authenticator app
            </p>
          </div>
          <TwoFactorVerification
            onVerify={handle2FAVerification}
            onCancel={handleCancel2FA}
            title=""
            description=""
          />
        </div>
      </div>
    );
  }

  // Standard login form
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="w-full max-w-md space-y-8 p-8 border border-gray-800 rounded-xl bg-gray-900/50 backdrop-blur-sm">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to your holistic learning account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div className="mb-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-end mt-2">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
        <div className="text-center text-sm">
          <span className="text-gray-400">Don't have an account? </span>
          <Link
            href="/register"
            className="font-medium text-cyan-400 hover:text-cyan-300"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
