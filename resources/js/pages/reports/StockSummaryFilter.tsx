import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { useForm, usePage } from '@inertiajs/react';
import PageHeader from '@/components/PageHeader';
import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';

interface Props {
    godowns: { id: number; name: string }[];
    categories: { id: number; name: string }[];
    items: { id: number; item_name: string }[]; // 👈 include this in props
}

const tabs = [
    { name: 'Stock Detail', route: 'reports.stock-summary' },
    { name: 'Category Wise Stock Summary', route: 'reports.stock-summary.category-wise' },
    { name: 'Item Wise Stock Summary', route: 'reports.stock-summary.item-wise' }, // 👈 added
];

export default function StockSummaryFilter({ godowns, categories, items }: Props) {
    const [activeTab, setActiveTab] = useState<string>(tabs[0].route);

    const { data, setData, get, processing, errors } = useForm({
        from: '',
        to: '',
        godown_id: '',
        category_id: '',
        item_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route(activeTab), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Stock Report" />

            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">
                    <PageHeader title="Stock Report Filter" />

                    {/* Tabs for different report types */}
                    <Card>
                        <CardHeader className="border-b bg-gray-50 px-6 py-4">
                            {/* <h2 className="text-2xl font-semibold">Generate Stock Report</h2> */}
                            {/* <nav className="mt-4 border-b border-gray-200"> */}
                            <nav className="border-b border-gray-200">
                                <ul className="-mb-px flex space-x-4">
                                    {tabs.map((tab, idx) => (
                                        <li key={idx}>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab(tab.route)}
                                                className={`inline-block px-3 py-2 text-sm font-medium focus:outline-none ${activeTab === tab.route
                                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                                    : 'text-gray-500 hover:text-blue-600'
                                                    }`}
                                            >
                                                {tab.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </CardHeader>

                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    {/* From Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            From Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                            value={data.from}
                                            onChange={(e) => setData('from', e.target.value)}
                                            required
                                        />
                                        {errors.from && <p className="text-sm text-red-500">{errors.from}</p>}
                                    </div>

                                    {/* To Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            To Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                            value={data.to}
                                            onChange={(e) => setData('to', e.target.value)}
                                            required
                                        />
                                        {errors.to && <p className="text-sm text-red-500">{errors.to}</p>}
                                    </div>

                                    {/* Godown Dropdown */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Select Godown <span className="text-gray-400">(Optional)</span>
                                        </label>
                                        <select
                                            className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                            value={data.godown_id}
                                            onChange={(e) => setData('godown_id', e.target.value)}
                                        >
                                            <option value="">— All Godowns —</option>
                                            {godowns.map((g) => (
                                                <option key={g.id} value={g.id}>
                                                    {g.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Conditionally show Category dropdown */}
                                    {activeTab === 'reports.stock-summary.category-wise' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Select Category <span className="text-gray-400">(Optional)</span>
                                            </label>
                                            <select
                                                className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                                value={data.category_id}
                                                onChange={(e) => setData('category_id', e.target.value)}
                                            >
                                                <option value="">— All Categories —</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Conditionally show Item dropdown */}
                                    {activeTab === 'reports.stock-summary.item-wise' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Select Item <span className="text-gray-400">(Optional)</span>
                                            </label>
                                            <select
                                                className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                                value={data.item_id}
                                                onChange={(e) => setData('item_id', e.target.value)}
                                            >
                                                <option value="">— All Items —</option>
                                                {items.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.item_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button type="submit" disabled={processing}>
                                        View Report
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
