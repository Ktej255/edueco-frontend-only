import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import axios from "axios";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OrganizationFormProps {
  isEdit?: boolean;
}

export const OrganizationForm: React.FC<OrganizationFormProps> = ({
  isEdit,
}) => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    slug: "",
    sso_enabled: false,
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchOrganization();
    }
  }, [isEdit, id]);

  const fetchOrganization = async () => {
    try {
      const response = await api.get(`/organizations/${id}`);
      setFormData(response.data);
    } catch (err) {
      setError("Failed to load organization details");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sso_enabled: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit) {
        await api.patch(`/organizations/${id}`, formData);
      } else {
        await api.post("/organizations", formData);
      }
      router.push("/admin/organizations");
    } catch (err) {
      let message = "Failed to save organization";
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        message = err.response.data.detail;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit ? "Edit Organization" : "New Organization"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Domain (e.g., acme.com)</Label>
              <Input
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                required
              />
              <p className="text-sm text-muted-foreground">
                Used for auto-discovery of organization during login
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL identifier)</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
              />
              <p className="text-sm text-muted-foreground">
                Unique identifier for URLs (e.g., acme-corp)
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="sso_enabled"
                checked={formData.sso_enabled}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="sso_enabled">Enable SSO</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/organizations")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
