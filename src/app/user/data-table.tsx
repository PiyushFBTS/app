"use client"

import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, type SortingState, type ColumnFiltersState, getFilteredRowModel, type VisibilityState, } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { CirclePlus, Trash2 } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import axios from "axios"
import { toast } from "sonner"
import type { UserData, DataTableProps } from "@/types/user/user.type"

// Role mapping object
const roleMap = {
    "1": "Super Admin",
    "2": "User",
} as const

export function UserTable<TData extends UserData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [categoryFilter, setCategoryFilter] = useState<string[]>([])
    const isMobile = useIsMobile()

    const handleDeleteSelected = async () => {
        const selectedRows = table.getSelectedRowModel().rows
        const idsToDelete = selectedRows.map((row) => row.original.user_code)
        const url = process.env.NEXT_PUBLIC_API_URL
        
        try {
            const res = await axios.post(`${url}api/user-api/user/deleteUser`, {
                ids: idsToDelete,
            });
         
            toast.success(res.data.message)
            window.location.reload()
        } catch (err) {
            console.error("Error deleting selected User", err);
            if (err && typeof err === 'object') {
                const errorObj = err as {
                    response?: { data?: { message?: string } };
                    message?: string;
                };
                if (errorObj.response?.data?.message) {
                    toast.error(errorObj.response.data.message);
                } else if (errorObj.message) {
                    toast.error(errorObj.message);
                } else {
                    toast.error('An error occurred while deleting Store');
                }
            } else {
                toast.error('An error occurred while deleting User');
            }
        }
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
        state: {
            sorting,
            columnFilters,
            columnVisibility
        },
    })
    // Handle role filter changes
    const handleRoleFilterChange = (roleCode: string, checked: boolean) => {
        const updated = checked ? [...categoryFilter, roleCode] : categoryFilter.filter((c) => c !== roleCode)

        setCategoryFilter(updated)

        // Update the table column filter - adjust column name as needed
        table.getColumn("role_code")?.setFilterValue(updated.length ? updated : undefined)
    }

    return (
        <div className="flex flex-col h-full justify-between">
            <div>
                <h1 className="text-4xl font-bold flex justify-center mb-4">Users</h1>
                <div className="flex flex-col md:flex-row my-4 gap-2">
                    <div className="flex flex-row gap-2">
                        <Input
                            placeholder="User name title..."
                            value={(table.getColumn("user_name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn("user_name")?.setFilterValue(event.target.value)}
                            className="max-w-sm"
                        />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Columns</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex flex-row gap-2">
                        {/* Integrated Role Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Filter by role
                                    {categoryFilter.length > 0 && (
                                        <span className="ml-2 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                                            {categoryFilter.length}
                                        </span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                {Object.entries(roleMap).map(([roleCode, roleName]) => (
                                    <DropdownMenuCheckboxItem
                                        key={roleCode}
                                        checked={categoryFilter.includes(roleCode)}
                                        onCheckedChange={(checked) => handleRoleFilterChange(roleCode, checked)}
                                    >
                                        {roleName}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link href={`/user/createUser`}>
                            <Button className="cursor-pointer flex gap-2 bg-green-600 hover:bg-green-300">
                                <CirclePlus />
                            </Button>
                        </Link>

                        <Button
                            // variant="destructive"
                            onClick={handleDeleteSelected}
                            className="bg-red-600 hover:bg-red-300"
                            disabled={table.getSelectedRowModel().rows.length === 0}
                        >
                            <Trash2 />
                        </Button>
                    </div>

                </div>

                {/* Show active filters */}
                {categoryFilter.length > 0 && (
                    <div className="mb-4 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">Active role filters:</p>
                        <div className="flex gap-2 mt-2">
                            {categoryFilter.map((code) => (
                                <span
                                    key={code}
                                    className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground"
                                >
                                    {roleMap[code as keyof typeof roleMap]}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="block md:flex items-center justify-between px-2">
                <div className="hidden md:flex justify-between items-center gap-2">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
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
                </div>
                <div className="flex justify-between items-center gap-2">
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0 bg-transparent"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0 bg-transparent"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
