"use client"

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"
import { LogOut, UserRoundPlus, UserPlus } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"

export function SchoolHeader() {
  const user = useSelector((state: RootState) => state.user)

  const handleLogout = async () => {
    console.log("check -1")
    await signOut({
      callbackUrl: "/auth/login",
      redirect: true,
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Image src="/logo.png" alt="logo" width={60} height={30} />
              <div className="hidden sm:block">
                <h1 className="font-semibold text-lg">Third Wave Coffee</h1>
                <p className="text-xs text-muted-foreground">Excellence Since 1970s</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Search - Hidden on mobile */}
          {/* <div className="relative hidden lg:block">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="w-64 pl-8" />
          </div> */}

          {/* User Management - Hidden on mobile, shown on tablet+ */}
          {
            user.user_code === 1 && <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <UserRoundPlus className="h-4 w-4" />
                    <span className="hidden lg:inline">User</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem>
                    <Link href={`/user`} className="flex w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>User Data</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/user/createUser`} className="flex w-full">
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Add User</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          }


          {/* Notifications - Compact on mobile */}
          {/* <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button> */}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <Link href="/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              {/* Mobile-only items */}
              <div className="md:hidden">
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserRoundPlus className="mr-2 h-4 w-4" />
                  <span>User Management</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Search className="mr-2 h-4 w-4" />
                  <span>Search</span>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header >
  )
}
