import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface ReturnItem {
    id: number;
    date: string;
    return_voucher_no: string;
    account_ledger: { account_ledger_name: string };
    godown: { name: string };
    return_items: { item: { item_name: string } | null; qty: number; subtotal: number }[];
    total_qty: number;
    grand_total: number;
}

interface PaginatedReturns {
    data: ReturnItem[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function PurchaseReturnIndex({ returns }: { returns: PaginatedReturns }) {
    const t = useTranslation();
    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/purchase-returns/${id}`);
        });
    };

    const columns = [
        {
            header: t('slHeader'),
            accessor: (_row: ReturnItem, index?: number) => <div className="text-center">{(index || 0) + 1}</div>,
        },
        { header: t('dateHeader'), accessor: 'date' },
        { header: t('returnVchNoHeader'), accessor: 'return_voucher_no' },
        { header: t('ledgerHeader'), accessor: (row: ReturnItem) => row.account_ledger.account_ledger_name },
        { header: t('godownHeader'), accessor: (row: ReturnItem) => row.godown.name },
        {
            header: t('itemQtyHeader'),
            accessor: (row: ReturnItem) => (
                <div>
                    {row.return_items.map((item, idx) => (
                        <div key={idx} className="mb-1">
                            {item.item?.item_name || 'N/A'} - {item.qty}
                        </div>
                    ))}
                </div>
            ),
        },
        { header: t('totalQtyHeader'), accessor: (row: ReturnItem) => <div className="text-center">{row.total_qty}</div> },
        {
            header: t('returnValueHeader'),
            accessor: (row: ReturnItem) => {
                const totalAmount = row.return_items.reduce((sum, item) => sum + (parseFloat(item.subtotal as any) || 0), 0);
                return <div className="text-right font-semibold">{totalAmount.toFixed(2)} Tk</div>;
            },
        },
    ];

    return (
        <AppLayout>
            <Head title={t('allPurchaseReturnsTitle')} />
            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg">
                    {/* Header */}
                    <PageHeader title={t('purchaseReturnListHeader')} addLinkHref="/purchase-returns/create" addLinkText={t('addReturnButton')} />
                    {/* Table */}
                    <TableComponent
                        columns={columns}
                        data={returns.data}
                        noDataMessage={t('noPurchaseReturnsFound')}
                        actions={(row: ReturnItem) => (
                            <ActionButtons
                                editHref={`/purchase-returns/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                printText={t('printText')}
                                printHref={`/purchase-returns/${row.id}/invoice`}
                            />
                        )}
                    />
                    {/* Pagination */}
                    <Pagination links={returns.links} currentPage={returns.current_page} lastPage={returns.last_page} total={returns.total} />
                </div>
            </div>
        </AppLayout>
    );
}
