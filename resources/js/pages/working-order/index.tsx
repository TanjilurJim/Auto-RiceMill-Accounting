import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { FiEdit, FiEye, FiTrash } from 'react-icons/fi';

/* ─────────── Types ─────────── */
interface Godown {
    name: string;
}
interface Item {
    id: number;
    item_name: string;
}

interface WOItem {
    id: number;
    item: Item;
    godown: Godown;
    quantity: number; // ← make sure this exists in the JSON
}
interface Extra {
    id: number;
    title: string;
    total: number;
}

interface WorkingOrder {
    id: number;
    voucher_no: string;
    reference_no: string | null;
    total_quantity: string | number; // withSum
    total_amount: string | number; // withSum
    subtotal: string | number; // withSum
    date: string;
    items: WOItem[];
    extras: Extra[];
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    workingOrders: Paginated<WorkingOrder>;
}



/* ─────────── Component ─────────── */
export default function Index({ workingOrders }: Props) {
    const orders = workingOrders.data ?? [];

    const handleDelete = (id: number) => {
        confirmDialog(
            {}, () => {
                router.delete(`/working-orders/${id}`);
            }
        )


    };

    /* ─────────── Constants ─────────── */
    const columns = [
        { header: 'Voucher No', accessor: 'voucher_no', },
        { header: 'Reference', accessor: (row: any) => row.reference_no || '—', },
        {
            header: 'Production',
            accessor: (row: any) =>
                row.production_status === 'completed' ? (
                    <span className="font-semibold text-green-600">{row.production_voucher_no}</span>
                ) : (
                    <span className="text-red-500 italic">Not at Production Yet</span>
                ),
        },
        {
            header: 'Items (Qty)',
            accessor: (row: any) =>
                row.items
                    .filter((i: any) => i.item)
                    .map((i: any) => `${i.item.item_name} (${Number(i.quantity).toFixed(2)})`)
                    .join('\n') || '—',
        },
        {
            header: 'Godowns',
            accessor: (row: any) =>
                Array.from(new Set(row.items.map((i: any) => i.godown?.name).filter(Boolean))).join(', ') || '—',
        },
        { header: 'Quantity', accessor: 'total_quantity', },
        { header: 'SubTotal', accessor: 'subtotal', },
        // {
        //     header: 'Extras',
        //     accessor: (row: any) =>
        //         (row.extras ?? []).map((e: any) => `${e.title} (${Number(e.total).toFixed(2)})`).join('\n') || '—',
        // },
        { header: 'Total Amount', accessor: 'total_amount', },
        { header: 'Date', accessor: 'date', },
    ];

    return (
        <AppLayout>
            <Head title="Working Orders" />

            <div className="h-full w-screen lg:w-full border">
                <div className="h-full bg-white rounded-lg p-4 md:p-12">
                    {/* Header Bar */}
                    <PageHeader title="Working Orders" addLinkHref="/working-orders/create" addLinkText="+ New Working Order" />

                    {/* Responsive Table */}
                    <TableComponent
                        columns={columns}
                        data={orders}
                        actions={(order) => (
                            <ActionButtons
                                editHref={`/working-orders/${order.id}/edit`}
                                onDelete={() => handleDelete(order.id)}
                                printHref={`/working-orders/${order.id}`}
                                editText={<FiEdit />}
                                deleteText={<FiTrash />}
                                printText={<FiEye />}
                            />
                        )}
                        noDataMessage="No working orders found."
                    />

                    {/* Pagination Links */}
                    <Pagination
                        links={workingOrders.links}
                        currentPage={workingOrders.current_page}
                        lastPage={workingOrders.last_page}
                        total={workingOrders.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
