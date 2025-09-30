import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { fmtDate } from '@/utils/format';
import { Head, Link, router } from '@inertiajs/react';
import React, { MouseEvent, useEffect, useState } from 'react';

const miniBtn = 'px-2 py-1 text-xs rounded font-medium text-white transition';

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
    status: string;
}

interface PaginatedSales {
    data: Sale[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function SaleIndex({ sales }: { sales: PaginatedSales }) {
    const t = useTranslation();
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
                    x: rect.left + scrollX, // left edge of button
                    y: rect.bottom + scrollY, // bottom of button
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

    useEffect(() => {
        /* close menu on any scroll */
        const handleScroll = () => setOpenDropdown(null);

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Delete function
    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/sales/${id}`);
        });
    };

    const columns = [
        { header: t('slHeader'), accessor: (_: Sale, index?: number) => <span>{(index ?? 0) + 1}</span>, className: 'text-center' },
        { header: t('dateHeader'), accessor: (row: Sale) => fmtDate(row.date) },
        { header: t('vchNoHeader'), accessor: 'voucher_no' },
        { header: t('ledgerHeader'), accessor: (row: Sale) => row.account_ledger.account_ledger_name },
        {
            header: t('itemQtyHeader'),
            accessor: (row: Sale) =>
                row.sale_items.map((item, idx) => (
                    <div key={idx}>
                        {item.item?.item_name || t('notAvailable')} - {item.qty}
                    </div>
                )),
        },
        {
            header: t('fyStatusHeader'),
            accessor: (row: Sale) => {
                const statusMap: Record<string, string> = {
                    draft: t('draftBadge'),
                    pending_sub: t('pendingSubBadge'),
                    pending_resp: t('pendingRespBadge'),
                    approved: t('approvedBadge'),
                    rejected: t('rejectedBadge'),
                };
                return (
                    <span
                        className={
                            'rounded px-2 py-0.5 text-xs font-semibold ' +
                            {
                                draft: 'bg-gray-200 text-gray-700',
                                pending_sub: 'bg-yellow-100 text-yellow-800',
                                pending_resp: 'bg-orange-100 text-orange-800',
                                approved: 'bg-green-100 text-green-800',
                                rejected: 'bg-red-100 text-red-800',
                            }[row.status as Sale['status']]
                        }
                    >
                        {statusMap[row.status] || row.status.replace('_', ' ')}
                    </span>
                );
            },
            className: 'text-center',
        },
        { header: t('totalQtyHeader'), accessor: 'total_qty', className: 'text-center' },
        {
            header: t('totalAmountHeader'),
            accessor: (row: Sale) => `${(parseFloat(row.grand_total as any) || 0).toFixed(2)} ${t('currencyTk')}`,
            className: 'text-right font-semibold',
        },
        // {
        //     header: 'Actions',
        //     accessor: () => null, // we’ll inject buttons via TableComponent actions prop
        //     className: 'whitespace-nowrap px-2 py-1', // 👈 keep cell tight
        // },
    ];

    return (
        <AppLayout>
            <Head title={t('salesListTitle')} />
            <div className="bg-background h-full w-screen p-6 lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">
                    {/* Header */}
                    <PageHeader title={t('salesListTitle')} addLinkHref="/sales/create" addLinkText={t('addSaleButtonText')} />

                    {/* Table */}
                    <TableComponent
                        columns={columns}
                        data={sales.data}
                        actions={(row: Sale, rowIndex: number) => (
                            <div className="relative inline-block">
                                {/* buttons */}
                                <ActionButtons
                                    className="px-2 py-1 whitespace-nowrap"
                                    editHref={`/sales/${row.id}/edit`}
                                    onDelete={() => handleDelete(row.id)}
                                    onPrint={(e) => toggleDropdown(rowIndex, e)}
                                    printText={t('printDropdownText')}
                                    editClassName={`${miniBtn} bg-warning hover:bg-warning-hover`}
                                    deleteClassName={`${miniBtn} bg-danger  hover:bg-danger-hover`}
                                    printClassName={`${miniBtn} bg-info    hover:bg-info-hover`}
                                />

                                {/* dropdown – only for the row that’s open */}
                                {openDropdown === rowIndex && (
                                    <div
                                        className="bg-background absolute right-0 z-50 mt-1 w-40 rounded border shadow"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Link
                                            href={`/sales/${row.id}/invoice`}
                                            target="_blank"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-black"
                                        >
                                            {t('saleInvoiceText')}
                                        </Link>
                                        <Link
                                            href={`/sales/${row.id}/truck-chalan`}
                                            target="_blank"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-black"
                                        >
                                            {t('truckChalanText')}
                                        </Link>
                                        <Link
                                            href={`/sales/${row.id}/load-slip`}
                                            target="_blank"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-black"
                                        >
                                            {t('loadSlipText')}
                                        </Link>
                                        <Link
                                            href={`/sales/${row.id}/gate-pass`}
                                            target="_blank"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-black"
                                        >
                                            {t('gatePassText')}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    />

                    {/* Pagination */}
                    <Pagination links={sales.links} currentPage={sales.current_page} lastPage={sales.last_page} total={sales.total} />
                </div>
            </div>
        </AppLayout>
    );
}
