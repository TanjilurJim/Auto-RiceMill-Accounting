import React, { useState, MouseEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import PageHeader from '@/components/PageHeader';
import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';

interface SaleItem {
  item: { item_name: string } | null;
  qty: number;
  main_price: number;
  subtotal: number;
}

interface Sale {
  id: number;
  date: string;
  voucher_no: string;
  account_ledger: { account_ledger_name: string };
  sale_items: SaleItem[];
  total_qty: number;
  grand_total: number;
}

interface PaginatedSales {
  data: Sale[];
  links: { url: string | null; label: string; active: boolean }[];
}

export default function SaleIndex({ sales }: { sales: PaginatedSales }) {



  // Track which row index is open, or null if closed
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Track the absolute X/Y coordinates for the dropdown
  const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0 });

  // If user clicks "Print ▼", toggle open/close and set position
  const toggleDropdown = (index: number, e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation(); // stop event from bubbling up
    if (openDropdown === index) {
      // If already open, close it
      setOpenDropdown(null);
    } else {
      // Calculate button position
      const rect = e?.currentTarget.getBoundingClientRect();
      if (rect) {
        // We want the dropdown just below the button
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollX = window.scrollX || document.documentElement.scrollLeft;

        setDropdownPos({
          x: rect.left + scrollX,      // left edge of button
          y: rect.bottom + scrollY,    // bottom of button
        });
      }
      setOpenDropdown(index);
    }
  };

  // Close when user clicks anywhere else
  const handleGlobalClick = () => {
    if (openDropdown !== null) {
      setOpenDropdown(null);
    }
  };

  // Attach a global click listener so clicking anywhere closes the dropdown
  React.useEffect(() => {
    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [openDropdown]);

  // Delete function
  const handleDelete = (id: number) => {
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'This sale will be permanently deleted!',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#d33',
    //   cancelButtonColor: '#3085d6',
    //   confirmButtonText: 'Yes, delete it!',
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     router.delete(`/sales/${id}`);
    //     Swal.fire('Deleted!', 'The sale has been deleted.', 'success');
    //   }
    // });

    confirmDialog(
      {}, () => {
        router.delete(`/sales/${id}`);
      }
    )


  };

  return (
    <AppLayout>
      <Head title="Sales List" />
      <div className="p-4 bg-gray-100">

        {/* Header */}
        {/* <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Sales List</h1>
          <Link
            href="/sales/create"
            className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            + Add Sale
          </Link>
        </div> */}

        <PageHeader title='Sales List' addLinkHref='/sales/create' addLinkText='+ Add Sale' />

        {/* Table with "overflow-visible" so the fixed dropdown won't be clipped */}
        <div className="overflow-x-auto overflow-visible rounded-lg border border-gray-300 bg-white shadow-sm">
          <table className="min-w-full border-collapse text-[13px]">
            <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
              <tr>
                <th className="border px-3 py-2">SL</th>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Vch. No</th>
                <th className="border px-3 py-2">Ledger</th>
                <th className="border px-3 py-2">Item + Qty</th>
                <th className="border px-3 py-2">Total Qty</th>
                <th className="border px-3 py-2">Total Amount</th>
                <th className="border px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.data.map((sale, index) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 text-center">{index + 1}</td>
                  <td className="border px-3 py-2">{sale.date}</td>
                  <td className="border px-3 py-2">{sale.voucher_no}</td>
                  <td className="border px-3 py-2">
                    {sale.account_ledger.account_ledger_name}
                  </td>
                  <td className="border px-3 py-2">
                    {sale.sale_items.map((item, idx) => (
                      <div key={idx} className="mb-1">
                        {item.item?.item_name || 'N/A'} - {item.qty}
                      </div>
                    ))}
                  </td>
                  <td className="border px-3 py-2 text-center">{sale.total_qty}</td>
                  <td className="border px-3 py-2 text-right font-semibold">
                    {(parseFloat(sale.grand_total as any) || 0).toFixed(2)} Tk
                  </td>
                  {/* <td className="border px-3 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      
                      <Link
                        href={`/sales/${sale.id}/edit`}
                        className="rounded bg-yellow-500 px-2 py-1 text-xs text-white hover:bg-yellow-600"
                      >
                        Edit
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                      
                      <button
                        onClick={(e) => toggleDropdown(index, e)}
                        className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                      >
                        Print ▼
                      </button>
                    </div>
                  </td> */}
                  <ActionButtons
                    editHref={`/sales/${sale.id}/edit`} // URL for the edit action
                    onDelete={() => handleDelete(sale.id)} // Function to handle the delete action
                    onPrint={(e) => toggleDropdown(index, e)} // Function to handle the print dropdown
                    printText="Print ▼" // Custom text for the print button
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-end gap-1">
          {sales.links.map((link, index) => (
            <Link
              key={index}
              href={link.url || ''}
              dangerouslySetInnerHTML={{ __html: link.label }}
              className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'hover:bg-neutral-200'
                } ${!link.url && 'pointer-events-none opacity-50'}`}
            />
          ))}
        </div>

        {/* 🔥 The "Print" Dropdown outside the table so it won't be clipped */}
        {openDropdown !== null && (
          <div
            className="fixed z-50 w-40 rounded border bg-white shadow"
            style={{ top: dropdownPos.y, left: dropdownPos.x }}
            onClick={(e) => e.stopPropagation()} // so clicking inside won't close it
          >
            <Link
              href={`/sales/${sales.data[openDropdown].id}/invoice`}
              target="_blank"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Sale Invoice
            </Link>
            <Link
              href={`/sales/${sales.data[openDropdown].id}/truck-chalan`}
              target="_blank"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Truck Chalan
            </Link>
            <Link
              href={`/sales/${sales.data[openDropdown].id}/load-slip`}
              target="_blank"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Load Slip
            </Link>
            <Link
              href={`/sales/${sales.data[openDropdown].id}/gate-pass`}
              target="_blank"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Gate Pass
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
