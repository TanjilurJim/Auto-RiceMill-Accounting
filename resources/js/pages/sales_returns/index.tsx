import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
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
    const t = useTranslation();

    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/sales-returns/${id}`);
        });
    };

    const columns = [
        { header: t('slNo'), accessor: (_: SalesReturn, index?: number) => <span>{(index ?? 0) + 1}</span>, className: 'text-center' },
        { header: t('dateHeader'), accessor: 'return_date' },
        { header: t('voucherNoHeader'), accessor: 'voucher_no' },
        { header: t('saleVoucherNoHeader'), accessor: (row: SalesReturn) => row.sale?.voucher_no ?? '—' },
        {
            header: t('ledgerHeader'),
            accessor: (row: SalesReturn) => `${row.account_ledger.account_ledger_name} - ${row.account_ledger.reference_number}`,
        },
        { header: t('totalQtyHeader'), accessor: 'total_qty', className: 'text-center' },
        {
            header: t('totalReturnAmountHeader'),
            accessor: (row: SalesReturn) => `${Number(row.total_return_amount || 0).toFixed(2)} Tk`,
            className: 'text-right font-semibold',
        },
    ];

    return (
        <AppLayout>
            <Head title={t('salesReturnListTitle')} />
            <div className="h-full w-screen lg:w-full">
                <div className="h-full rounded-lg bg-background p-4 md:p-12">
                    <PageHeader title={t('salesReturnListTitle')} addLinkHref="/sales-returns/create" addLinkText={t('addSalesReturnText')} />

                    <TableComponent
                        columns={columns}
                        data={salesReturns.data}
                        actions={(row: SalesReturn) => (
                            <ActionButtons
                                editHref={`/sales-returns/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                printHref={`/sales-returns/${row.id}/invoice`}
                                printText={t('printText')}
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
