import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

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
}

export default function SalesReturnIndex({ salesReturns }: { salesReturns: PaginatedSalesReturns }) {
  const handleDelete = (id: number) => {
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'This sales return will be permanently deleted!',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#d33',
    //   cancelButtonColor: '#3085d6',
    //   confirmButtonText: 'Yes, delete it!',
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     router.delete(`/sales-returns/${id}`);
    //     Swal.fire('Deleted!', 'The sales return has been deleted.', 'success');
    //   }
    // });

    confirmDialog(
      {}, () => {
        router.delete(`/sales-returns/${id}`);
      }
    )

  };

  return (
    <AppLayout>
      <Head title="All Sales Returns" />
      <div className="bg-gray-100 p-6">
        {/* <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Sales Return List</h1>
          <Link href="/sales-returns/create" className="rounded bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700">
            + Add Sales Return
          </Link>
        </div> */}

        <PageHeader title='Sales Return List' addLinkHref='/sales-returns/create' addLinkText='+ Add Sales Return' />

        <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-md">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-200 text-gray-700 uppercase">
              <tr>
                <th className="border-b px-4 py-2 text-left">SL</th>
                <th className="border-b px-4 py-2 text-left">Date</th>
                <th className="border-b px-4 py-2 text-left">Voucher No</th>
                <th className="border-b px-4 py-2 text-left">Sale Voucher No</th>
                <th className="border-b px-4 py-2 text-left">Ledger</th> {/* Account Ledger column */}
                <th className="border-b px-4 py-2 text-left">Total Qty</th>
                <th className="border-b px-4 py-2 text-left">Total Return Amount</th>
                <th className="border-b px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salesReturns.data.map((returnItem, index) => (
                <tr key={returnItem.id} className="hover:bg-gray-50 border">
                  <td className="border-b px-4 py-2 text-center">{index + 1}</td>
                  <td className="border-b px-4 py-2">{returnItem.return_date}</td>
                  <td className="border-b px-4 py-2">{returnItem.voucher_no}</td>
                  <td className="border-b px-4 py-2">{returnItem.sale?.voucher_no ?? '—'}</td>

                  {/* Display both account_ledger_name and reference_number */}
                  <td className="border-b px-4 py-2">
                    {returnItem.account_ledger.account_ledger_name} - {returnItem.account_ledger.reference_number}
                  </td>

                  <td className="border-b px-4 py-2 text-center">{returnItem.total_qty}</td>
                  <td className="border-b px-4 py-2 text-center font-semibold">
                    {Number(returnItem.total_return_amount || 0).toFixed(2)} Tk
                  </td>
                  {/* <td className="border-b px-4 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      
                      <Link
                        href={`/sales-returns/${returnItem.id}/edit`}
                        className="rounded bg-purple-500 px-3 py-1 text-xs text-white hover:bg-purple-600"
                      >
                        Edit
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(returnItem.id)}
                        className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                      
                      <Link
                        href={`/sales-returns/${returnItem.id}/invoice`}
                        target="_blank"
                        className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                      >
                        Print
                      </Link>
                    </div>
                  </td> */}
                  <ActionButtons
                    editHref={`/sales-returns/${returnItem.id}/edit`} // URL for the edit action
                    onDelete={() => handleDelete(returnItem.id)} // Function to handle the delete action
                    printHref={`/sales-returns/${returnItem.id}/invoice`} // URL for the print action
                    printText="Print" // Custom text for the print button
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {/* <div className="mt-6 flex justify-end gap-3">
          {salesReturns.links.map((link, index) => (
            <Link
              key={index}
              href={link.url || ''}
              dangerouslySetInnerHTML={{ __html: link.label }}
              className={`rounded px-4 py-2 text-sm ${link.active ? 'bg-blue-600 text-white' : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
                } ${!link.url && 'pointer-events-none opacity-50'}`}
            />
          ))}
        </div> */}
        <Pagination links={salesReturns.links} />
      </div>
    </AppLayout>
  );
}
