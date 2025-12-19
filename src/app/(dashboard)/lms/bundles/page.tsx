"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { BundleCard } from "@/components/features/lms/BundleCard";

interface Bundle {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  thumbnail_url: string | null;
  courses: any[];
  total_value: number;
}

export default function BundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const response = await api.get("/bundles/");
      setBundles(response.data);
    } catch (error) {
      console.error("Failed to fetch bundles:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Course Bundles
            </h1>
            <p className="text-gray-400">
              Package and sell your courses together.
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-500" asChild>
            <Link href="/lms/bundles/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Bundle
            </Link>
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : bundles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-6">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No bundles created yet
            </h3>
            <p className="text-gray-400 mb-8">
              Create your first bundle to package courses together.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-500 px-8" asChild>
              <Link href="/lms/bundles/create">Create a Bundle</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
