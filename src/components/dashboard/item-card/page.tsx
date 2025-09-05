import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, FileText, Package, CircleX, CircleDollarSign } from "lucide-react"
import axios from 'axios';
import { OrderTotal } from "@/types/dashboard.type"



function ItemCard() {
    const [orderDetail, setOrderDetail] = useState<OrderTotal[]>([])


    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get("api/dashboard/NoOfOrders")
            setOrderDetail(res.data)
        }
        fetchData()
    }, [])
console.log("orderDetail",orderDetail);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
            {orderDetail.map((data, index) => {
                return (
                    <div key={index} className="w-full">
                        <Card className="p-6 bg-white shadow-md border border-gray-200 h-full rounded-2xl hover:shadow-xl transition-all duration-300 hover:bg-indigo-50">

                            <CardContent className="p-0">
                                <div className="flex items-start justify-between">
                                    {/* Icon Section */}
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            {data.col1 === 'Todays Orders' ? <FileText className="w-6 h-6 text-indigo-500" /> : <Package className="w-6 h-6 text-indigo-500" />}
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