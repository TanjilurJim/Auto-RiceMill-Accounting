import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import PurchaseInboxTable from './PurchaseInboxTable';


export default function RespInbox() {
  const { purchases, filters } = usePage().props as {
    purchases: any;
    filters: Record<string,string>;
  };

  return (
    <AppLayout>
      <Head title="Purchases – Responsible Inbox" />

      <PurchaseInboxTable
        purchases={purchases}
        approveRoute={(id) => route('purchases.approve-final', id)}
        rejectRoute ={(id) => route('purchases.reject',        id)}
      />
    </AppLayout>
  );
}
