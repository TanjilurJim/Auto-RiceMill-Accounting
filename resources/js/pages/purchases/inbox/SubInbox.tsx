// resources/js/Pages/purchases/inbox/SubInbox.tsx
import AppLayout from '@/layouts/app-layout';
import PurchaseInboxTable from './PurchaseInboxTable';
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
      <PurchaseInboxTable
        purchases={purchases}
        approveRoute={(id) => route('purchases.approve-sub', id)}
        rejectRoute ={(id) => route('purchases.reject', id)}
      />
    </AppLayout>
  );
}
