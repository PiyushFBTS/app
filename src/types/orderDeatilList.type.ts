import { ColumnDef } from "@tanstack/react-table";



export type Props = {
  initialData?: OrderDeatilList
  isEditMode?: boolean
}

export interface DataTableProps<TData extends OrderDeatilList, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
export interface OrderItem {
    item_name: string;
    item_merchant_id: string;
    item_quantity: number;
    item_price: number;
    item_discount: number;
    item_total: number;
    item_total_with_tax: number;
    cgst_rate: number;
    cgst_amount: number;
    cgst_title: string;
    sgst_rate: number;
    sgst_amount: number;
    sgst_title: string;
    items_options_to_add_group_is_variant: number;
    indent: number;
    line_no: number;
    parent_line_no: number | null;
}

export interface OrderType {
    order_id: string;
    order_type: string;
    status: string;
    channel: string;
    date_created: string;
    del_datetime: string;
    store_id: string;
    store_name: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    app_uid: string;
    order_total: number;
    order_tot_tax: number;
    discount: number;
    tot_charges: number;
    order_payable_amt: number;
    fetched_at_pos: string;
    processed_at_pos: string;
    fetched_by_pos_time: string;
    pos_processed_time: string;
    exp_pickup_time: string;
    ext_platform_id: string;
    landed: string;
    items: OrderItem[];
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
  items?: OrderItem[]
}