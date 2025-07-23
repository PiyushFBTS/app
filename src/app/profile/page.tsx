"use client"

import React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SquarePen } from "lucide-react"
function Profile() {
    const user = useSelector((state: RootState) => state.user)

    return (
        <div className="max-w-md w-full mx-auto mt-6 px-4 sm:px-6 lg:px-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center text-xl sm:text-2xl font-semibold">
                        User Profile
                    </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-4 pt-4">
                    <div className="flex justify-between">
                        <div className="text-sm sm:text-base">
                            <p>
                                <span className="font-medium">Name:</span>{" "}
                                {user.first_name} {user.last_name}
                            </p>
                            <p>
                                <span className="font-medium">Username:</span>{" "}
                                {user.user_name}
                            </p>
                            <p>
                                <span className="font-medium">User Code:</span>{" "}
                                {user.user_code}
                            </p>
                            <p>
                                <span className="font-medium">Role Code:</span>{" "}
                                {user.role_code}
                            </p>
                        </div>
                        <div>
                            <Button className="bg-black hover:bg-gray-800 text-white cursor-pointer">
                                <Link href={`/user/createUser/${user.user_code}`}>
                                    <SquarePen />
                                </Link>
                            </Button>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}

export default Profile
