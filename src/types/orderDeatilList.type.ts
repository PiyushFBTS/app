import { ColumnDef } from "@tanstack/react-table";



export type Props = {
  initialData?: OrderDeatilList
  isEditMode?: boolean
}

export interface DataTableProps<TData extends OrderDeatilList, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// export type GstGroupData = {
//   gst_group_code: string;
//   gst_percentage: number;
// };
export type OrderDeatilList = {
    landed: string
    status: string
    app_uid: number
    channel: string
    discount: number
    order_id: number
    store_id: string
    order_type: string
    store_name: string
    order_total: number
    tot_charges: number
    date_created: string
    del_datetime: null
    customer_name: string
    order_tot_tax: number
    customer_email: string
    customer_phone: string
    fetched_at_pos: string
    exp_pickup_time: string
    ext_platform_id: number
    processed_at_pos: string
    order_payable_amt: number
    pos_processed_time: null
    fetched_by_pos_time: null
}