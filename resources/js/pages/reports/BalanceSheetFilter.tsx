import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from '../../components/useTranslation';

interface Props {
    default_from: string; // FY start
    default_to: string; // today (or FY end)
}

export default function BalanceSheetFilter({ default_from, default_to }: Props) {
    const t = useTranslation();
    const { data, setData, get, processing } = useForm({
        from_date: default_from,
        to_date: default_to,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('reports.balance-sheet'), {
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <AppLayout>
            <Head title={t('balanceSheetFiltersTitle')} />

            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg">
                    <PageHeader title={t('balanceSheetFilterTitle')} />

                    <Card className="rounded-lg border shadow-sm">
                        <CardContent className="p-6">
                            <form onSubmit={submit} className="space-y-4">
                                {/* FY start (locked) */}
                                <div>
                                    <InputCalendar value={data.from_date} onChange={() => {}} label={t('balanceFinancialYearStartLabel')} required />
                                </div>

                                {/* As-of date (editable) */}
                                <div>
                                    <InputCalendar
                                        value={data.to_date}
                                        onChange={(val) => setData('to_date', val)}
                                        label={t('balanceAsOfDateLabel')}
                                        required
                                    />
                                </div>

                                <p className="text-muted-foreground text-sm">{t('balanceSheetDescription')}</p>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        className="rounded border px-4 py-2"
                                        onClick={() => router.visit(route('reports.balance-sheet'))}
                                    >
                                        {t('balanceCancelText')}
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                                    >
                                        {t('stockViewReportText')}
                                    </button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
