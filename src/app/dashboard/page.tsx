"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import ItemCard from "@/components/dashboard/item-card/page"
import { ItemPieChart } from "@/components/dashboard/item-pie-chart/page"
import { OutletwiseOrders } from "@/components/dashboard/OutletwiseOrders/page"

function Dashboard() {
  const user = useSelector((state: RootState) => state.user)

  return (
    <>
      <div className="space-y-2">
        <div className="p-4">
          <h1 className="text-2xl font-bold tracking-tight">Welcome to Third Wave Coffee Management System</h1>
        </div>

        {/* Display user information */}
        <div className="bg-card m-4 p-4 rounded-lg border">
          <div className="space-y-1">
            <p>
              <strong> Hello ,</strong> {user.first_name} {user.last_name}
            </p>
          </div>
        </div>
        <div>
          <ItemCard />
        </div>
        <div className="grid gap-4 md:grid-cols-2 m-4">
         <div className="flex justify-center items-center p-4 rounded-lg border w-full h-full">
          <h1 className="">Sample Data</h1>
         </div>
            <OutletwiseOrders />
          
        </div>
      </div>
    </>
  )
}

export default Dashboard
