import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from '../../components/useTranslation';

interface Props {
    godowns: { id: number; name: string }[];
    categories: { id: number; name: string }[];
    items: { id: number; item_name: string }[]; // 👈 include this in props
}

export default function StockSummaryFilter({ godowns, categories, items }: Props) {
    const t = useTranslation();
    const today = dayjs().format('YYYY-MM-DD');
    const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');

    const tabs = [
        { name: t('stockDetailTab'), route: 'reports.stock-summary' },
        { name: t('categoryWiseStockTab'), route: 'reports.stock-summary.category-wise' },
        { name: t('itemWiseStockTab'), route: 'reports.stock-summary.item-wise' },
    ];

    const [activeTab, setActiveTab] = useState<string>(tabs[0].route);

    const { data, setData, get, processing, errors } = useForm({
        from: today, // 👈 auto-filled
        to: today, // 👈 auto-filled
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
            <Head title={t('stockReportTitle')} />

            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg">
                    <PageHeader title={t('stockReportFilterTitle')} />

                    {/* Tabs for different report types */}
                    <Card>
                        <CardHeader className="bg-background border-b px-6 py-4">
                            {/* <h2 className="text-2xl font-semibold">Generate Stock Report</h2> */}
                            {/* <nav className="mt-4 border-b border-gray-200"> */}
                            <nav className="border-background/20 border-b">
                                <ul className="-mb-px flex space-x-4">
                                    {tabs.map((tab, idx) => (
                                        <li key={idx}>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab(tab.route)}
                                                className={`inline-block px-3 py-2 text-sm font-medium focus:outline-none ${
                                                    activeTab === tab.route
                                                        ? 'border-b-2 border-blue-500 text-blue-600'
                                                        : 'text-forground hover:text-blue-600'
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
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* From Date */}
                                    <div>
                                        <InputCalendar value={data.from} onChange={(val) => setData('from', val)} label="From Date" required />
                                        {errors.from && <p className="text-sm text-red-500">{errors.from}</p>}
                                    </div>

                                    {/* To Date */}
                                    <div>
                                        <InputCalendar value={data.to} onChange={(val) => setData('to', val)} label="To Date" required />
                                        {errors.to && <p className="text-sm text-red-500">{errors.to}</p>}
                                    </div>

                                    {/* Godown Dropdown */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{t('stockSelectGodownOptional')}</label>
                                        <select
                                            className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                            value={data.godown_id}
                                            onChange={(e) => setData('godown_id', e.target.value)}
                                        >
                                            <option value="">{t('stockAllGodownsOption')}</option>
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
                                            <label className="block text-sm font-medium text-gray-700">{t('stockSelectCategoryLabel')}</label>
                                            <select
                                                className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                                value={data.category_id}
                                                onChange={(e) => setData('category_id', e.target.value)}
                                            >
                                                <option value="">{t('stockAllCategoriesOption')}</option>
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
                                            <label className="block text-sm font-medium text-gray-700">{t('stockSelectItemLabel')}</label>
                                            <select
                                                className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                                value={data.item_id}
                                                onChange={(e) => setData('item_id', e.target.value)}
                                            >
                                                <option value="">{t('stockAllItemsOption')}</option>
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
                                        {t('stockViewReportText')}
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
