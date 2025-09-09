'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Package, CheckCircle } from "lucide-react"
import axios from 'axios';
import { OrderTotal, POSFetchedOrdersType, POSDeliveredOrdersType } from "@/types/dashboard.type"
import { useRouter } from "next/navigation";

function ItemCard() {
    const [orderDetail, setOrderDetail] = useState<OrderTotal[]>([])
    const [POSFetchedOrders, setPOSFetchedOrders] = useState<POSFetchedOrdersType[]>([])
    const [POSDeliveredOrders, setPOSDeliveredOrders] = useState<POSDeliveredOrdersType[]>([])
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("api/dashboard/cards/NoOfOrders")
                setOrderDetail(res.data)
            } catch (error) {
                console.error('Error fetching order details:', error)
            }
        }

        const fetchPOSFetchedOrders = async () => {
            try {
                const res = await axios.get("api/dashboard/cards/POSFetchedOrders")
                setPOSFetchedOrders(res.data)
            } catch (error) {
                console.error('Error fetching POS fetched orders:', error)
            }
        }

        const fetchPOSDeliveredOrders = async () => {
            try {
                // Fixed: Changed endpoint to POSDeliveredOrders instead of POSFetchedOrders
                const res = await axios.get("api/dashboard/cards/POSDeliveredOrders")
                setPOSDeliveredOrders(res.data)
            } catch (error) {
                console.error('Error fetching POS delivered orders:', error)
            }
        }

        fetchData()
        fetchPOSFetchedOrders()
        fetchPOSDeliveredOrders()
    }, [])

    // Helper function to get appropriate icon based on card title
    const getCardIcon = (title: string) => {
        if (title.toLowerCase().includes('delivered')) {
            return <CheckCircle className="w-6 h-6 text-indigo-500" />
        } else if (title.toLowerCase().includes('fetched') || title.toLowerCase().includes('orders')) {
            return <FileText className="w-6 h-6 text-indigo-500" />
        } else {
            return <Package className="w-6 h-6 text-indigo-500" />
        }
    }

    // Combine all card data into one array
    const allCards = [
        ...orderDetail,
        ...POSFetchedOrders,
        ...POSDeliveredOrders
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
            {allCards.map((data, index) => {
                return (
                    <div key={index} className="w-full">
                        <Card
                            className={`p-6 bg-white shadow-md border border-gray-200 h-full rounded-2xl hover:shadow-xl transition-all duration-300 hover:bg-indigo-50 ${
                                data.col1 === "Todays Orders" ? "cursor-pointer" : ""
                            }`}
                            onClick={data.col1 === "Todays Orders" ? () => router.push("/orderlist") : undefined}
                        >
                            <CardContent className="p-0">
                                <div className="flex items-start justify-between">
                                    {/* Icon Section */}
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            {getCardIcon(data.col1)}
                                        </div>
                                    </div>
                                    <div className="flex-1 ml-4">
                                        {/* Main Number */}
                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                            {data.col2}
                                        </div>

                                        {/* Title */}
                                        <div className="text-gray-600 font-medium mb-3">
                                            {data.col1}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )
            })}
        </div>
    )
}

export default ItemCard