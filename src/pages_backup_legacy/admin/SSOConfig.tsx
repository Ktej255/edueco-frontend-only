import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../utils/api";

interface SSOConfig {
  id?: number;
  provider_type: "SAML" | "OAUTH" | "OIDC";
  provider_name: string;
  // SAML
  entity_id?: string;
  idp_entity_id?: string;
  sso_url?: string;
  x509_cert?: string;
  // OAuth
  client_id?: string;
  client_secret?: string;
  authorization_endpoint?: string;
  token_endpoint?: string;
  userinfo_endpoint?: string;
  scopes?: string[];
  // Config
  jit_enabled: boolean;
  auto_assign_roles: boolean;
}

export const SSOConfigPage: React.FC = () => {
  // Note: In Next.js App Router, params are passed to the page component,
  // but here we are in a client component imported by a page.
  // We'll assume the wrapper passes orgId or we use useParams
  const params = useParams();
  const orgId = params?.orgId;
  const router = useRouter();

  const [config, setConfig] = useState<SSOConfig>({
    provider_type: "OAUTH",
    provider_name: "Azure AD",
    jit_enabled: true,
    auto_assign_roles: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (orgId) fetchConfig();
  }, [orgId]);

  const fetchConfig = async () => {
    try {
      const response = await api.get(`/organizations/${orgId}/sso-config`);
      setConfig(response.data);
    } catch (err) {
      console.log("No existing config found");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post(`/organizations/${orgId}/sso-config`, config);
      setSuccess("Configuration saved successfully");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to save configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-white">
        SSO Configuration
      </h1>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-200">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Provider Type
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
              value={config.provider_type}
              onChange={(e) =>
                setConfig({ ...config, provider_type: e.target.value as any })
              }
            >
              <option value="OAUTH">OAuth 2.0 / OIDC</option>
              <option value="SAML">SAML 2.0</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Provider Name
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
              value={config.provider_name}
              onChange={(e) =>
                setConfig({ ...config, provider_name: e.target.value })
              }
              placeholder="e.g., Azure AD, Google Workspace"
            />
          </div>

          {config.provider_type === "SAML" && (
            <div className="space-y-4 border-t pt-4 dark:border-zinc-800">
              <h3 className="font-medium text-zinc-900 dark:text-white">
                SAML Settings
              </h3>
              <input
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                placeholder="IdP Entity ID"
                value={config.idp_entity_id || ""}
                onChange={(e) =>
                  setConfig({ ...config, idp_entity_id: e.target.value })
                }
              />
              <input
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                placeholder="SSO URL"
                value={config.sso_url || ""}
                onChange={(e) =>
                  setConfig({ ...config, sso_url: e.target.value })
                }
              />
              <textarea
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                rows={4}
                placeholder="X.509 Certificate"
                value={config.x509_cert || ""}
                onChange={(e) =>
                  setConfig({ ...config, x509_cert: e.target.value })
                }
              />
            </div>
          )}

          {config.provider_type === "OAUTH" && (
            <div className="space-y-4 border-t pt-4 dark:border-zinc-800">
              <h3 className="font-medium text-zinc-900 dark:text-white">
                OAuth Settings
              </h3>
              <input
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                placeholder="Client ID"
                value={config.client_id || ""}
                onChange={(e) =>
                  setConfig({ ...config, client_id: e.target.value })
                }
              />
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                placeholder="Client Secret"
                value={config.client_secret || ""}
                onChange={(e) =>
                  setConfig({ ...config, client_secret: e.target.value })
                }
              />
              <input
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                placeholder="Authorization Endpoint"
                value={config.authorization_endpoint || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    authorization_endpoint: e.target.value,
                  })
                }
              />
              <input
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                placeholder="Token Endpoint"
                value={config.token_endpoint || ""}
                onChange={(e) =>
                  setConfig({ ...config, token_endpoint: e.target.value })
                }
              />
              <input
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                placeholder="User Info Endpoint"
                value={config.userinfo_endpoint || ""}
                onChange={(e) =>
                  setConfig({ ...config, userinfo_endpoint: e.target.value })
                }
              />
            </div>
          )}

          <div className="space-y-2 border-t pt-4 dark:border-zinc-800">
            <h3 className="font-medium text-zinc-900 dark:text-white">
              Provisioning
            </h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.jit_enabled}
                onChange={(e) =>
                  setConfig({ ...config, jit_enabled: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Enable Just-In-Time (JIT) Provisioning
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.auto_assign_roles}
                onChange={(e) =>
                  setConfig({ ...config, auto_assign_roles: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Auto-assign Roles from Groups
              </span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Configuration"}
            </button>
            <button
              onClick={() => router.push("/admin/organizations")}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
