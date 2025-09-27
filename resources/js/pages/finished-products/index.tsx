import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { FiEdit, FiEye, FiTrash } from 'react-icons/fi';

/* ─────────── Types ─────────── */
interface Item {
    item_name: string;
}
interface Godown {
    name: string;
}
interface ProductRow {
    product: Item;
    godown: Godown;
    quantity: number;
    total: number;
}
interface WorkingOrder {
    id: number;
    voucher_no: string;
    date: string;
}
interface FinishedProduct {
    id: number;
    production_voucher_no: string;
    production_date: string;
    remarks: string;
    working_order: WorkingOrder;
    items: ProductRow[];
}
interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}
interface Props {
    finishedProducts: Paginated<FinishedProduct>;
}

/* ─────────── Component ─────────── */
export default function Index({ finishedProducts }: Props) {
    const t = useTranslation();
    const products = finishedProducts.data;

    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/finished-products/${id}`);
        });
    };

    const columns = [
        { header: t('fp-voucher-no'), accessor: 'production_voucher_no', className: 'font-semibold text-indigo-700' },
        { header: t('fp-production-date'), accessor: 'production_date' },
        {
            header: t('fp-working-order'),
            accessor: (fp: FinishedProduct) => (
                <>
                    {fp.working_order?.voucher_no} <br />
                    <span className="text-xs text-gray-500">{fp.working_order?.date}</span>
                </>
            ),
        },
        {
            header: t('fp-items'),
            accessor: (fp: FinishedProduct) => {
                const itemLines = fp.items.map((r) => `${r.product.item_name} (${r.quantity}) ${t('fp-from')} ${r.godown.name}`);
                return <span className="text-xs whitespace-pre-line">{itemLines.join('\n')}</span>;
            },
        },
        {
            header: t('fp-total-qty'),
            accessor: (fp: FinishedProduct) => fp.items.reduce((t, r) => t + Number(r.quantity), 0).toFixed(2),
            className: 'text-right',
        },
        {
            header: t('fp-total-amount'),
            accessor: (fp: FinishedProduct) => fp.items.reduce((t, r) => t + Number(r.total), 0).toFixed(2),
            className: 'text-right',
        },
        { header: t('fp-note'), accessor: 'remarks', className: 'text-sm text-gray-700' },
    ];

    return (
        <AppLayout>
            <Head title={t('fp-finished-products')} />

            <div className="bg-gray-space-y mx-auto h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg bg-background">
                    <PageHeader
                        title={t('fp-finished-products')}
                        addLinkHref="/finished-products/create"
                        addLinkText={t('fp-add-finished-product-plus')}
                    />

                    {/* Table */}
                    <TableComponent
                        columns={columns}
                        data={products}
                        actions={(fp: FinishedProduct) => (
                            <ActionButtons
                                editHref={`/finished-products/${fp.id}/edit`}
                                onDelete={() => handleDelete(fp.id)}
                                printHref={`/finished-products/${fp.id}`}
                                editText={<FiEdit />}
                                deleteText={<FiTrash />}
                                printText={<FiEye />}
                            />
                        )}
                        noDataMessage={t('fp-no-finished-products')}
                    />

                    {/* Pagination */}
                    <Pagination
                        links={finishedProducts.links}
                        currentPage={finishedProducts.current_page}
                        lastPage={finishedProducts.last_page}
                        total={finishedProducts.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
