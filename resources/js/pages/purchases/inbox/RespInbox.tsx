import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import PurchaseInboxTable from './PurchaseInboxTable';
import PageHeader from '@/components/PageHeader';

export default function RespInbox() {
    const { purchases, filters } = usePage().props as {
        purchases: any;
        filters: Record<string, string>;
    };

    return (
        <AppLayout>
            <Head title="Purchases – Responsible Inbox" />
            <div className="h-full w-screen bg-background-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-background p-6">
                  <PageHeader title="Purchases – Responsible Inbox"/>

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
