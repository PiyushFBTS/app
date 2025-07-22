"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/store"

function Dashboard() {
  const user = useSelector((state: RootState) => state.user)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Third Wave Coffee Management System</p>
      </div>

      {/* Display user information */}
      <div className="bg-card p-4 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">User Information</h2>
        <div className="space-y-1">
          <p>
            <strong>Name:</strong> {user.first_name} {user.last_name}
          </p>
          <p>
            <strong>Username:</strong> {user.user_name}
          </p>
          <p>
            <strong>User Code:</strong> {user.user_code}
          </p>
          <p>
            <strong>Role Code:</strong> {user.role_code}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
