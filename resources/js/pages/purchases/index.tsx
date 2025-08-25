import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { fmtDate } from '@/utils/format';
import { Head, router } from '@inertiajs/react';

interface Purchase {
    id: number;
    date: string;
    voucher_no: string;
    account_ledger: { account_ledger_name: string; reference_number: string };
    purchase_items: { item: { item_name: string } | null; qty: number; price: number; subtotal: number }[];
    total_qty: number;
    grand_total: number;
}

interface PaginatedPurchases {
    data: Purchase[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function PurchaseIndex({ purchases }: { purchases: PaginatedPurchases }) {
    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/purchases/${id}`);
        });
    };

    const columns = [
        { header: 'SL', accessor: (_: Purchase, index?: number) => (index !== undefined ? index + 1 : '-'), className: 'text-center' },
        // { header: 'Date', accessor: 'date' },
        { header: 'Date', accessor: (purchase: Purchase) => fmtDate(purchase.date) },
        { header: 'Vch. No', accessor: 'voucher_no' },
        {
            header: 'Ledger',
            accessor: (purchase: Purchase) => `${purchase.account_ledger.account_ledger_name} - ${purchase.account_ledger.reference_number}`,
        },
        {
            header: 'Item + Price',
            accessor: (purchase: Purchase) =>
                purchase.purchase_items.map((item, idx) => (
                    <div key={idx}>
                        {item.item?.item_name || 'N/A'} - {parseFloat(item.price as any).toFixed(2)} Tk
                    </div>
                )),
        },
        {
            header: 'Qty (Per Item)',
            accessor: (purchase: Purchase) => purchase.purchase_items.map((item, idx) => <div key={idx}>{item.qty}</div>),
        },
        { header: 'Total Qty', accessor: 'total_qty', className: 'text-center' },
        {
            header: 'Amount (Per Item)',
            accessor: (purchase: Purchase) =>
                purchase.purchase_items.map((item, idx) => <div key={idx}>{(item.qty * item.price).toFixed(2)} Tk</div>),
        },
        {
            header: 'Total Amount',
            accessor: (purchase: Purchase) =>
                purchase.purchase_items.reduce((sum, item) => sum + (parseFloat(item.subtotal as any) || 0), 0).toFixed(2) + ' Tk',
            className: 'text-right font-semibold',
        },
        {
            header: 'Due',
            accessor: (purchase: Purchase) => (
                <span className={`font-semibold ${purchase.due > 0 ? 'text-red-600' : 'text-gray-700'}`}>{purchase.due.toFixed(2)} Tk</span>
            ),
            className: 'text-center',
        },
        {
            header: 'Actions',
            accessor: (purchase: Purchase) => (
                <ActionButtons
                    viewHref={`/purchases/${purchase.id}`}
                    editHref={`/purchases/${purchase.id}/edit`}
                    // onDelete={() => handleDelete(purchase.id)}
                    printHref={`/purchases/${purchase.id}/invoice`}
                    printText="Print"
                />
            ),
            className: 'text-center',
        },
    ];

    return (
        <AppLayout>
            <Head title="All Purchases" />
            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-white p-6">
                    {/* Use the PageHeader component  */}
                    <PageHeader title="Purchase List" addLinkHref="/purchases/create" addLinkText="+ Add New" />

                    {/* Table */}
                    <TableComponent columns={columns} data={purchases.data} noDataMessage="No purchases found." />

                    {/* Pagination */}
                    <Pagination links={purchases.links} currentPage={purchases.current_page} lastPage={purchases.last_page} total={purchases.total} />
                </div>
            </div>
        </AppLayout>
    );
}
