'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Package, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

//type for your card data
interface CardData {
  col1: string
  col2: string
}

// Skeleton Card Component
function CardSkeleton() {
  return (
    <Card className="p-6 bg-white shadow-md border border-gray-200 h-full rounded-2xl">
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 ml-4 space-y-3">
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Chart Skeleton Components
export function ChartSkeleton({ height = "h-80" }: { height?: string }) {
  return (
    <Card className="p-6 bg-white shadow-md border border-gray-200 rounded-2xl">
      <CardContent className="p-0 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className={`${height} bg-gray-100 rounded animate-pulse`}></div>
      </CardContent>
    </Card>
  )
}

function ItemCard() {
  const [orderDetail, setOrderDetail] = useState<CardData[]>([])
  const [POSFetchedOrders, setPOSFetchedOrders] = useState<CardData[]>([])
  const [POSDeliveredOrders, setPOSDeliveredOrders] = useState<CardData[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      const url = process.env.NEXT_PUBLIC_API_URL

      try {
        const [ordersRes, fetchedRes, deliveredRes] = await Promise.all([
          fetch(`${url}/api/dashboard/noOfOrders`).then(r => r.json()),
          fetch(`${url}/api/dashboard/posFetchedOrders`).then(r => r.json()),
          fetch(`${url}/api/dashboard/posDeliveredOrders`).then(r => r.json())
        ])
        console.log("noOfOrders", `${url}/api/dashboard/noOfOrders`);
        console.log("posFetchedOrders", `${url}/api/dashboard/posFetchedOrders`);
        console.log("posDeliveredOrders", `${url}/api/dashboard/posDeliveredOrders`);



        setOrderDetail(ordersRes)
        setPOSFetchedOrders(fetchedRes)
        setPOSDeliveredOrders(deliveredRes)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  const getCardIcon = (title: string) => {
    if (title.toLowerCase().includes('delivered')) {
      return <CheckCircle className="w-6 h-6 text-indigo-500" />
    } else if (title.toLowerCase().includes('fetched') || title.toLowerCase().includes('orders')) {
      return <FileText className="w-6 h-6 text-indigo-500" />
    } else {
      return <Package className="w-6 h-6 text-indigo-500" />
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 m-4">
        {[...Array(4)].map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    )
  }

  const allCards = [
    ...orderDetail,
    ...POSFetchedOrders,
    ...POSDeliveredOrders
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 m-4">
      {allCards.map((data, index) => (
        <div key={index} className="w-full">
          <Card
            className={`p-6 bg-white shadow-md border border-gray-200 h-full rounded-2xl hover:shadow-xl transition-all duration-300 hover:bg-indigo-50 ${data.col1 === "Todays Orders" ? "cursor-pointer" : ""
              }`}
            onClick={data.col1 === "Todays Orders" ? () => router.push("/orderlist") : undefined}
          >
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    {getCardIcon(data.col1)}
                  </div>
                </div>
                <div className="flex-1 ml-4">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {data.col2}
                  </div>
                  <div className="text-gray-600 font-medium mb-3">
                    {data.col1}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

export default ItemCard
