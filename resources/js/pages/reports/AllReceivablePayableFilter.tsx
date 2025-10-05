import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import { useTranslation } from '../../components/useTranslation';

export default function AllReceivablePayableFilter() {
    const t = useTranslation();
    const today = dayjs().format('YYYY-MM-DD');

    const { data, setData, processing } = useForm({
        from_date: today,
        to_date: today,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('reports.receivable-payable'), data, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title={t('receivablePayableFilterTitle')} />

            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg">
                    <PageHeader title={t('receivablePayableReportFilterTitle')} />

                    <Card className="rounded-lg border shadow-sm">
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Date range fields */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <InputCalendar
                                            value={data.from_date}
                                            onChange={(val) => setData('from_date', val)}
                                            label={t('fromDateLabel')}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <InputCalendar value={data.to_date} onChange={(val) => setData('to_date', val)} label={t('toDateLabel')} required />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[150px] bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500"
                                    >
                                        {processing ? (
                                            <span className="flex items-center">
                                                <svg
                                                    className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                {t('accountProcessingText')}
                                            </span>
                                        ) : (
                                            t('stockViewReportText')
                                        )}
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
