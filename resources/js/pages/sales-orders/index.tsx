import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { MouseEvent, useState } from 'react';
import Swal from 'sweetalert2';

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
        Swal.fire({
            title: 'Are you sure?',
            text: 'This Sales Order will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/sales-orders/${id}`);
                Swal.fire('Deleted!', 'The Sales Order has been deleted.', 'success');
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Sales Order List" />
            <div className="bg-gray-100 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Sales Order List</h1>
                    <Link href="/sales-orders/create" className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                        + Add Sales Order
                    </Link>
                </div>

                <div className="overflow-visible overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
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
                                    <td className="border px-3 py-2 text-center">
                                        <div className="flex justify-center space-x-2">
                                            <Link
                                                href={`/sales-orders/${order.id}/edit`}
                                                className="rounded bg-yellow-500 px-2 py-1 text-xs text-white hover:bg-yellow-600"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </button>

                                            <Link href={``} className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700">
                                                Print
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-end gap-1">
                    {salesOrders.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || ''}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`rounded px-3 py-1 text-sm ${
                                link.active ? 'bg-blue-600 text-white' : 'hover:bg-neutral-200'
                            } ${!link.url && 'pointer-events-none opacity-50'}`}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
