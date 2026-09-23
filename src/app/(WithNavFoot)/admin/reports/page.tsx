'use client'

import idr from '@/lib/helper'
import { useEffect, useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts'

export default function ReportsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const fetchData = async () => {
        try {
            setLoading(true)

            const params = new URLSearchParams()

            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)

            const res = await fetch(`/api/admin/reports?${params.toString()}`, {
                cache: 'no-store',
            })

            const result = await res.json()
            setData(result)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex text-lg font-semibold justify-center py-20">
                Loading report...
            </div>
        )
    }

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Sales Reports
                    </h1>

                    <div className="flex flex-col mt-2 gap-4">
                        <p className="text-gray-500">
                            Overview of your sales performance
                        </p>
                        {/* FILTER */}
                        <div className="flex flex-col md:flex-row md:items-end gap-4 mt-6">
                            {/* START DATE */}
                            <div className="flex flex-col w-40">
                                <label className="text-xs font-semibold mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
                                />
                            </div>

                            {/* END DATE */}
                            <div className="flex flex-col w-40">
                                <label className="text-xs font-semibold mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
                                />
                            </div>

                            {/* BUTTON */}
                            <div className="w-full md:w-auto">
                                <button
                                    onClick={fetchData}
                                    className="w-full md:w-auto bg-pink-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-pink-500 transition-all duration-200 shadow-sm cursor-pointer"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-6 mb-6 text-center">
                    <Card title="Total Orders" value={data.totalOrders} />
                    <Card title="Revenue" value={idr(data.revenue)} />
                </div>

                {/* CHART */}
                <div className="bg-white p-6 rounded-2xl shadow mb-6">
                    <h2 className="mb-8 text-xl font-semibold">Sales Overview</h2>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.salesData} margin={{ left: 15 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="total" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* TOP PRODUCTS */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h2 className="mb-4 text-xl font-semibold">Top Selling Products</h2>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 text-left">Product</th>
                                <th className='text-center'>Sold</th>
                                <th className='text-right'>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.topProducts.map((p: any, i: number) => (
                                <tr key={i} className="border-b">
                                    <td className="py-2 text-left">{p.name}</td>
                                    <td className='text-center'>{p.sold}</td>
                                    <td className='text-right'>{idr(p.revenue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

/* CARD */
function Card({ title, value }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-sm text-gray-500">{title}</h2>
            <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
    )
}
