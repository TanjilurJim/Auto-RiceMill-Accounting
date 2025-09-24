// resources/js/Pages/purchases/inbox/SubInbox.tsx
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import PurchaseInboxTable from './PurchaseInboxTable';
// Adjust path if needed
import { Head } from '@inertiajs/react';

interface PageProps {
    purchases: any; // Use the SalePaginator interface from SalesInboxTable
}

export default function SubInbox({ purchases }: PageProps) {
    return (
        <AppLayout>
            <Head title="Purchase – Sub-Inbox" />
            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg">
                    <PageHeader title="Purchase – Sub-Inbox" />
                    <PurchaseInboxTable
                        purchases={purchases}
                        approveRoute={(id) => route('purchases.approve-sub', id)}
                        rejectRoute={(id) => route('purchases.reject', id)}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
