"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Star,
  Users,
  Clock,
  TrendingUp,
  Sparkles,
  Filter,
  X,
  Award,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Course {
  id: number;
  title: string;
  description: string;
  category_name?: string;
  level: string;
  thumbnail_url: string | null;
  price: number;
  currency: string;
  total_enrollments: number;
  average_rating: number;
  total_reviews: number;
  total_duration_minutes: number;
  instructor_name?: string;
  is_published: boolean;
}

interface Category {
  id: number;
  name: string;
}

const LEVELS = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const PRICE_RANGES = [
  { value: "all", label: "All Prices", min: 0, max: 100000 },
  { value: "free", label: "Free", min: 0, max: 0 },
  { value: "under500", label: "Under ₹500", min: 1, max: 500 },
  { value: "500to2000", label: "₹500 - ₹2,000", min: 500, max: 2000 },
  { value: "above2000", label: "Above ₹2,000", min: 2000, max: 100000 },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "popularity", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const RATING_FILTER = [
  { value: "all", label: "All Ratings" },
  { value: "4plus", label: "4+ Stars" },
  { value: "3plus", label: "3+ Stars" },
];

export default function MarketplacePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedSort, setSelectedSort] = useState("popularity");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Debounce search
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      fetchCourses();
    }, 500);
    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [
    search,
    selectedCategory,
    selectedLevel,
    selectedPriceRange,
    selectedRating,
    selectedSort,
  ]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const priceRange =
        PRICE_RANGES.find((r) => r.value === selectedPriceRange) ||
        PRICE_RANGES[0];

      const params: any = {
        limit: 50,
        sort_by: selectedSort,
        min_price: priceRange.min,
        max_price: priceRange.max,
        is_published: true, // Only show published courses in marketplace
      };

      if (search) params.search = search;
      if (selectedCategory !== "all")
        params.category_id = parseInt(selectedCategory);
      if (selectedLevel !== "all") params.level = selectedLevel;

      // Rating filter
      if (selectedRating === "4plus") params.min_rating = 4;
      if (selectedRating === "3plus") params.min_rating = 3;

      const response = await api.get("/courses/", { params });
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSelectedPriceRange("all");
    setSelectedRating("all");
    setSelectedSort("popularity");
  };

  const activeFilterCount = [
    selectedCategory !== "all" ? 1 : 0,
    selectedLevel !== "all" ? 1 : 0,
    selectedPriceRange !== "all" ? 1 : 0,
    selectedRating !== "all" ? 1 : 0,
    search ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-br from-cyan-900/30 via-gray-900 to-blue-900/30 rounded-3xl border border-cyan-500/20 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
              <ShoppingCart className="h-10 w-10 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Course Marketplace
              </h1>
              <p className="text-gray-300 mt-2 text-lg">
                Discover and enroll in courses from expert instructors
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-900/50  rounded-xl p-4 border border-gray-800">
              <div className="text-2xl font-bold text-cyan-400">
                {courses.length}+
              </div>
              <div className="text-gray-400 text-sm">Courses Available</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="text-2xl font-bold text-green-400">
                {courses.filter((c) => c.price === 0).length}
              </div>
              <div className="text-gray-400 text-sm">Free Courses</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="text-2xl font-bold text-purple-400">
                {categories.length}
              </div>
              <div className="text-gray-400 text-sm">Categories</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="text-2xl font-bold text-yellow-400">
                {courses.reduce((sum, c) => sum + c.total_enrollments, 0)}+
              </div>
              <div className="text-gray-400 text-sm">Total Enrollments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              {activeFilterCount > 0 && (
                <Badge className="bg-cyan-500/20 text-cyan-400">
                  {activeFilterCount} active
                </Badge>
              )}
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(e.target.value)
                  }
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Level */}
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                Level
              </label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  {LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                Sort By
              </label>
              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row - Price & Rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Price Range */}
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                Price Range
              </label>
              <Select
                value={selectedPriceRange}
                onValueChange={setSelectedPriceRange}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  {PRICE_RANGES.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating */}
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                Minimum Rating
              </label>
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  {RATING_FILTER.map((rating) => (
                    <SelectItem key={rating.value} value={rating.value}>
                      {rating.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            {loading ? "Loading..." : `${courses.length} courses found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-xl border border-gray-800 p-4 animate-pulse"
              >
                <div className="bg-gray-800 h-40 rounded-lg mb-4" />
                <div className="bg-gray-800 h-6 rounded mb-2" />
                <div className="bg-gray-800 h-4 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="bg-gray-900 border-gray-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
                onClick={() => router.push(`/lms/courses/${course.id}`)}
              >
                <CardContent className="p-0">
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gray-800 rounded-t-xl overflow-hidden">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Award className="h-16 w-16 text-gray-700" />
                      </div>
                    )}
                    {course.price === 0 && (
                      <Badge className="absolute top-3 right-3 bg-green-500/90 text-white border-0">
                        FREE
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 flex-1">
                        {course.title}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                      {course.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span>{course.average_rating.toFixed(1)}</span>
                        <span>({course.total_reviews})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{course.total_enrollments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {Math.floor(course.total_duration_minutes / 60)}h
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                      <div>
                        {course.price > 0 ? (
                          <div className="text-2xl font-bold text-cyan-400">
                            ₹{course.price.toLocaleString("en-IN")}
                          </div>
                        ) : (
                          <div className="text-xl font-bold text-green-400">
                            Free
                          </div>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className="border-cyan-500/50 text-cyan-400"
                      >
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800 border-dashed">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or search terms
            </p>
            <Button
              onClick={clearFilters}
              className="bg-cyan-600 hover:bg-cyan-500"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
