"use client";

import React, { useState } from "react";
import { Trash2, Edit, Download, Eye, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/Toast";

interface BulkActionsProps<T> {
  selectedItems: T[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  allSelected: boolean;
  actions: BulkAction<T>[];
}

export interface BulkAction<T> {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "red" | "yellow" | "purple";
  confirmation?: {
    title: string;
    message: string;
  };
  onExecute: (items: T[]) => Promise<void>;
}

export function BulkActions<T>({
  selectedItems,
  onSelectAll,
  onDeselectAll,
  allSelected,
  actions,
}: BulkActionsProps<T>) {
  const [executing, setExecuting] = useState<string | null>(null);
  const { showToast } = useToast();

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-600 hover:bg-blue-500",
      green: "bg-green-600 hover:bg-green-500",
      red: "bg-red-600 hover:bg-red-500",
      yellow: "bg-yellow-600 hover:bg-yellow-500",
      purple: "bg-purple-600 hover:bg-purple-500",
    };
    return colors[color as keyof typeof colors];
  };

  const handleExecute = async (action: BulkAction<T>) => {
    if (selectedItems.length === 0) {
      showToast("No items selected", "warning");
      return;
    }

    if (action.confirmation) {
      const confirmed = window.confirm(
        `${action.confirmation.title}\n\n${action.confirmation.message}\n\nThis will affect ${selectedItems.length} item(s).`,
      );
      if (!confirmed) return;
    }

    setExecuting(action.id);
    try {
      await action.onExecute(selectedItems);
      showToast(`${action.label} completed successfully`, "success");
      onDeselectAll();
    } catch (error) {
      console.error(`Bulk action ${action.id} failed:`, error);
      showToast(`Failed to ${action.label.toLowerCase()}`, "error");
    } finally {
      setExecuting(null);
    }
  };

  if (selectedItems.length === 0 && !allSelected) {
    return null;
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {allSelected ? (
              <CheckSquare className="h-5 w-5 text-blue-500" />
            ) : (
              <Square className="h-5 w-5" />
            )}
          </button>
          <p className="text-white font-medium">
            {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""}{" "}
            selected
          </p>
        </div>

        <div className="flex items-center gap-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              onClick={() => handleExecute(action)}
              disabled={executing !== null}
              className={`${getColorClasses(action.color)} text-white`}
            >
              {executing === action.id ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                action.icon
              )}
              <span className="ml-2">{action.label}</span>
            </Button>
          ))}

          <Button
            onClick={onDeselectAll}
            variant="outline"
            className="border-gray-700 text-gray-300"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}

// Example usage component
export const BulkActionsExample = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const items = [1, 2, 3, 4, 5]; // Your data

  const bulkActions: BulkAction<number>[] = [
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      color: "red",
      confirmation: {
        title: "Delete Items",
        message:
          "Are you sure you want to delete these items? This action cannot be undone.",
      },
      onExecute: async (items) => {
        // API call to delete items
        console.log("Deleting:", items);
      },
    },
    {
      id: "export",
      label: "Export",
      icon: <Download className="h-4 w-4" />,
      color: "blue",
      onExecute: async (items) => {
        // API call to export items
        console.log("Exporting:", items);
      },
    },
    {
      id: "archive",
      label: "Archive",
      icon: <Eye className="h-4 w-4" />,
      color: "yellow",
      onExecute: async (items) => {
        // API call to archive items
        console.log("Archiving:", items);
      },
    },
  ];

  return (
    <div>
      <BulkActions
        selectedItems={selectedItems}
        onSelectAll={() => setSelectedItems(items)}
        onDeselectAll={() => setSelectedItems([])}
        allSelected={selectedItems.length === items.length}
        actions={bulkActions}
      />
      {/* Your data table/list here */}
    </div>
  );
};
