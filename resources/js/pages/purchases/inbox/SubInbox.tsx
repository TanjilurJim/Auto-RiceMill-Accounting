// resources/js/Pages/purchases/inbox/SubInbox.tsx
import AppLayout from '@/layouts/app-layout';
import PurchaseInboxTable from './PurchaseInboxTable';
import PageHeader from '@/components/PageHeader';
// Adjust path if needed
import { Head } from '@inertiajs/react';

interface PageProps {
    purchases: any; // Use the SalePaginator interface from SalesInboxTable
    filters: {
        q?: string;
        from?: string;
        to?: string;
    }
}

export default function SubInbox({ purchases, filters }) {
  return (
    <AppLayout>
      <Head title="Purchase – Sub-Inbox" />
      
      <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
        
        <div className="bg-white h-full rounded-lg p-6">
          <PageHeader title="Purchase – Sub-Inbox" />
      <PurchaseInboxTable
        purchases={purchases}
        approveRoute={(id) => route('purchases.approve-sub', id)}
        rejectRoute ={(id) => route('purchases.reject', id)}
      />
      </div>
      </div>
    </AppLayout>
  );
}
