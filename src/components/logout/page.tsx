"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/auth/login",
      redirect: true,
    })
  }

  return (
    <Button onClick={handleLogout} variant="ghost" size="sm" className={className}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  )
}
