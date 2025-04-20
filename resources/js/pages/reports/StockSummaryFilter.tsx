import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const tabs = [
    { name: 'Stock Detail', route: 'reports.stock-summary' },
    { name: 'Category Wise Stock Summary', route: 'reports.stock-summary' },
    { name: 'Godown Wise Stock Summary', route: 'reports.stock-summary' },
    { name: 'Item Wise Stock Summary', route: 'reports.stock-summary' },
];


export default function StockSummaryFilter({ godowns }: { godowns: { id: number; name: string }[] }) {
    const { data, setData, get, processing, errors } = useForm({
        from: '',
        to: '',
        godown_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('reports.stock-summary'), { preserveScroll: true });
    };

    return (
        <AppLayout title="Stock Report Filter">
            <div className="max-w-6xl mx-auto p-4">
                <Card className="shadow-xl">
                    <CardHeader className="px-6 py-4 bg-gray-50 border-b">
                        <h2 className="text-2xl font-semibold">Generate Stock Report</h2>
                        <nav className="mt-4 border-b border-gray-200">
                            <ul className="flex space-x-4 -mb-px">
                                {tabs.map((tab, idx) => (
                                    <li key={idx}>
                                        <Link
                                            href={route(tab.route)}
                                            className={`inline-block px-3 py-2 text-sm font-medium ${
                                                tab.name === 'Stock Detail'
                                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                                    : 'text-gray-500 hover:text-blue-600'
                                            }`}
                                        >
                                            {tab.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        From Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={data.from}
                                        onChange={e => setData('from', e.target.value)}
                                        required
                                    />
                                    {errors.from && (
                                        <p className="text-red-500 text-sm">{errors.from}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        To Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={data.to}
                                        onChange={e => setData('to', e.target.value)}
                                        required
                                    />
                                    {errors.to && (
                                        <p className="text-red-500 text-sm">{errors.to}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Select Godown <span className="text-gray-400">(Optional)</span>
                                    </label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={data.godown_id}
                                        onChange={e => setData('godown_id', e.target.value)}
                                    >
                                        <option value="">— All Godowns —</option>
                                        {godowns.map(g => (
                                            <option key={g.id} value={g.id}>
                                                {g.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
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
        </AppLayout>
    );
}
