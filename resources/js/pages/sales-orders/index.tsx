import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import React, { MouseEvent, useState } from 'react';

interface SalesOrderItem {
    product: { item_name: string } | null;
    quantity: number;
}

interface SalesOrder {
    id: number;
    date: string;
    voucher_no: string;
    ledger: { account_ledger_name: string };
    salesman: { name: string } | null;
    items: SalesOrderItem[];
    total_qty: number;
    total_amount: number;
}

interface PaginatedOrders {
    data: SalesOrder[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function SalesOrderIndex() {
    const { salesOrders } = usePage().props as { salesOrders: PaginatedOrders };

    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0 });

    const toggleDropdown = (index: number, e?: MouseEvent<HTMLButtonElement>) => {
        e?.stopPropagation();
        if (openDropdown === index) {
            setOpenDropdown(null);
        } else {
            const rect = e?.currentTarget.getBoundingClientRect();
            if (rect) {
                const scrollY = window.scrollY || document.documentElement.scrollTop;
                const scrollX = window.scrollX || document.documentElement.scrollLeft;
                setDropdownPos({
                    x: rect.left + scrollX,
                    y: rect.bottom + scrollY,
                });
            }
            setOpenDropdown(index);
        }
    };

    const handleGlobalClick = () => {
        if (openDropdown !== null) {
            setOpenDropdown(null);
        }
    };

    React.useEffect(() => {
        window.addEventListener('click', handleGlobalClick);
        return () => {
            window.removeEventListener('click', handleGlobalClick);
        };
    }, [openDropdown]);

    const handleDelete = (id: number) => {

        confirmDialog(
            {}, () => {
                router.delete(`/sales-orders/${id}`);
            }
        )

    };

    const columns = [
        { header: 'SL', accessor: (_: SalesOrder, index?: number) => <span>{(index ?? 0) + 1}</span>, className: 'text-center' },
        { header: 'Date', accessor: 'date' },
        { header: 'Voucher No', accessor: 'voucher_no' },
        { header: 'Ledger', accessor: (row: SalesOrder) => row.ledger?.account_ledger_name ?? 'N/A' },
        { header: 'Salesman', accessor: (row: SalesOrder) => row.salesman?.name || '-' },
        {
            header: 'Item + Qty + Rate',
            accessor: (row: SalesOrder) =>
                row.items.map((item, idx) => (
                    <div key={idx}>
                        {item.product?.item_name || 'N/A'} - {item.quantity} x {item.rate}tk
                    </div>
                )),
        },
        { header: 'Total Qty', accessor: 'total_qty', className: 'text-center' },
        {
            header: 'Total Amount',
            accessor: (row: SalesOrder) => `${Number(row.total_amount || 0).toFixed(2)} Tk`,
            className: 'text-center font-semibold',
        },
    ];

    return (
        <AppLayout>
            <Head title="Sales Order List" />
            <div className="bg-gray-100 p-4 w-screen md:w-full">

                <PageHeader title='Sales Order List' addLinkHref='/sales-orders/create' addLinkText='+ Add Sales Order' />

                {/* <div className="overflow-visible overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
                    <table className="min-w-full border-collapse text-[13px]">
                        <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                            <tr>
                                <th className="border px-3 py-2">SL</th>
                                <th className="border px-3 py-2">Date</th>
                                <th className="border px-3 py-2">Voucher No</th>
                                <th className="border px-3 py-2">Ledger</th>
                                <th className="border px-3 py-2">Salesman</th>
                                <th className="border px-3 py-2">Item + Qty + Rate</th>
                                <th className="border px-3 py-2">Total Qty</th>
                                <th className="border px-3 py-2">Total Amount</th>
                                <th className="border px-3 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesOrders.data.map((order, index) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="border px-3 py-2 text-center">{index + 1}</td>
                                    <td className="border px-3 py-2">{order.date}</td>
                                    <td className="border px-3 py-2">{order.voucher_no}</td>
                                    <td className="border px-3 py-2">{order.ledger?.account_ledger_name ?? 'N/A'}</td>
                                    <td className="border px-3 py-2">{order.salesman?.name || '-'}</td>
                                    <td className="border px-3 py-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="mb-1">
                                                {item.product?.item_name || 'N/A'} - {item.quantity} x {item.rate}tk
                                            </div>
                                        ))}
                                    </td>
                                    <td className="border px-3 py-2 text-center">{order.total_qty}</td>
                                    <td className="border px-3 py-2 text-right font-semibold">{Number(order.total_amount || 0).toFixed(2)} Tk</td>
                                    <ActionButtons
                                        editHref={`/sales-orders/${order.id}/edit`}
                                        onDelete={() => handleDelete(order.id)}
                                        printHref={`/sales-orders/${order.id}/invoice`}
                                        printText="Print"
                                    />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> */}

                <TableComponent
                    columns={columns}
                    data={salesOrders.data}
                    actions={(row: SalesOrder) => (
                        <ActionButtons
                            editHref={`/sales-orders/${row.id}/edit`}
                            onDelete={() => handleDelete(row.id)}
                            printHref={`/sales-orders/${row.id}/invoice`}
                            printText="Print"
                        />
                    )}
                />

                <Pagination
                    links={salesOrders.links}
                    currentPage={salesOrders.current_page}
                    lastPage={salesOrders.last_page}
                    total={salesOrders.total}
                />
            </div>
        </AppLayout>
    );
}
