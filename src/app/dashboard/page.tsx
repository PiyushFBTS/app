"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import ItemCard from "@/components/dashboard/item-card/page"
import { OutletwiseOrders } from "@/components/dashboard/OutletwiseOrders/page"
import QuantityPieData from "@/components/dashboard/Quantity-pie/page";
import AmountBarChart from "@/components/dashboard/Amount-bar-chart/page";


function Dashboard() {

  return (
    <>

      <ItemCard />

      <div className="grid gap-4 xl:grid-cols-2 m-4">
        <QuantityPieData />
        <OutletwiseOrders />
      </div>
      <div className="grid gap-4 mb-20 mx-4 ">
        <AmountBarChart />
      </div>
    </>
  )
}

export default Dashboard
