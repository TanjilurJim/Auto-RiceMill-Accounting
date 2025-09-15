import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface SalesReturn {
  id: number;
  return_date: string;
  voucher_no: string;
  account_ledger: { account_ledger_name: string; reference_number: string }; // Include reference_number
  sale: { voucher_no: string };
  total_qty: number;
  total_return_amount: number;
}

interface PaginatedSalesReturns {
  data: SalesReturn[];
  links: { url: string | null; label: string; active: boolean }[];
  current_page: number;
  last_page: number;
  total: number;
}

export default function SalesReturnIndex({ salesReturns }: { salesReturns: PaginatedSalesReturns }) {
  const handleDelete = (id: number) => {
    confirmDialog(
      {}, () => {
        router.delete(`/sales-returns/${id}`);
      }
    )
  };

  const columns = [
    { header: 'SL', accessor: (_: SalesReturn, index?: number) => <span>{(index ?? 0) + 1}</span>, className: 'text-center' },
    { header: 'Date', accessor: 'return_date' },
    { header: 'Voucher No', accessor: 'voucher_no' },
    { header: 'Sale Voucher No', accessor: (row: SalesReturn) => row.sale?.voucher_no ?? '—' },
    {
      header: 'Ledger',
      accessor: (row: SalesReturn) =>
        `${row.account_ledger.account_ledger_name} - ${row.account_ledger.reference_number}`,
    },
    { header: 'Total Qty', accessor: 'total_qty', className: 'text-center' },
    {
      header: 'Total Return Amount',
      accessor: (row: SalesReturn) => `${Number(row.total_return_amount || 0).toFixed(2)} Tk`,
      className: 'text-right font-semibold',
    },
  ];

  return (
    <AppLayout>
      <Head title="All Sales Returns" />
      <div className="h-full w-screen lg:w-full">
        <div className="bg-white h-full rounded-lg p-4 md:p-12">

          <PageHeader title='Sales Return List' addLinkHref='/sales-returns/create' addLinkText='+ Add Sales Return' />

          <TableComponent
            columns={columns}
            data={salesReturns.data}
            actions={(row: SalesReturn) => (
              <ActionButtons
                editHref={`/sales-returns/${row.id}/edit`}
                onDelete={() => handleDelete(row.id)}
                printHref={`/sales-returns/${row.id}/invoice`}
                printText="Print"
              />
            )}
          />

          {/* Pagination */}
          <Pagination
            links={salesReturns.links}
            currentPage={salesReturns.current_page}
            lastPage={salesReturns.last_page}
            total={salesReturns.total}
          />
        </div>
      </div>
    </AppLayout>
  );
}
