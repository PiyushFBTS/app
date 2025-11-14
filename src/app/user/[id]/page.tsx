"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { checkPermission } from "@/lib/modulePermissions"
// import { useSelector } from "react-redux"
// import { RootState } from "@/store"
import { UserData } from "@/types/user/user.type"

export default function UserDetail() {
  const { id } = useParams()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // const user = useSelector((state: RootState) => state.user)
  // const moduleCode = 5 // For "user" module
  // const canUpdate = checkPermission(user.userPerrmissions ?? [], moduleCode, "update");


  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      const url = process.env.NEXT_PUBLIC_API_URL\
      try {
        setIsLoading(true)
        const response = await axios.get(`${url}/api/user/${id}`)
        setUserData(response.data)
      } catch (error) {
        console.error("Error fetching store", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [id])

  if (isLoading) return <p className="p-4 text-center text-gray-500">Loading...</p>
  if (!userData) return <p className="p-4 text-center text-gray-500">User not found</p>


  // Define field groups
  const generalFields: { key: keyof UserData; label: string }[] = [
    { key: "role_code", label: "Role Code" },
    { key: "user_code", label: "User Code" },
    { key: "user_name", label: "User Name" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "created_by_user", label: "Created By" },
    { key: "created_on_date", label: "Created on" },
  ]

  const renderField = (field: { key: keyof UserData; label: string }) => {
    let value = userData[field.key];
    if (value === undefined || value === null || value === "") return null;

    // Format date fields
    if (field.key === "created_on_date") {
      try {
        const date = new Date(value);
        value = date.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
      } catch (error) {
        console.warn(`Invalid date format for ${field.key}:`, value);
      }
    }

    return (
      <div key={field.key} className="mb-4">
        <p className="text-sm font-medium text-gray-500">{field.label}</p>
        <p className="text-lg font-semibold">{String(value)}</p>
      </div>
    );
  };

  const renderSection = (title: string, fields: { key: keyof UserData; label: string }[]) => (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-gray-700">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{fields.map((field) => renderField(field))}</div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex items-center justify-between ">
        <h1 className="text-3xl font-semibold text-gray-800">User Details</h1>

        {(
          <Button className="bg-black hover:bg-gray-800 text-white cursor-pointer">
            <Link href={`/user/createUser/${id}`}>
              Edit User
            </Link>
          </Button>
        )}
      </div>

      {renderSection("General Information", generalFields)}
    </div>
  )
}
