import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from '../../components/useTranslation';

interface GroupUnder {
    id: number;
    name: string;
}

export default function LedgerGroupSummaryFilter() {
    const t = useTranslation();
    const today = dayjs().format('YYYY-MM-DD');

    const { group_unders = [] } = usePage().props as { group_unders: GroupUnder[] };

    const [form, setForm] = React.useState({
        from_date: today,
        to_date: today,
        group_under_id: '',
    });

    const [submitting, setSubmitting] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        router.get(route('reports.ledger-group-summary'), form, {
            replace: true, // optional: to avoid back stack clutter
            preserveState: true,
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AppLayout>
            <Head title={t('ledgerGroupSummaryTitle')} />
            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg">
                    <PageHeader title={t('ledgerGroupSummaryTitle')} />

                    <form onSubmit={handleSubmit} className="rounded-lg border p-6">
                        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <InputCalendar
                                    value={form.from_date}
                                    onChange={(val) => setForm((f) => ({ ...f, from_date: val }))}
                                    label="From Date"
                                    required
                                />
                            </div>
                            <div>
                                <InputCalendar
                                    value={form.to_date}
                                    onChange={(val) => setForm((f) => ({ ...f, to_date: val }))}
                                    label="To Date"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="text-forground text-sm font-medium">{t('ledgerGroupUnderLabel')}</label>
                            <select
                                name="group_under_id"
                                value={form.group_under_id}
                                onChange={handleChange}
                                className="mt-1 w-full rounded border px-3 py-2 text-sm shadow-sm"
                            >
                                <option value="">{t('ledgerAllGroupsOption')}</option>
                                {group_unders.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={submitting} className="bg-blue-600 text-right hover:bg-blue-700">
                                {submitting ? t('ledgerLoadingText') : t('stockViewReportText')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
