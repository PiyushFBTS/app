"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react"
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { UserData } from "@/types/user/user.type";


export const columns: ColumnDef<UserData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "role_code",
    header: ({ column }) => {
      return (
        <div className="text-left flex items-center space-x-2">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

      )
    },
    cell: ({ row }) => {
      const value = row.original.role_code === 1 ? "Super Admin" : "User"
      return <div className="text-left pl-4">{value} </div>
    }
  },
  {
    accessorKey: "user_code",
    header: ({ column }) => {
      return (
        <div className="text-left flex items-center space-x-2">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
            User Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

      )
    },
    cell: ({ row }) => {
      return <div className="text-left pl-4">{row.original.user_code} </div>
    }
  },
  {
    accessorKey: "user_name",
    header: () => <div className="text-left">UserName</div>,
    cell: ({ row }) => {
      const value = row.original.user_name;
      const id = row.original.user_code;
      return (
        <div className="text-left">
          <Link href={`/user/${id}`} className="text-blue-600 hover:underline">
            {value}
          </Link>
        </div>
      );
    }
  },
  {
    accessorKey: "first_name",
    header: () => <div className="text-left">First Name</div>,
    cell: ({ row }) => {
      return <div className="text-left">{row.original.first_name} </div>
    }
  }
]
