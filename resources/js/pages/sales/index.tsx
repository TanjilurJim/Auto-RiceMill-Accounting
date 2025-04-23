import React, { useState, MouseEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import PageHeader from '@/components/PageHeader';
import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';

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
  current_page: number;
  last_page: number;
  total: number;
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

    confirmDialog(
      {}, () => {
        router.delete(`/sales/${id}`);
      }
    )
  };

  const columns = [
    { header: 'SL', accessor: (_: Sale, index?: number) => <span>{(index ?? 0) + 1}</span>, className: 'text-center' },
    { header: 'Date', accessor: 'date' },
    { header: 'Vch. No', accessor: 'voucher_no' },
    { header: 'Ledger', accessor: (row: Sale) => row.account_ledger.account_ledger_name },
    {
      header: 'Item + Qty',
      accessor: (row: Sale) =>
        row.sale_items.map((item, idx) => (
          <div key={idx}>
            {item.item?.item_name || 'N/A'} - {item.qty}
          </div>
        )),
    },
    { header: 'Total Qty', accessor: 'total_qty', className: 'text-center' },
    {
      header: 'Total Amount',
      accessor: (row: Sale) => `${(parseFloat(row.grand_total as any) || 0).toFixed(2)} Tk`,
      className: 'text-right font-semibold',
    },
  ];

  return (
    <AppLayout>
      <Head title="Sales List" />
      <div className="p-4 bg-gray-100 w-screen md:w-full">

        {/* Header */}
        <PageHeader title='Sales List' addLinkHref='/sales/create' addLinkText='+ Add Sale' />
        
        {/* Table */}
        <TableComponent
          columns={columns}
          data={sales.data}
          actions={(row: Sale, rowIndex: number) => (
            <ActionButtons
              editHref={`/sales/${row.id}/edit`}
              onDelete={() => handleDelete(row.id)}
              onPrint={(e) => toggleDropdown(rowIndex, e)}
              printText="Print ▼"
            />
          )}
        />



        {/* Pagination */}
        <Pagination
          links={sales.links}
          currentPage={sales.current_page}
          lastPage={sales.last_page}
          total={sales.total}
        />

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