import { userFormSchema } from "@/schema/user.schema";
import { ColumnDef } from "@tanstack/react-table";
import * as z from "zod"

export type UserFormValues = z.infer<typeof userFormSchema>

export type Props = {
  initialData?: UserData
  isEditMode?: boolean
}
export type Role = {
  role_code: number;
  role_name: string;
};

export interface DataTableProps<TData extends UserData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export type UserData = {
    role_code: number,
    user_code: number,
    user_name: string,
    password: string,
    first_name: string,
    last_name:string,
    created_by_user?:string,
    created_on_date?:string,
}