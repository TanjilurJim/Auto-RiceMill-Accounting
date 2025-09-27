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
    tab: 'category' | 'item' | 'party' | 'godown' | 'salesman' | 'all';
    categories: { id: number; name: string }[];
    items: { id: number; item_name: string }[];
    parties: { id: number; name: string }[];
    godowns: { id: number; name: string }[];
    salesmen: { id: number; name: string }[];
}

export default function SaleReportFilter({ tab, categories, items, parties, godowns, salesmen }: Props) {
    const t = useTranslation();
    const today = dayjs().format('YYYY-MM-DD');

    const tabs = [
        { key: 'category', label: t('saleCategoryWiseTab') },
        { key: 'item', label: t('saleItemWiseTab') },
        { key: 'party', label: t('salePartyWiseTab') },
        { key: 'godown', label: t('saleGodownWiseTab') },
        { key: 'salesman', label: t('saleSalesmanWiseTab') },
        { key: 'all', label: t('saleAllSalesProfitLossTab') },
        { key: 'return', label: t('saleReturnsTab') },
    ];

    const [activeTab, setActiveTab] = useState(tab ?? 'category');

    const { data, setData, get, processing, errors } = useForm({
        from_date: today,
        to_date: today,
        category_id: '',
        item_id: '',
        party_id: '',
        godown_id: '',
        salesman_id: '',
        year: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('reports.sale.index', { tab: activeTab }), { preserveState: true, preserveScroll: true });
    };

    const is = (k: string) => activeTab === k;

    return (
        <AppLayout>
            <Head title={t('saleReportTitle')} />

            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg">
                    <PageHeader title={t('saleGenerateReportTitle')} />
                    <Card>
                        {/* ── Header and Tab Bar ───────────────────── */}
                        <CardHeader className="bg-background border-b px-6 py-4">
                            <nav className="mt-4 border-b border-gray-200">
                                <ul className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10">
                                    {tabs.map((t) => (
                                        <li key={t.key} className="flex">
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab(t.key)}
                                                className={`inline-block px-3 py-2 text-sm font-medium ${
                                                    activeTab === t.key
                                                        ? 'border-b-2 border-blue-500 text-blue-600'
                                                        : 'text-foreground hover:text-blue-600'
                                                }`}
                                            >
                                                {t.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </CardHeader>

                        {/* ── Form ───────────────────────────────── */}
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* From Date */}
                                    <div>
                                        <InputCalendar
                                            value={data.from_date}
                                            onChange={(val) => {
                                                setData('from_date', val);
                                                setData('year', '');
                                            }}
                                            label="From Date"
                                            required={!data.year}
                                        />
                                        {errors.from_date && <p className="text-sm text-red-500">{errors.from_date}</p>}
                                    </div>

                                    {/* To Date */}
                                    <div>
                                        <InputCalendar
                                            value={data.to_date}
                                            onChange={(val) => {
                                                setData('to_date', val);
                                                setData('year', '');
                                            }}
                                            label="To Date"
                                            required={!data.year}
                                        />
                                        {errors.to_date && <p className="text-sm text-red-500">{errors.to_date}</p>}
                                    </div>

                                    {/* Year Filter (only for "All" tab) */}
                                    {is('all') && (
                                        <div>
                                            <label className="block text-sm font-medium">
                                                Year <span className="text-gray-400">(optional)</span>
                                            </label>
                                            <select
                                                className="mt-1 w-full rounded border px-3 py-2"
                                                value={data.year ?? ''}
                                                onChange={(e) => {
                                                    const selectedYear = e.target.value;
                                                    setData('year', selectedYear);
                                                    if (selectedYear) {
                                                        setData('from_date', '');
                                                        setData('to_date', '');
                                                    }
                                                }}
                                            >
                                                <option value="">— All Years —</option>
                                                {Array.from({ length: 6 }, (_, i) => {
                                                    const year = new Date().getFullYear() + i;
                                                    return (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    )}

                                    {/* Conditional Dropdowns */}
                                    {is('category') && (
                                        <div>
                                            <label className="block text-sm font-medium">{t('purchaseCategoryLabel')}</label>
                                            <select
                                                className="mt-1 w-full rounded border px-3 py-2"
                                                value={data.category_id}
                                                onChange={(e) => setData('category_id', e.target.value)}
                                            >
                                                <option value="">{t('stockAllCategoriesOption')}</option>
                                                {categories.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {is('item') && (
                                        <div>
                                            <label className="block text-sm font-medium">{t('purchaseItemLabel')}</label>
                                            <select
                                                className="mt-1 w-full rounded border px-3 py-2"
                                                value={data.item_id}
                                                onChange={(e) => setData('item_id', e.target.value)}
                                            >
                                                <option value="">{t('stockAllItemsOption')}</option>
                                                {items.map((i) => (
                                                    <option key={i.id} value={i.id}>
                                                        {i.item_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {is('party') && (
                                        <div>
                                            <label className="block text-sm font-medium">{t('salePartyLabel')}</label>
                                            <select
                                                className="mt-1 w-full rounded border px-3 py-2"
                                                value={data.party_id}
                                                onChange={(e) => setData('party_id', e.target.value)}
                                            >
                                                <option value="">— All Parties —</option>
                                                {parties.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {is('godown') && (
                                        <div>
                                            <label className="block text-sm font-medium">{t('saleGodownLabel')}</label>
                                            <select
                                                className="mt-1 w-full rounded border px-3 py-2"
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
                                    )}

                                    {is('salesman') && (
                                        <div>
                                            <label className="block text-sm font-medium">{t('saleSalesmanLabel')}</label>
                                            <select
                                                className="mt-1 w-full rounded border px-3 py-2"
                                                value={data.salesman_id}
                                                onChange={(e) => setData('salesman_id', e.target.value)}
                                            >
                                                <option value="">— All Salesmen —</option>
                                                {salesmen.map((s) => (
                                                    <option key={s.id} value={s.id}>
                                                        {s.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
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
