import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import PurchaseInboxTable from './PurchaseInboxTable';

export default function RespInbox() {
    const t = useTranslation();
    const { purchases, filters } = usePage().props as {
        purchases: any;
        filters: Record<string, string>;
    };

    return (
        <AppLayout>
            <Head title={t('purchaseRespInboxTitle')} />
            <div className="bg-background-100 h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg">
                    <PageHeader title={t('purchaseRespInboxHeader')} />

                    <PurchaseInboxTable
                        purchases={purchases}
                        approveRoute={(id) => route('purchases.approve-final', id)}
                        rejectRoute={(id) => route('purchases.reject', id)}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
