"use client"

import CreateUserForm from "@/components/form/User/page"
// import RoleGuard from "@/components/roleGuardts/page"

export default function CreateUserPage() {
  return (
    // <RoleGuard allowedRoles={["Super Admin", "Admin"]}>
      <div className="container py-10">
        <h1 className="flex justify-center text-2xl font-bold mb-6">User Management</h1>
        <CreateUserForm />
      </div>
    // </RoleGuard>
  )
}

