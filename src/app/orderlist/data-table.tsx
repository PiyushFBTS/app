"use client"

import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, SortingState, ColumnFiltersState, getFilteredRowModel, VisibilityState } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X, Filter, Download, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile";
import { OrderDeatilList, DataTableProps } from "@/types/orderDeatilList.type";
import { Search } from "lucide-react"

export function OrderDetailTable<TData extends OrderDeatilList, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const isMobile = useIsMobile();

    // Custom global filter function for multiple columns
    const globalFilterFn = (row: any, columnId: string, value: string) => {
        const searchableColumns = ["store_name", "order_id", "order_type"];
        const searchValue = value.toLowerCase();

        return searchableColumns.some(column => {
            const cellValue = row.getValue(column);
            return cellValue?.toString().toLowerCase().includes(searchValue);
        });
    };

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: globalFilterFn,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter,
        },
    })

    return (
        <div className="flex flex-col h-full justify-between min-h-[calc(100vh-120px)] gap-6 pb-6  md:pb-0">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex flex-row justify-between">

                    <h1 className="text-xl md:text-4xl font-bold content-center">Order Details</h1>

                    <div className="flex gap-3">
                        <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer" onClick={() => window.location.reload()}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            {!isMobile && 'Refresh'}
                        </Button>

                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Search Section */}
                    <div className="flex items-center space-x-3 flex-1 max-w-md">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                placeholder="Search orders, stores, or types..."
                                value={globalFilter ?? ""}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="pl-10 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                            />
                        </div>
                        {globalFilter && (
                            <Button
                                variant="ghost"
                                onClick={() => setGlobalFilter("")}
                                className="h-10 px-3 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Column Controls */}
                    <div className="flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-lg">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column, key) => (
                                        <DropdownMenuCheckboxItem
                                            key={key}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id.replace(/_/g, ' ')}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="border-b border-gray-200">
                                    {headerGroup.headers.map((header, key) => {
                                        return (
                                            <TableHead key={key} className="font-semibold text-gray-700 py-4 px-6">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {(table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row, key) => (
                                    <TableRow
                                        key={key}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                                    >
                                        {row.getVisibleCells().map((cell, key) => (
                                            <TableCell key={key} className="py-4 px-6">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <Search className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <p className="text-lg font-medium">No orders found</p>
                                            <p className="text-sm">Try adjusting your search criteria</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6 md:w-auto w-full">
                        <div className="flex items-center space-x-2 md:w-auto md:justify-start w-full justify-between">
                            <p className="text-sm font-medium text-gray-700">Rows per page</p>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger className="h-9 w-20 border-gray-300 rounded-lg">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="text-sm text-gray-600 hidden md:flex">
                            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                            {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of{" "}
                            {table.getFilteredRowModel().rows.length} entries
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:w-auto md:justify-start w-full justify-between">
                        <div className="flex items-center justify-center text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </div>

                        <div className="flex items-center space-x-1">
                            <Button
                                variant="outline"
                                className="h-9 w-9 p-0 hidden lg:flex border-gray-300 hover:bg-gray-50 rounded-lg"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-9 w-9 p-0 border-gray-300 hover:bg-gray-50 rounded-lg"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-9 w-9 p-0 border-gray-300 hover:bg-gray-50 rounded-lg"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-9 w-9 p-0 hidden lg:flex border-gray-300 hover:bg-gray-50 rounded-lg"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}