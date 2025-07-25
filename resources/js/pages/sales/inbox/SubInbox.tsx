// resources/js/Pages/sales/inbox/SubInbox.tsx

import AppLayout from '@/layouts/app-layout';
import SalesInboxTable from './SalesInboxTable';
import FilterBar from '@/components/FilterBar'; // Adjust path if needed

// The props interface from the controller
interface PageProps {
    sales: any; // Use the SalePaginator interface from SalesInboxTable
    filters: {
        q?: string;
        from?: string;
        to?: string;
    }
}

export default function SubInbox({ sales, filters }: PageProps) {
    return (
        <AppLayout title="Pending Sub-Approval">
            <h1 className="mb-4 text-xl font-semibold">Sales needing your Sub-Approval</h1>

            {/* The new, improved filter bar */}
            <FilterBar endpoint={route('sales.inbox.sub')} filters={filters} />
            
            <SalesInboxTable
                sales={sales}
                approveRoute={id => `/sales/${id}/approve-sub`}
                rejectRoute={id => `/sales/${id}/reject`}
            />
        </AppLayout>
    );
}