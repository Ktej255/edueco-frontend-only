"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Download,
    Trash2,
    Edit,
    Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface StandardListPageProps {
    title: string;
    description: string;
    columns: Column[];
    data: any[];
    onAdd?: () => void;
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
    onView?: (item: any) => void;
    actionLabel?: string;
}

export default function StandardListPage({
    title,
    description,
    columns,
    data,
    onAdd,
    onEdit,
    onDelete,
    onView,
    actionLabel = "Add New"
}: StandardListPageProps) {
    const [search, setSearch] = useState("");

    const filteredData = data.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                        <p className="text-gray-400">{description}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-gray-800 text-gray-300">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                        {onAdd && (
                            <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-500">
                                <Plus className="mr-2 h-4 w-4" />
                                {actionLabel}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 items-center bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-gray-900 border-gray-700 text-white"
                        />
                    </div>
                    <Button variant="outline" className="border-gray-700 text-gray-300">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                </div>

                {/* Table */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-800 hover:bg-gray-800/50">
                                {columns.map((col) => (
                                    <TableHead key={col.key} className="text-gray-400 font-medium">
                                        {col.label}
                                    </TableHead>
                                ))}
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.map((row, i) => (
                                    <TableRow key={i} className="border-gray-800 hover:bg-gray-800/50">
                                        {columns.map((col) => (
                                            <TableCell key={col.key} className="text-gray-300">
                                                {col.render ? col.render(row[col.key], row) : row[col.key]}
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                                                    {onView && (
                                                        <DropdownMenuItem onClick={() => onView(row)} className="text-gray-300 focus:text-white focus:bg-gray-800">
                                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                    )}
                                                    {onEdit && (
                                                        <DropdownMenuItem onClick={() => onEdit(row)} className="text-gray-300 focus:text-white focus:bg-gray-800">
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                    )}
                                                    {onDelete && (
                                                        <DropdownMenuItem onClick={() => onDelete(row)} className="text-red-500 focus:text-red-400 focus:bg-red-950/30">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} className="h-24 text-center text-gray-500">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
