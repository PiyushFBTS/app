"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createUserSchema, editUserSchema, type UserFormValues } from "@/schema/user.schema"
import type { Props, Role } from "@/types/user/user.type"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"


export default function UserForm({ initialData, isEditMode = false }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [roles, setRoles] = useState<Role[]>([])
    const [originalUserCode, setOriginalUserCode] = useState<number | undefined>()
    const router = useRouter()
      const user = useSelector((state: RootState) => state.user)
    // Use different schemas based on mode
    const schema = isEditMode ? editUserSchema : createUserSchema

    // Initialize the form with react-hook-form and zod resolver
    const form = useForm<UserFormValues>({
        resolver: zodResolver(schema),
        defaultValues: initialData
            ? {
                ...initialData,
                password: "",
            }
            : {
                role_code: 0,
                user_code: 0,
                user_name: "",
                password: "",
                first_name: "",
                last_name: "",

            },
    })

    // Load roles on component mount
    useEffect(() => {
        setIsLoading(true)
        try {
            axios.get("/api/common/getUserRole").then((rolesRes) => {
                setRoles(rolesRes.data)
                setIsLoading(false)
            })
        } catch (error) {
            console.error("Error fetching userRole:", error)
            toast.error("Failed to load userRole")
            setIsLoading(false)

        }

    }, [])

    useEffect(() => {
        if (initialData) {
            setOriginalUserCode(initialData.user_code)
            form.reset({
                ...initialData,
                role_code: Number(initialData.role_code) || 0,
                password: "",
            })
        }
    }, [initialData, form])

    // Add validation error logging
    useEffect(() => {
        const subscription = form.watch(() => {
            if (Object.keys(form.formState.errors).length > 0) {
                console.log("Form validation errors:", form.formState.errors)

            }
        });

        return () => subscription.unsubscribe();
    }, [form]);


    const onSubmit = async (data: UserFormValues) => {
        setIsLoading(true)
        try {
            // Prepare data for submission
            const submitData = {
                ...data,
                user_code: isEditMode ? originalUserCode : data.user_code,
            }

            // Remove password field if empty in edit mode
            if (isEditMode && (!submitData.password || submitData.password === "")) {
                delete submitData.password
            }

            const endpoint = isEditMode ? `/api/user/updateUser` : "/api/user/createUser"
            const method = isEditMode ? "PUT" : "POST"

            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            })

            const responseData = await response.json()

            if (!response.ok) {
                throw new Error(responseData.error || "Failed to save user")
            }

            toast.success(isEditMode ? "User updated successfully!" : "User created successfully!")
            router.push("/user")

        } catch (error) {
            console.error("Form submission error:", error)
            toast.error("Failed to save user")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="max-w-2xl mx-auto my-10">
            <CardHeader>
                <CardTitle className="text-4xl">{isEditMode ? "Edit User" : "Create New User"}</CardTitle>
                <CardDescription>
                    {isEditMode
                        ? "Update the details of an existing user"
                        : "Add a new user to the system with appropriate role and permissions."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Role and User Code */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="role_code"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>User Role</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                const roleCode = Number.parseInt(value, 10)
                                                field.onChange(roleCode)
                                            }}
                                            disabled={user.role_code === 1 && !isEditMode}
                                            value={field.value ? field.value.toString() : ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.role_code} value={role.role_code.toString()}>
                                                        {role.role_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="user_code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter user code"
                                                disabled={isEditMode}
                                                className={isEditMode ? "bg-muted" : ""}
                                                type="number"

                                                {...field}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                    field.onChange(value === "" ? 0 : Number(value))
                                                }}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Username and First Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="user_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter First Name" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Last Name and Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Last Name" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {!isEditMode && <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={"Enter password"}
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />}

                        </div>

                        {isLoading && (
                            <div>
                                <p className="text-l text-green-500">Please Wait</p>
                                <p className="text-l text-green-500">User add ...</p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4">
                            <Button variant="outline" asChild>
                                <Link href="/user">Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : isEditMode ? "Update User" : "Create User"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
