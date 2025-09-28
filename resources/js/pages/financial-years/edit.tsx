import ActionFooter from '@/components/ActionFooter';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

interface FinancialYear {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    is_closed: boolean;
}

export default function Edit({ financialYear }: { financialYear: FinancialYear }) {
    const t = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        title: financialYear.title || '',
        start_date: financialYear.start_date || '',
        end_date: financialYear.end_date || '',
        is_closed: financialYear.is_closed || false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/financial-years/${financialYear.id}`);
    };

    return (
        <AppLayout>
            <Head title={t('fyEditPageTitle')} />
            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg bg-background">
                    <PageHeader title={t('fyEditYearTitle')} addLinkHref="/financial-years" addLinkText={t('fyBackButton')} />

                    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-background p-6 shadow">
                        {/* Title */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                {t('fyTitleLabel')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold shadow focus:border-blue-500 focus:ring-blue-500"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        {/* Start Date */}
                        <div>
                            <InputCalendar value={data.start_date} label={t('fyStartDateLabel')} onChange={(val) => setData('start_date', val)} />
                            {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                        </div>

                        {/* End Date */}
                        <div>
                            <InputCalendar value={data.end_date} label={t('fyEndDateLabel')} onChange={(val) => setData('end_date', val)} />
                            {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="is_closed" checked={data.is_closed} onChange={(e) => setData('is_closed', e.target.checked)} />
                            <label htmlFor="is_closed" className="text-sm text-gray-700">
                                {t('fyMarkAsClosedLabel')}
                            </label>
                        </div>

                        {/* Action Footer */}
                        <ActionFooter
                            processing={processing}
                            submitText={processing ? t('fySavingText') : t('fyUpdateButton')}
                            onSubmit={handleSubmit}
                            onCancel={() => window.history.back()}
                            cancelText={t('fyCancelButton')}
                            className="justify-end"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
