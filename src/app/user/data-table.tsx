"use client"

import {  flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, SortingState, ColumnFiltersState, getFilteredRowModel, VisibilityState } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import Link from "next/link";
import { CirclePlus } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile";
// import { useSelector } from "react-redux"
// import { RootState } from "@/store"
// import { checkPermission } from "@/lib/modulePermissions"
// import { MdDeleteForever } from "react-icons/md";
import axios from "axios";
import { toast } from "sonner";
import { UserData, DataTableProps } from "@/types/user/user.type";

export function UserTable<TData extends UserData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    // const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    // const [isFilterApplied, setIsFilterApplied] = useState(false);
    const isMobile = useIsMobile()
    // const user = useSelector((state: RootState) => state.user)
    // const moduleCode = 5 // For "User" module

    // const canAdd = checkPermission(user.userPerrmissions ?? [], moduleCode, "add");
    // const canRead = checkPermission(user.userPerrmissions ?? [], moduleCode, "read");
    // const canDelete = checkPermission(user.userPerrmissions ?? [], moduleCode, "delete");

    const handleDeleteSelected = async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const idsToDelete = selectedRows.map(row => row.original.user_code);

        try {
            const res = await axios.post("/api/user/deleteUser", {
                ids: idsToDelete,
            });
          
            toast.success(res.data.message);
            window.location.reload();
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
    // const anyFilterApplied =
    //     (table.getColumn("title")?.getFilterValue() as string)?.trim().length > 0 ||
    //     categoryFilter.length > 0 ||
    //     sorting.length > 0 ||
    //     Object.keys(columnVisibility).some((key) => columnVisibility[key] === false);

    // const handleResetFilters = () => {
    //     // Reset all filters
    //     table.resetColumnFilters();
    //     setCategoryFilter([]);
    //     table.getColumn("category")?.setFilterValue(undefined);

    //     // Reset column visibility
    //     table.resetColumnVisibility();

    //     // Reset sorting
    //     table.resetSorting();

    //     // Reset pagination
    //     table.resetPagination();
    // }

    // console.log("anyFilterApplied", anyFilterApplied);

    return (
        <div className="flex flex-col h-full justify-between">
            <div>
                <h1 className="text-4xl font-bold flex justify-center mb-4">Users  </h1>
                <div className="flex gap-4">

                    <div className="flex  items-center gap-4 py-4">
                        <Input
                            placeholder="user name title..."
                            value={(table.getColumn("user_name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("user_name")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Columns
                                </Button>
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

                        {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Filter by Category
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            {["men's clothing", "women's clothing", "jewelery", "electronics"].map((category) => (
                                <DropdownMenuCheckboxItem
                                    key={category}
                                    checked={categoryFilter.includes(category)}
                                    onCheckedChange={(checked) => {
                                        const updated = checked
                                            ? [...categoryFilter, category]
                                            : categoryFilter.filter((c) => c !== category);

                                        setCategoryFilter(updated);
                                        table.getColumn("category")?.setFilterValue(updated.length ? updated : undefined);
                                    }}
                                >
                                    {category}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu> */}
                        { (
                            <Link href={`/user/createUser`}>
                                <Button className="curser-pointer flex gap-2">
                                    <CirclePlus /> Add  {!isMobile && 'New User'}
                                </Button>
                            </Link>)}
                        { (
                            <Button
                                variant="destructive"
                                onClick={handleDeleteSelected}
                                disabled={table.getSelectedRowModel().rows.length === 0}
                            >
                                {/* <MdDeleteForever className="h-5 w-5" /> */}
                                {!isMobile && ' Delete User'}
                            </Button>
                        )}
                    </div>

                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
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
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>


            <div className="block md:flex items-center justify-between px-2">
                <div className="hidden md:flex justify-between items-center gap-2">
                    {/* <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div> */}
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
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    )
}
