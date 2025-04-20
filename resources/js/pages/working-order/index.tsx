import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FiEdit, FiEye, FiTrash } from 'react-icons/fi';
import Swal from 'sweetalert2';

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
        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: 'This Working Order will be permanently deleted!',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#d33',
        //     cancelButtonColor: '#3085d6',
        //     confirmButtonText: 'Yes, delete it!',
        // }).then((res) => {
        //     if (res.isConfirmed) {
        //         router.delete(`/working-orders/${id}`, {
        //             onSuccess: () => Swal.fire('Deleted!', 'The Working Order has been deleted.', 'success'),
        //         });
        //     }
        // });

        confirmDialog(
            {}, () => {
                router.delete(`/working-orders/${id}`);
            }
        )


    };

    return (
        <AppLayout>
            <Head title="Working Orders" />

            <div className="mx-auto w-full max-w-7xl rounded-2xl bg-gray-100 px-6 py-8 shadow-xl">
                {/* header bar */}
                {/* <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-semibold text-gray-800">Working Orders</h1>
                    <Link
                        href="/working-orders/create"
                        className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-lg transition hover:bg-blue-700"
                    >
                        + New Working Order
                    </Link>
                </div> */}

                <PageHeader title='Working Orders' addLinkHref='/working-orders/create' addLinkText='+ New Working Order' />

                {/* table */}
                <div className="rounded-xl border-r border-gray-200 shadow-sm">
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full table-fixed rounded-2xl bg-white text-sm shadow-2xl">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left border-r ">Voucher No</th>
                                    <th className="px py-3 text-left border-r">Reference</th> {/* Shrinked Reference column */}
                                    <th className="px-4 py-3 text-left border-r">Production</th>
                                    <th className="px-6 py-3 text-left">Items (Qty)</th>
                                    <th className="px-2 py-3 text-left">Godowns</th>
                                    <th className="py-3 text-right">Quantity</th>
                                    <th className="px-4 py-3 text-right">SubTotal</th>
                                    <th className="px-4 py-3 text-left">Extras</th>
                                    <th className="px-4 py-3 text-right">Total Amount</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                    <th className="w-36 px-4 py-3 text-center">Actions</th> {/* Shrinked Actions column */}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {orders.length ? (
                                    orders.map((order) => {
                                        const itemLines = order.items
                                            .filter((i) => i.item)
                                            .map((i) => `${i.item!.item_name} (${Number(i.quantity).toFixed(2)})`);

                                        const godownNames = Array.from(
                                            new Set(order.items.map((i) => i.godown?.name).filter((name): name is string => Boolean(name))),
                                        ).join(', ');

                                        const extrasLines = (order.extras ?? []).map((e) => `${e.title} (${Number(e.total).toFixed(2)})`);

                                        return (
                                            <tr key={order.id} className="border-b border-gray-200 transition hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-blue-700 border-r border-gray-300">{order.voucher_no}</td>
                                                <td className="border-r border-gray-300 px-4 py-3">{order.reference_no || '—'}</td>
                                                <td className="px-4 py-3 border-r border-gray-300">
                                                    {order.production_status === 'completed' ? (
                                                        <span className="font-semibold text-green-600">{order.production_voucher_no}</span>
                                                    ) : (
                                                        <span className="text-red-500 italic">Not at Production Yet</span>
                                                    )}
                                                </td>
                                                <td className="border-r border-gray-300 px-4 py-3 break-all whitespace-pre-line text-gray-700">
                                                    {itemLines.length ? itemLines.join('\n') : '—'}
                                                </td>
                                                <td className="px-4 py-3 text-gray-700 border-r border-gray-300">{godownNames || '—'}</td>
                                                <td className="px-4 py-3 text-right border-r border-gray-300">{Number(order.total_quantity ?? 0).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right border-r border-gray-300">{Number(order.subtotal ?? 0).toFixed(2)}</td>
                                                <td className="px-4 py-3 break-all whitespace-pre-line text-gray-700 border-r border-gray-300">
                                                    {extrasLines.length ? extrasLines.join('\n') : '—'}
                                                </td>
                                                <td className="px-4 py-3 text-right border-r border-gray-300">{Number(order.total_amount ?? 0).toFixed(2)}</td>
                                                <td className="px-4 py-3 border-r border-gray-300">{order.date}</td>
                                                {/* <td className="w-36 px-4 py-3 text-center">
                                                    <div className="flex justify-center space-x-2">
                                                        <Link
                                                            href={`/working-orders/${order.id}/edit`}
                                                            className="rounded-full bg-yellow-500 p-2 text-xs text-white transition hover:bg-yellow-600"
                                                        >
                                                            <FiEdit />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(order.id)}
                                                            className="rounded-full bg-red-600 p-2 text-xs text-white transition hover:bg-red-700"
                                                        >
                                                            <FiTrash />
                                                        </button>
                                                        <Link
                                                            href={`/working-orders/${order.id}`}
                                                            className="rounded-full bg-blue-600 p-2 text-xs text-white transition hover:bg-blue-700"
                                                        >
                                                            <FiEye />
                                                        </Link>
                                                    </div>
                                                </td> */}
                                                <ActionButtons
                                                    editHref={`/working-orders/${order.id}/edit`} // URL for the edit action
                                                    onDelete={() => handleDelete(order.id)} // Function to handle the delete action
                                                    printHref={`/working-orders/${order.id}`} // URL for the view action
                                                    editText={<FiEdit />} // Icon for the edit button
                                                    deleteText={<FiTrash />} // Icon for the delete button
                                                    printText={<FiEye />} // Icon for the view button
                                                />
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-6 text-center text-gray-500">
                                            No working orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* pagination info */}
                
                <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                    <span>
                        Page {workingOrders.current_page} of {workingOrders.last_page}
                    </span>
                    <span>Total: {workingOrders.total}</span>
                </div>

                {/* pagination links */}
                {/* Pagination */}
                {/* <div className="mt-4 flex gap-3">
                    {workingOrders.links?.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url || ''}
                            preserveScroll
                            preserveState
                            disabled={!link.url}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${link.active
                                    ? 'bg-blue-600 text-white'
                                    : !link.url
                                        ? 'cursor-not-allowed text-gray-400'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    ))}
                </div> */}
                <Pagination links={workingOrders.links} />
            </div>
        </AppLayout>
    );
}
