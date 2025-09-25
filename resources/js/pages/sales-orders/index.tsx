import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
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
    const t = useTranslation();

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
        confirmDialog({}, () => {
            router.delete(`/sales-orders/${id}`);
        });
    };

    const columns = [
        { header: t('slHeader'), accessor: (_: SalesOrder, index?: number) => <span>{(index ?? 0) + 1}</span>, className: 'text-center' },
        { header: t('dateHeader'), accessor: 'date' },
        { header: t('vchNoHeader'), accessor: 'voucher_no' },
        { header: t('ledgerHeader'), accessor: (row: SalesOrder) => row.ledger?.account_ledger_name ?? t('notAvailable') },
        { header: t('salesOrderSalesmanHeader'), accessor: (row: SalesOrder) => row.salesman?.name || '-' },
        {
            header: t('itemQtyRateHeader'),
            accessor: (row: SalesOrder) =>
                row.items.map((item, idx) => (
                    <div key={idx}>
                        {item.product?.item_name || t('notAvailable')} - {item.quantity} x {item.rate}tk
                    </div>
                )),
        },
        { header: t('totalQtyHeader'), accessor: 'total_qty', className: 'text-center' },
        {
            header: t('totalAmountHeader'),
            accessor: (row: SalesOrder) => `${Number(row.total_amount || 0).toFixed(2)} ${t('currencyTk')}`,
            className: 'text-center font-semibold',
        },
    ];

    return (
        <AppLayout>
            <Head title={t('salesOrderListTitle')} />
            <div className="bg-background h-full w-screen p-6 lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">
                    <PageHeader title={t('salesOrderListTitle')} addLinkHref="/sales-orders/create" addLinkText={t('addSalesOrderButton')} />

                    <TableComponent
                        columns={columns}
                        data={salesOrders.data}
                        actions={(row: SalesOrder) => (
                            <ActionButtons
                                editHref={`/sales-orders/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                printHref={`/sales-orders/${row.id}/invoice`}
                                printText={t('printText')}
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
            </div>
        </AppLayout>
    );
}
