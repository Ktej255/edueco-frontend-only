"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function SSOLogin() {
    const router = useRouter();
    const [orgSlug, setOrgSlug] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ssoEnabled, setSsoEnabled] = useState(false);
    const [providerName, setProviderName] = useState("");

    const checkOrganization = async () => {
        if (!orgSlug) {
            setError("Please enter an organization slug");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Check if organization exists and has SSO enabled
            // This is a hypothetical endpoint based on context
            const response = await api.get(`/sso/check/${orgSlug}`);
            if (response.data.enabled) {
                setSsoEnabled(true);
                setProviderName(response.data.provider || "SSO");
            } else {
                setError("SSO is not enabled for this organization");
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || "Organization not found");
        } finally {
            setLoading(false);
        }
    };

    const handleSSOLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/sso/login/${orgSlug}`);

            if (response.data.redirect_url) {
                window.location.href = response.data.redirect_url;
            } else {
                setError('Failed to get SSO URL');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'SSO Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
            <h1 className="text-2xl font-bold text-center mb-6 text-zinc-900 dark:text-white">
                Sign in to your account
            </h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                    {error}
                </div>
            )}

            {!ssoEnabled ? (
                <div className="space-y-4">
                    <div>
                        <label htmlFor="orgSlug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Organization Slug
                        </label>
                        <input
                            id="orgSlug"
                            type="text"
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                            value={orgSlug}
                            onChange={(e) => setOrgSlug(e.target.value)}
                            placeholder="e.g. acme-corp"
                            autoFocus
                        />
                    </div>

                    <button
                        onClick={checkOrganization}
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Continue'}
                    </button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-300 dark:border-zinc-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-500">OR</span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/login')}
                        className="w-full flex justify-center py-2 px-4 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Sign in with Email & Password
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-center text-zinc-600 dark:text-zinc-400">
                        Sign in with {providerName}
                    </p>

                    <button
                        onClick={handleSSOLogin}
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2f2f2f] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#f35325" d="M1 1h10v10H1z" />
                            <path fill="#81bc06" d="M12 1h10v10H12z" />
                            <path fill="#05a6f0" d="M1 12h10v10H1z" />
                            <path fill="#ffba08" d="M12 12h10v10H12z" />
                        </svg>
                        Sign in with SSO
                    </button>

                    <button
                        onClick={() => {
                            setSsoEnabled(false);
                            setOrgSlug('');
                            setError(null);
                        }}
                        className="w-full text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    >
                        Back
                    </button>
                </div>
            )}
        </div>
    );
}
