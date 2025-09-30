import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import { useTranslation } from '../../components/useTranslation';

export default function ProfitLossFilter() {
    const t = useTranslation();
    const today = dayjs().format('YYYY-MM-DD');
    const { data, setData, processing } = useForm({
        from_date: today,
        to_date: today,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('reports.profit-loss'), data, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title={t('profitLossFilterTitle')} />

            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg">
                    <PageHeader title={t('profitLossFilterPageTitle')} />

                    <Card className="rounded-lg border shadow-sm">
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
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

                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[150px] bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500"
                                    >
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
