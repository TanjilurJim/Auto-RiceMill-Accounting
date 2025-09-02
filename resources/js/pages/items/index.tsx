// resources/js/pages/items/index.tsx
import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';

interface ItemStock {
  lot?: { lot_no: string };
  qty: number;
}

interface Item {
  id: number;
  item_name: string;
  item_code: string;
  item_part: string;
  purchase_price: number;
  sale_price: number;
  previous_stock: number;
  total_previous_stock_value: number;
  description: string;

  // ✅ these were referenced but not typed:
  current_stock?: number;
  creator?: { name: string };

  category?: { name: string };
  unit?: { name: string };
  godown?: { name: string };
  stocks?: ItemStock[];
}

interface PaginatedItems {
  data: Item[];
  links: { url: string | null; label: string; active: boolean }[];
  current_page: number;
  last_page: number;
  total: number;
}

export default function ItemIndex({ items }: { items: PaginatedItems }) {
  const handleDelete = (id: number) => {
    confirmDialog({}, () => {
      router.delete(`/items/${id}`, {
        onSuccess: () => {
          // optional: keep list fresh after deletion without full reloads later
          router.reload({ only: ['items'], preserveScroll: true, preserveState: true });
        },
      });
    });
  };

  // 🔄 Lightweight, production-friendly auto-refresh
  useEffect(() => {
    // only poll page 1 to avoid pagination jumps (optional; remove check to always poll)
    const shouldPoll = items.current_page === 1;

    const refresh = () =>
      router.reload({ only: ['items'], preserveScroll: true, preserveState: true });

    const onFocus = () => refresh();

    const tick = () => {
      if (document.hidden) return; // pause when tab not visible
      if (!shouldPoll) return;
      refresh();
    };

    // 60s interval; tune to 30–90s depending on churn
    const id = window.setInterval(tick, 60000);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', tick);

    // one immediate check when component mounts & tab is visible
    if (!document.hidden && shouldPoll) {
      // debounce a bit to avoid double-refresh when arriving from a create
      const t = window.setTimeout(tick, 1500);
      return () => {
        window.clearTimeout(t);
        window.clearInterval(id);
        window.removeEventListener('focus', onFocus);
        document.removeEventListener('visibilitychange', tick);
      };
    }

    return () => {
      window.clearInterval(id);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [items.current_page]);

  const columns = [
    { header: '#', accessor: (_: Item, index?: number) => (index !== undefined ? index + 1 : '-'), className: 'text-center' },
    { header: 'Item Name', accessor: 'item_name' },
    { header: 'Item Code', accessor: 'item_code' },
    { header: 'Category', accessor: (item: Item) => item.category?.name || 'N/A' },
    { header: 'Unit', accessor: (item: Item) => item.unit?.name || 'N/A' },
    { header: 'Purchase Price', accessor: 'purchase_price' },
    { header: 'Sales Price', accessor: 'sale_price' },
    { header: 'Stock', accessor: (item: Item) => item.current_stock ?? 0 },
    {
      header: 'Lots',
      accessor: (item: Item) =>
        item.stocks && item.stocks.length > 0
          ? item.stocks.map((s) => s.lot?.lot_no).filter(Boolean).join(', ')
          : 'No Active Lots',
    },
    { header: 'Created By', accessor: (item: Item) => item.creator?.name || 'N/A' },
    {
      header: 'Actions',
      accessor: (item: Item) => (
        <ActionButtons
          editHref={`/items/${item.id}/edit`}
          viewHref={`/items/${item.id}`}
          onDelete={() => handleDelete(item.id)}
        />
      ),
      className: 'text-center',
    },
  ];

  return (
    <AppLayout>
      <Head title="Items" />
      <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
        <div className="h-full rounded-lg bg-white p-6">
          <PageHeader title="All Items" addLinkHref="/items/create" addLinkText="+ Add New" />
          <TableComponent columns={columns} data={items.data} noDataMessage="No items found." />
          <Pagination links={items.links} currentPage={items.current_page} lastPage={items.last_page} total={items.total} />
        </div>
      </div>
    </AppLayout>
  );
}
