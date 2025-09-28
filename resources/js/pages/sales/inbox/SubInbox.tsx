// resources/js/Pages/sales/inbox/SubInbox.tsx

import FilterBar from '@/components/FilterBar'; // Adjust path if needed
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import SalesInboxTable from './SalesInboxTable';

// The props interface from the controller
interface PageProps {
    sales: any; // Use the SalePaginator interface from SalesInboxTable
    filters: {
        q?: string;
        from?: string;
        to?: string;
    };
}

export default function SubInbox({ sales, filters }: PageProps) {
    const t = useTranslation();

    return (
        <AppLayout>
            <Head title={t('salesSubApprovalTitle')} />
            <div className="p-4 md:p-12">
                <h1 className="mb-4 text-xl font-semibold">{t('salesSubApprovalTitle')}</h1>

                {/* The new, improved filter bar */}
                <FilterBar endpoint={route('sales.inbox.sub')} filters={filters} />

                {sales.data.length > 0 ? (
                    <SalesInboxTable sales={sales} approveRoute={(id) => `/sales/${id}/approve-sub`} rejectRoute={(id) => `/sales/${id}/reject`} />
                ) : (
                    <p className="mt-6 text-center text-xl font-semibold">{t('noSalesFound')}</p>
                )}
            </div>
        </AppLayout>
    );
}
