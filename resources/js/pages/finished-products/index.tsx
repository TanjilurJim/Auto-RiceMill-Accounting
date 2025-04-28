import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
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
    const products = finishedProducts.data;

    const handleDelete = (id: number) => {
        confirmDialog(
            {}, () => {
                router.delete(`/finished-products/${id}`);
            }
        )
    };


    const columns = [
        { header: 'Voucher No', accessor: 'production_voucher_no', className: 'font-semibold text-indigo-700' },
        { header: 'Production Date', accessor: 'production_date' },
        {
            header: 'Working Order',
            accessor: (fp: FinishedProduct) => (
                <>
                    {fp.working_order?.voucher_no} <br />
                    <span className="text-xs text-gray-500">{fp.working_order?.date}</span>
                </>
            ),
        },
        {
            header: 'Items',
            accessor: (fp: FinishedProduct) => {
                const itemLines = fp.items.map(
                    (r) => `${r.product.item_name} (${r.quantity}) from ${r.godown.name}`
                );
                return <span className="whitespace-pre-line text-xs">{itemLines.join('\n')}</span>;
            },
        },
        {
            header: 'Total Qty',
            accessor: (fp: FinishedProduct) =>
                fp.items.reduce((t, r) => t + Number(r.quantity), 0).toFixed(2),
            className: 'text-right',
        },
        {
            header: 'Total Amount',
            accessor: (fp: FinishedProduct) =>
                fp.items.reduce((t, r) => t + Number(r.total), 0).toFixed(2),
            className: 'text-right',
        },
        { header: 'Note', accessor: 'remarks', className: 'text-sm text-gray-700' },
    ];


    return (
        <AppLayout>
            <Head title="Finished Products" />

            <div className="mx-auto h-full w-screen lg:w-full p-6 bg-gray-100 space-y-6 border">

                <div className='h-full bg-white rounded-lg p-6'>
                    <PageHeader title='Finished Products' addLinkHref='/finished-products/create' addLinkText='+ Add Finished Product' />

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
                        noDataMessage="No finished products yet."
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
