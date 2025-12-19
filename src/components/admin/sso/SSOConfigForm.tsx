import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import axios from "axios";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SSOConfigFormProps {
  orgId?: string;
}

export const SSOConfigForm: React.FC<SSOConfigFormProps> = ({ orgId }) => {
  const params = useParams();
  const organizationId = orgId || params?.id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);

  const [providerType, setProviderType] = useState("SAML");
  const [formData, setFormData] = useState({
    provider_name: "",
    // SAML
    entity_id: "",
    idp_entity_id: "",
    sso_url: "",
    x509_cert: "",
    // OAuth
    client_id: "",
    client_secret: "",
    authorization_endpoint: "",
    token_endpoint: "",
    userinfo_endpoint: "",
    scopes: "openid email profile",
    // Settings
    jit_enabled: true,
    auto_assign_roles: true,
  });

  useEffect(() => {
    if (organizationId) {
      fetchConfig();
    }
  }, [organizationId]);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/organizations/${organizationId}/sso-config`,
      );
      const config = response.data;
      setProviderType(config.provider_type);
      setFormData({
        ...formData,
        ...config,
        scopes: Array.isArray(config.scopes)
          ? config.scopes.join(" ")
          : config.scopes,
      });
    } catch (err) {
      console.log("No existing config found");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...formData,
        provider_type: providerType,
        scopes: formData.scopes.split(" ").filter((s: string) => s),
      };

      await api.post(`/organizations/${organizationId}/sso-config`, payload);
      setSuccess("Configuration saved successfully");
    } catch (err) {
      let message = "Failed to save configuration";
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        message = err.response.data.detail;
      }
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const response = await api.post(
        `/organizations/${organizationId}/test-connection`,
      );
      setTestResult(response.data);
    } catch (err: any) {
      setTestResult({
        status: "error",
        message: err.response?.data?.detail || "Connection test failed",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.provider_name)
    return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>SSO Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6">
            <Label>Provider Type</Label>
            <Select value={providerType} onValueChange={setProviderType}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SAML">SAML 2.0</SelectItem>
                <SelectItem value="OAUTH">OAuth 2.0</SelectItem>
                <SelectItem value="OIDC">OpenID Connect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider_name">
                Provider Name (Display Name)
              </Label>
              <Input
                id="provider_name"
                name="provider_name"
                value={formData.provider_name}
                onChange={handleChange}
                required
                placeholder="e.g. Azure AD, Okta"
              />
            </div>

            <div className="py-4 border-t border-b my-4">
              <h3 className="text-lg font-medium mb-4">Protocol Settings</h3>

              {providerType === "SAML" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="idp_entity_id">
                      IdP Entity ID (Issuer)
                    </Label>
                    <Input
                      id="idp_entity_id"
                      name="idp_entity_id"
                      value={formData.idp_entity_id}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sso_url">
                      Single Sign-On URL (SSO URL)
                    </Label>
                    <Input
                      id="sso_url"
                      name="sso_url"
                      value={formData.sso_url}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="x509_cert">X.509 Certificate</Label>
                    <textarea
                      id="x509_cert"
                      name="x509_cert"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      rows={4}
                      value={formData.x509_cert}
                      onChange={(e) =>
                        setFormData({ ...formData, x509_cert: e.target.value })
                      }
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Paste the certificate content without headers if possible
                    </p>
                  </div>
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-800 text-sm">
                      <strong>SP Entity ID:</strong>{" "}
                      https://app.eduecosystem.com
                      <br />
                      <strong>ACS URL:</strong>{" "}
                      https://app.eduecosystem.com/api/v1/sso/callback/saml
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {(providerType === "OAUTH" || providerType === "OIDC") && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_id">Client ID</Label>
                    <Input
                      id="client_id"
                      name="client_id"
                      value={formData.client_id}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_secret">Client Secret</Label>
                    <Input
                      id="client_secret"
                      name="client_secret"
                      type="password"
                      value={formData.client_secret}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authorization_endpoint">
                      Authorization Endpoint
                    </Label>
                    <Input
                      id="authorization_endpoint"
                      name="authorization_endpoint"
                      value={formData.authorization_endpoint}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="token_endpoint">Token Endpoint</Label>
                    <Input
                      id="token_endpoint"
                      name="token_endpoint"
                      value={formData.token_endpoint}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userinfo_endpoint">
                      User Info Endpoint
                    </Label>
                    <Input
                      id="userinfo_endpoint"
                      name="userinfo_endpoint"
                      value={formData.userinfo_endpoint}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scopes">Scopes</Label>
                    <Input
                      id="scopes"
                      name="scopes"
                      value={formData.scopes}
                      onChange={handleChange}
                      placeholder="openid email profile"
                    />
                  </div>
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-800 text-sm">
                      <strong>Redirect URI:</strong>{" "}
                      https://app.eduecosystem.com/api/v1/sso/callback/oauth
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Provisioning Settings</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="jit_enabled">
                    Enable Just-In-Time (JIT) Provisioning
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create users when they log in via SSO for the
                    first time.
                  </p>
                </div>
                <Switch
                  id="jit_enabled"
                  checked={formData.jit_enabled}
                  onCheckedChange={(c) => handleSwitchChange("jit_enabled", c)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto_assign_roles">
                    Auto-assign Roles from Groups
                  </Label>
                </div>
                <Switch
                  id="auto_assign_roles"
                  checked={formData.auto_assign_roles}
                  onCheckedChange={(c) =>
                    handleSwitchChange("auto_assign_roles", c)
                  }
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Configuration
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={saving || loading}
              >
                Test Connection
              </Button>
            </div>

            {testResult && (
              <Alert
                variant={
                  testResult.status === "success" ? "default" : "destructive"
                }
                className={
                  testResult.status === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : ""
                }
              >
                <AlertDescription>
                  <div className="font-medium mb-1">
                    Connection Test Result:
                  </div>
                  {testResult.message}
                  {testResult.cert_expiry && (
                    <div className="mt-1 text-sm">
                      Certificate Expiry:{" "}
                      {new Date(testResult.cert_expiry).toLocaleDateString()}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
