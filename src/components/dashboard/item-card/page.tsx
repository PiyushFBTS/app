import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, FileText, Package, CircleX, CircleDollarSign } from "lucide-react"

const itemData = [
    {
        id: 1,
        title: 'Total Orders',
        number: 75,
        icon: <FileText className="w-6 h-6 text-green-600" />
    },
    {
        id: 2,
        title: 'Total Delivered',
        number: 575,
        icon: <Package className="w-6 h-6 text-green-600" />
    },
    {
        id: 3,
        title: 'Total Canceled',
        number: 24,
        icon: <CircleX className="w-6 h-6 text-green-600" />
    },
    {
        id: 4,
        title: 'Total Revenue',
        number: 575,
        icon: <CircleDollarSign className="w-6 h-6 text-green-600" />
    },
]

function ItemCard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
            {itemData.map((data, index) => {
                return (
                    <div key={data.id} className="w-full">
                        <Card className="p-6 bg-white shadow-sm border border-gray-100 h-full">
                            <CardContent className="p-0">
                                <div className="flex items-start justify-between">
                                    {/* Icon Section */}
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            {data.icon}
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 ml-4">
                                        {/* Main Number */}
                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                            {data.number}
                                        </div>

                                        {/* Title */}
                                        <div className="text-gray-600 font-medium mb-3">
                                            {data.title}
                                        </div>

                                        {/* Statistics */}
                                        <div className="flex items-center text-sm">
                                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                            <span className="text-green-500 font-medium">4%</span>
                                            <span className="text-gray-500 ml-1">(30 days)</span>
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