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
      <div className="space-y-6">
        <div className="p-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Third Wave Coffee Management System</p>
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
        <div className="grid gap-4 md:grid-cols-2 w-full p-2 m-4">
          {/* Left side */}
          <div>
            {/* <ItemPieChart /> */}
          </div>

          {/* Right side */}
          <div>
            <OutletwiseOrders />
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
