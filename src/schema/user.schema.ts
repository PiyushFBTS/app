import * as z from "zod"

export const userFormSchema = z.object({
    role_code: z.number().min(1, "Role Code is required"),
    user_code: z.number().min(1, "User Code is required"),
    user_name: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last Name is required"),
})

export type UserFormValues = z.infer<typeof userFormSchema>
