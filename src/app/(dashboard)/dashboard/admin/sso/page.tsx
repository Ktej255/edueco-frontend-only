"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Globe,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

// Types
interface Organization {
  id: number;
  name: string;
  domain: string;
  slug: string;
  sso_enabled: boolean;
  sso_provider?: string;
}

interface SSOConfig {
  id: number;
  provider_type: "saml" | "oidc" | "oauth";
  provider_name: string;
  entity_id?: string;
  sso_url?: string;
  client_id?: string;
  is_active: boolean;
  jit_enabled: boolean;
}

export default function SSOAdminPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [ssoConfig, setSsoConfig] = useState<SSOConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [configuring, setConfiguring] = useState(false);

  // Form states
  const [providerType, setProviderType] = useState<string>("saml");
  const [providerName, setProviderName] = useState("");
  const [entityId, setEntityId] = useState("");
  const [ssoUrl, setSsoUrl] = useState("");
  const [cert, setCert] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [authEndpoint, setAuthEndpoint] = useState("");
  const [tokenEndpoint, setTokenEndpoint] = useState("");

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      fetchSSOConfig(selectedOrg.id);
    } else {
      setSsoConfig(null);
    }
  }, [selectedOrg]);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get("/api/v1/sso/organizations");
      setOrganizations(response.data);
      if (response.data.length > 0 && !selectedOrg) {
        setSelectedOrg(response.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch organizations", error);
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  const fetchSSOConfig = async (orgId: number) => {
    try {
      const response = await axios.get(
        `/api/v1/sso/organizations/${orgId}/sso-config`,
      );
      setSsoConfig(response.data);
    } catch (error) {
      setSsoConfig(null); // No config found
    }
  };

  const handleSaveConfig = async () => {
    if (!selectedOrg) return;

    try {
      setConfiguring(true);
      const payload = {
        provider_type: providerType,
        provider_name: providerName,
        // SAML
        entity_id: entityId,
        sso_url: ssoUrl,
        x509_cert: cert,
        // OAuth
        client_id: clientId,
        client_secret: clientSecret,
        authorization_endpoint: authEndpoint,
        token_endpoint: tokenEndpoint,

        jit_enabled: true,
        auto_assign_roles: true,
      };

      await axios.post(
        `/api/v1/sso/organizations/${selectedOrg.id}/sso-config`,
        payload,
      );
      toast.success("SSO configuration saved successfully");
      fetchSSOConfig(selectedOrg.id);
      fetchOrganizations(); // Refresh org list to show SSO enabled
    } catch (error) {
      console.error("Failed to save SSO config", error);
      toast.error("Failed to save configuration");
    } finally {
      setConfiguring(false);
    }
  };

  const handleTestConnection = async () => {
    if (!selectedOrg) return;
    try {
      const response = await axios.post(
        `/api/v1/sso/organizations/${selectedOrg.id}/test-connection`,
      );
      toast.success(`Connection test passed: ${response.data.message}`);
    } catch (error) {
      toast.error("Connection test failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enterprise SSO</h1>
          <p className="text-muted-foreground">
            Manage Single Sign-On configurations for your organizations.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Organization
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Organization List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Organizations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className={`p-4 cursor-pointer hover:bg-accent transition-colors ${selectedOrg?.id === org.id ? "bg-accent" : ""}`}
                  onClick={() => setSelectedOrg(org)}
                >
                  <div className="font-medium">{org.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {org.domain}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {org.sso_enabled ? (
                      <Badge variant="default" className="bg-green-600">
                        <Shield className="w-3 h-3 mr-1" /> SSO Active
                      </Badge>
                    ) : (
                      <Badge variant="outline">SSO Disabled</Badge>
                    )}
                  </div>
                </div>
              ))}
              {organizations.length === 0 && !loading && (
                <div className="p-4 text-center text-muted-foreground">
                  No organizations found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Configuration Panel */}
        <div className="md:col-span-3 space-y-6">
          {selectedOrg ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuration: {selectedOrg.name}
                  </CardTitle>
                  <CardDescription>
                    Configure Identity Provider (IdP) settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs
                    defaultValue="saml"
                    value={providerType}
                    onValueChange={setProviderType}
                  >
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="saml">SAML 2.0</TabsTrigger>
                      <TabsTrigger value="oidc">OIDC / OAuth 2.0</TabsTrigger>
                      <TabsTrigger value="azure">Azure AD (Preset)</TabsTrigger>
                    </TabsList>

                    <div className="space-y-4 mb-6">
                      <div className="grid gap-2">
                        <Label>Provider Name</Label>
                        <Input
                          placeholder="e.g. Corporate Okta"
                          value={providerName}
                          onChange={(e) => setProviderName(e.target.value)}
                        />
                      </div>
                    </div>

                    <TabsContent value="saml" className="space-y-4">
                      <div className="grid gap-2">
                        <Label>IdP Entity ID</Label>
                        <Input
                          placeholder="https://idp.example.com/metadata"
                          value={entityId}
                          onChange={(e) => setEntityId(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>SSO URL (ACS)</Label>
                        <Input
                          placeholder="https://idp.example.com/sso"
                          value={ssoUrl}
                          onChange={(e) => setSsoUrl(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>X.509 Certificate</Label>
                        <textarea
                          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="-----BEGIN CERTIFICATE-----..."
                          value={cert}
                          onChange={(e) => setCert(e.target.value)}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="oidc" className="space-y-4">
                      <div className="grid gap-2">
                        <Label>Client ID</Label>
                        <Input
                          value={clientId}
                          onChange={(e) => setClientId(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Client Secret</Label>
                        <Input
                          type="password"
                          value={clientSecret}
                          onChange={(e) => setClientSecret(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Authorization Endpoint</Label>
                        <Input
                          value={authEndpoint}
                          onChange={(e) => setAuthEndpoint(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Token Endpoint</Label>
                        <Input
                          value={tokenEndpoint}
                          onChange={(e) => setTokenEndpoint(e.target.value)}
                        />
                      </div>
                    </TabsContent>

                    <div className="mt-6 flex justify-end gap-3">
                      {ssoConfig && (
                        <Button
                          variant="outline"
                          onClick={handleTestConnection}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Test
                          Connection
                        </Button>
                      )}
                      <Button onClick={handleSaveConfig} disabled={configuring}>
                        {configuring ? "Saving..." : "Save Configuration"}
                      </Button>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Service Provider (SP) Settings
                    </CardTitle>
                    <CardDescription>
                      Use these values to configure your IdP
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Entity ID / Audience URI
                      </Label>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted p-2 rounded text-sm flex-1">
                          https://app.eduecosystem.com
                        </code>
                        <Button variant="ghost" size="sm">
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        ACS URL / Reply URL
                      </Label>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted p-2 rounded text-sm flex-1">
                          https://app.eduecosystem.com/api/v1/sso/callback/saml
                        </code>
                        <Button variant="ghost" size="sm">
                          Copy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Provisioning Settings
                    </CardTitle>
                    <CardDescription>
                      Control how users are created
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Just-in-Time (JIT) Provisioning</Label>
                        <p className="text-xs text-muted-foreground">
                          Create users automatically upon first login
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Role Mapping</Label>
                        <p className="text-xs text-muted-foreground">
                          Assign roles based on IdP groups
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-muted/10">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Select an Organization</h3>
              <p className="text-muted-foreground">
                Choose an organization to configure SSO settings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
