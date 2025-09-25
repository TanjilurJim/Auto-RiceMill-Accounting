import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
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
    const t = useTranslation();

    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/purchases/${id}`);
        });
    };

    const columns = [
        { header: t('slHeader'), accessor: (_: Purchase, index?: number) => (index !== undefined ? index + 1 : '-'), className: 'text-center' },
        // { header: 'Date', accessor: 'date' },
        { header: t('dateHeader'), accessor: (purchase: Purchase) => fmtDate(purchase.date) },
        { header: t('vchNoHeader'), accessor: 'voucher_no' },
        {
            header: t('ledgerHeader'),
            accessor: (purchase: Purchase) =>
                purchase.account_ledger ? `${purchase.account_ledger.account_ledger_name} - ${purchase.account_ledger.reference_number}` : 'N/A',
        },
        {
            header: t('itemPriceHeader'),
            accessor: (purchase: Purchase) =>
                purchase.purchase_items.map((item, idx) => (
                    <div key={idx}>
                        {item.item?.item_name || 'N/A'} - {parseFloat(item.price as any).toFixed(2)} Tk
                    </div>
                )),
        },
        {
            header: t('qtyPerItemHeader'),
            accessor: (purchase: Purchase) => purchase.purchase_items.map((item, idx) => <div key={idx}>{item.qty}</div>),
        },
        { header: t('totalQtyHeader'), accessor: 'total_qty', className: 'text-center' },
        {
            header: t('amountPerItemHeader'),
            accessor: (purchase: Purchase) =>
                purchase.purchase_items.map((item, idx) => <div key={idx}>{(item.qty * item.price).toFixed(2)} Tk</div>),
        },
        {
            header: t('totalAmountHeader'),
            accessor: (purchase: Purchase) =>
                purchase.purchase_items.reduce((sum, item) => sum + (parseFloat(item.subtotal as any) || 0), 0).toFixed(2) + ' Tk',
            className: 'text-right font-semibold',
        },
        {
            header: t('dueHeader'),
            accessor: (purchase: Purchase) => (
                <span className={`font-semibold ${purchase.due > 0 ? 'text-red-600' : 'text-gray-700'}`}>{purchase.due.toFixed(2)} Tk</span>
            ),
            className: 'text-center',
        },
        {
            header: t('tableActionsHeader'),
            accessor: (purchase: Purchase) => (
                <ActionButtons
                    viewHref={`/purchases/${purchase.id}`}
                    editHref={`/purchases/${purchase.id}/edit`}
                    // onDelete={() => handleDelete(purchase.id)}
                    printHref={`/purchases/${purchase.id}/invoice`}
                    printText={t('printText')}
                />
            ),
            className: 'text-center',
        },
    ];

    return (
        <AppLayout>
            <Head title={t('allPurchasesTitle')} />
            <div className="bg-background h-full w-screen p-6 lg:w-full">
                <div className="bg-background h-full rounded-lg md:p-6">
                    {/* Use the PageHeader component  */}
                    <PageHeader title={t('purchaseListHeader')} addLinkHref="/purchases/create" addLinkText={t('addNewButton')} />

                    {/* Table */}
                    <TableComponent columns={columns} data={purchases.data} noDataMessage={t('noPurchasesFound')} />

                    {/* Pagination */}
                    <Pagination links={purchases.links} currentPage={purchases.current_page} lastPage={purchases.last_page} total={purchases.total} />
                </div>
            </div>
        </AppLayout>
    );
}
