import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
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
    const handleDelete = (id: number) => {
        confirmDialog(
            {}, () => {
                router.delete(`/purchase-returns/${id}`);
            }
        );
    };


    const columns = [
        {
            header: 'SL',
            accessor: (_row: ReturnItem, index?: number) => <div className="text-center">{(index || 0) + 1}</div>,
        },
        { header: 'Date', accessor: 'date' },
        { header: 'Return Vch. No', accessor: 'return_voucher_no' },
        { header: 'Ledger', accessor: (row: ReturnItem) => row.account_ledger.account_ledger_name },
        { header: 'Godown', accessor: (row: ReturnItem) => row.godown.name },
        {
            header: 'Item + Qty',
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
        { header: 'Total Qty', accessor: (row: ReturnItem) => <div className="text-center">{row.total_qty}</div> },
        {
            header: 'Return Value',
            accessor: (row: ReturnItem) => {
                const totalAmount = row.return_items.reduce((sum, item) => sum + (parseFloat(item.subtotal as any) || 0), 0);
                return <div className="text-right font-semibold">{totalAmount.toFixed(2)} Tk</div>;
            },
        },
    ];

    return (
        <AppLayout>
            <Head title="All Purchase Returns" />
            <div className="bg-background p-6 h-full w-screen lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">
                    {/* Header */}
                    <PageHeader title='Purchase Return List' addLinkHref='/purchase-returns/create' addLinkText='+ Add Return' />
                    {/* Table */}
                    <TableComponent
                        columns={columns}
                        data={returns.data}
                        actions={(row: ReturnItem) => (
                            <ActionButtons
                                editHref={`/purchase-returns/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                printText="Print"
                                printHref={`/purchase-returns/${row.id}/invoice`}
                            />
                        )}
                    />
                    {/* Pagination */}
                    <Pagination
                        links={returns.links}
                        currentPage={returns.current_page}
                        lastPage={returns.last_page}
                        total={returns.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
