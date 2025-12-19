"use client";

import React, { useState, useCallback } from "react";
import {
  Search,
  X,
  Filter,
  Calendar,
  DollarSign,
  Tag,
  TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface SearchFilter {
  key: string;
  value: string;
  label: string;
  type: "text" | "select" | "date" | "range";
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  placeholder?: string;
  availableFilters?: {
    key: string;
    label: string;
    type: "text" | "select" | "date" | "range";
    options?: { value: string; label: string }[];
  }[];
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  placeholder = "Search...",
  availableFilters = [],
}) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback(() => {
    onSearch(query, filters);
  }, [query, filters, onSearch]);

  const addFilter = (filter: SearchFilter) => {
    setFilters((prev) => [...prev, filter]);
    handleSearch();
  };

  const removeFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setQuery("");
    setFilters([]);
    onSearch("", []);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      {/*/}
            {/* Main Search Bar */}
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-10 bg-gray-800/80 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
            aria-label="Search input"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          onClick={handleSearch}
          className="bg-cyan-600 hover:bg-cyan-500"
        >
          Search
        </Button>

        {availableFilters.length > 0 && (
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="border-gray-700"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">Active filters:</span>
          {filters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 cursor-pointer"
              onClick={() => removeFilter(index)}
            >
              {filter.label}: {filter.value}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          <button
            onClick={clearAll}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Quick Filter Suggestions */}
      {showFilters && availableFilters.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-medium text-white flex items-center gap-2">
            <Filter className="h-4 w-4 text-cyan-400" />
            Available Filters
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableFilters.map((filter) => (
              <div key={filter.key} className="space-y-1">
                <label className="text-xs text-gray-400">{filter.label}</label>
                {filter.type === "select" && filter.options && (
                  <select
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
                    onChange={(e) =>
                      addFilter({
                        key: filter.key,
                        value: e.target.value,
                        label: filter.label,
                        type: filter.type,
                      })
                    }
                  >
                    <option value="">Select...</option>
                    {filter.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {filter.type === "text" && (
                  <Input
                    type="text"
                    placeholder={`Enter ${filter.label.toLowerCase()}...`}
                    className="bg-gray-900 border-gray-700 text-white text-sm"
                    onBlur={(e) => {
                      if (e.target.value) {
                        addFilter({
                          key: filter.key,
                          value: e.target.value,
                          label: filter.label,
                          type: filter.type,
                        });
                      }
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
