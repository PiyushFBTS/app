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
import { userFormSchema, type UserFormValues } from "@/schema/user.schema"
import type { Props, Role } from "@/types/user/user.type";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";

export default function UserForm({ initialData, isEditMode = false }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    //   const [companies, setCompanies] = useState<Company[]>([])
    const [roles, setRoles] = useState<Role[]>([])
    const [originalUserCode, setOriginalUserCode] = useState<number | undefined>()
    const router = useRouter()
    //   const user = useSelector((state: RootState) => state.user);

    // Initialize the form with react-hook-form and zod resolver
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: initialData
            ? {
                ...initialData,
            }
            : {
                role_code: 0,
                user_code: 0,
                user_name: "",
                password: "",
                first_name: "",
                last_name: "",

            }

    })



    // Load roles on component mount
    useEffect(() => {
        try {
            axios.get("/api/common/getUserRole").then((rolesRes) => {
                setRoles(rolesRes.data)
                console.log("role",roles);
                
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
            })
        }
    }, [initialData, form])

    // Add this right before the onSubmit function
    const handleFormSubmit = async (data: UserFormValues) => {
        await onSubmit(data)
    }

    // Add validation error logging
    useEffect(() => {
        const subscription = form.watch(() => {
            if (Object.keys(form.formState.errors).length > 0) {
                console.log("Form validation errors:", form.formState.errors);
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
                user_code: isEditMode ? originalUserCode : undefined,
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

            // if (isEditMode) {
                // router.push("/user")
            // } else {
                // form.reset()
                // router.push(`/userRole/addUserRole/${responseData.user_code}`)
            // }
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
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">

                        {/* Role and Username */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="role_code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User Role</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                const roleCode = Number.parseInt(value, 10)
                                                field.onChange(roleCode)
                                                const selectedRole = roles.find((r) => r.role_code === roleCode)
                                                if (selectedRole) {
                                                    form.setValue("role_code", selectedRole.role_code)
                                                }
                                            }}
                                            value={field.value ? field.value.toString() : ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
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
                                        <FormLabel>User code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter User Code" {...field} disabled={isEditMode} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* User name */}
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
                            {/* First_name */}
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
                            {/* Last Name */}
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

                            {/* Password - only show for create mode */}
                            {!isEditMode && (
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter password" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                        </div>
                        <div>
                            {isLoading && (
                                <>
                                    <p className="text-l text-red-600">Please Wait </p>
                                    <p className="text-l text-red-600">UserRole permissions loading ...</p>
                                </>
                            )}
                        </div>

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
