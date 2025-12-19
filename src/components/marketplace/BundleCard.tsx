import React from "react";
import { Bundle } from "@/services/bundleService";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface BundleCardProps {
  bundle: Bundle;
}

export function BundleCard({ bundle }: BundleCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-gray-100 rounded-t-lg overflow-hidden">
        {bundle.thumbnail_url ? (
          <img
            src={bundle.thumbnail_url}
            alt={bundle.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
            {bundle.title.charAt(0)}
          </div>
        )}
        {bundle.discount_percentage > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            {bundle.discount_percentage}% OFF
          </Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2">{bundle.title}</CardTitle>
        <div className="text-sm text-muted-foreground">
          {bundle.course_count} Courses Included
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {bundle.description}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            ${bundle.price}
          </span>
          {bundle.original_price > bundle.price && (
            <span className="text-sm text-gray-400 line-through">
              ${bundle.original_price}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/marketplace/bundles/${bundle.id}`} className="w-full">
          <Button className="w-full">View Bundle</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
