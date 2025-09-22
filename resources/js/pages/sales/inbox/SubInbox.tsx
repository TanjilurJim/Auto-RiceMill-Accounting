// resources/js/Pages/sales/inbox/SubInbox.tsx

import FilterBar from '@/components/FilterBar'; // Adjust path if needed
import AppLayout from '@/layouts/app-layout';
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
    return (
        <AppLayout>
            <div className='md:p-12 p-4'>
                <h1 className="mb-4 text-xl font-semibold">Sales needing your Sub-Approval</h1>

                {/* The new, improved filter bar */}
                <FilterBar endpoint={route('sales.inbox.sub')} filters={filters} />



                {sales.data.length > 0 ? (
                    <SalesInboxTable sales={sales} approveRoute={(id) => `/sales/${id}/approve-sub`} rejectRoute={(id) => `/sales/${id}/reject`} />
                ) : (
                    <p className="mt-6 text-xl font-semibold text-center">No sales found.</p>
                )}
            </div>
        </AppLayout>
    );
}
