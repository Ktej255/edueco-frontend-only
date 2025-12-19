"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Edit, Trash2, Globe } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface TaxRate {
  id: number;
  country_code: string;
  state_code: string | null;
  region_name: string;
  tax_name: string;
  tax_rate: number;
  tax_type: string;
  applies_to_digital_goods: boolean;
  applies_to_physical_goods: boolean;
  applies_to_services: boolean;
  applies_to_subscriptions: boolean;
  is_active: boolean;
  description: string | null;
  created_at: string;
}

export default function TaxConfigPage() {
  const [rates, setRates] = useState<TaxRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRate, setEditingRate] = useState<TaxRate | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    country_code: "",
    state_code: "",
    region_name: "",
    tax_name: "",
    tax_rate: "",
    applies_to_digital_goods: true,
    applies_to_physical_goods: true,
    applies_to_services: true,
    applies_to_subscriptions: true,
    description: "",
  });

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/tax/rates`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRates(response.data);
    } catch (error) {
      console.error("Failed to fetch tax rates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        tax_rate: parseFloat(formData.tax_rate) / 100, // Convert percentage to decimal
        state_code: formData.state_code || null,
      };

      if (editingRate) {
        await axios.put(
          `${API_URL}/api/v1/tax/rates/${editingRate.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
      } else {
        await axios.post(`${API_URL}/api/v1/tax/rates`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      setShowForm(false);
      setEditingRate(null);
      resetForm();
      fetchRates();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to save tax rate");
    }
  };

  const handleEdit = (rate: TaxRate) => {
    setEditingRate(rate);
    setFormData({
      country_code: rate.country_code,
      state_code: rate.state_code || "",
      region_name: rate.region_name,
      tax_name: rate.tax_name,
      tax_rate: (rate.tax_rate * 100).toString(),
      applies_to_digital_goods: rate.applies_to_digital_goods,
      applies_to_physical_goods: rate.applies_to_physical_goods,
      applies_to_services: rate.applies_to_services,
      applies_to_subscriptions: rate.applies_to_subscriptions,
      description: rate.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to deactivate this tax rate?")) return;

    try {
      await axios.delete(`${API_URL}/api/v1/tax/rates/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchRates();
    } catch (error) {
      alert("Failed to delete tax rate");
    }
  };

  const resetForm = () => {
    setFormData({
      country_code: "",
      state_code: "",
      region_name: "",
      tax_name: "",
      tax_rate: "",
      applies_to_digital_goods: true,
      applies_to_physical_goods: true,
      applies_to_services: true,
      applies_to_subscriptions: true,
      description: "",
    });
  };

  if (loading) {
    return (
      <div className="container max-w-6xl py-10">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tax Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Manage tax rates for different regions and product types
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setEditingRate(null);
              resetForm();
            }
          }}
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Tax Rate
            </>
          )}
        </Button>
      </div>

      {/* Tax Rate Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingRate ? "Edit Tax Rate" : "New Tax Rate"}
            </CardTitle>
            <CardDescription>
              Configure tax rate for a specific region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country_code">Country Code *</Label>
                  <Input
                    id="country_code"
                    placeholder="US"
                    maxLength={2}
                    value={formData.country_code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        country_code: e.target.value.toUpperCase(),
                      })
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    ISO 3166-1 alpha-2
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state_code">State Code</Label>
                  <Input
                    id="state_code"
                    placeholder="CA"
                    maxLength={10}
                    value={formData.state_code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        state_code: e.target.value.toUpperCase(),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">Optional</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region_name">Region Name *</Label>
                  <Input
                    id="region_name"
                    placeholder="California"
                    value={formData.region_name}
                    onChange={(e) =>
                      setFormData({ ...formData, region_name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax_name">Tax Name *</Label>
                  <Input
                    id="tax_name"
                    placeholder="Sales Tax"
                    value={formData.tax_name}
                    onChange={(e) =>
                      setFormData({ ...formData, tax_name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax_rate">Tax Rate (%) *</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    step="0.01"
                    placeholder="8.25"
                    value={formData.tax_rate}
                    onChange={(e) =>
                      setFormData({ ...formData, tax_rate: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    e.g., 8.25 for 8.25%
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Optional description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Product Type Toggles */}
              <div className="space-y-3">
                <Label>Applies To:</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm">Digital Goods</span>
                    <Switch
                      checked={formData.applies_to_digital_goods}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          applies_to_digital_goods: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm">Physical Goods</span>
                    <Switch
                      checked={formData.applies_to_physical_goods}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          applies_to_physical_goods: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm">Services</span>
                    <Switch
                      checked={formData.applies_to_services}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          applies_to_services: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm">Subscriptions</span>
                    <Switch
                      checked={formData.applies_to_subscriptions}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          applies_to_subscriptions: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  {editingRate ? "Update Tax Rate" : "Create Tax Rate"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingRate(null);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tax Rates List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Configured Tax Rates</h2>

        {rates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No tax rates configured yet
              </p>
              <Button onClick={() => setShowForm(true)} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Tax Rate
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {rates.map((rate) => (
              <Card
                key={rate.id}
                className={!rate.is_active ? "opacity-60" : ""}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          {rate.region_name}
                        </h3>
                        <Badge
                          variant={rate.is_active ? "default" : "secondary"}
                        >
                          {rate.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-mono">
                          {rate.country_code}
                          {rate.state_code && `-${rate.state_code}`}
                        </span>
                        <span>•</span>
                        <span>{rate.tax_name}</span>
                        <span>•</span>
                        <span className="font-semibold text-foreground">
                          {(rate.tax_rate * 100).toFixed(2)}%
                        </span>
                      </div>

                      {/* Product Type Badges */}
                      <div className="flex gap-2 flex-wrap">
                        {rate.applies_to_digital_goods && (
                          <Badge variant="outline" className="text-xs">
                            Digital Goods
                          </Badge>
                        )}
                        {rate.applies_to_physical_goods && (
                          <Badge variant="outline" className="text-xs">
                            Physical Goods
                          </Badge>
                        )}
                        {rate.applies_to_services && (
                          <Badge variant="outline" className="text-xs">
                            Services
                          </Badge>
                        )}
                        {rate.applies_to_subscriptions && (
                          <Badge variant="outline" className="text-xs">
                            Subscriptions
                          </Badge>
                        )}
                      </div>

                      {rate.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {rate.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(rate)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(rate.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
