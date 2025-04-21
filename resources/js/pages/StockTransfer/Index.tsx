import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { FiEdit, FiTrash, FiEye } from 'react-icons/fi'; // Icon library
import PageHeader from '@/components/PageHeader';
import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import Pagination from '@/components/Pagination';

interface Godown {
    name: string;
}
interface Item {
    id: number;
    item_name: string;
}
interface StockTransferItem {
    id: number;
    item: Item;
}
interface StockTransfer {
    id: number;
    voucher_no: string;
    reference_no?: string;
    from_godown: Godown | null;
    to_godown: Godown | null;
    total_quantity: number;
    total_amount: number;
    date: string;
    items: StockTransferItem[];
}
interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}
interface Props {
    stockTransfers: Paginated<StockTransfer>;
}

export default function Index({ stockTransfers }: Props) {
    const transfers = stockTransfers.data ?? [];

    const handleDelete = (id: number) => {
        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: 'This Stock Transfer will be permanently deleted!',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#d33',
        //     cancelButtonColor: '#3085d6',
        //     confirmButtonText: 'Yes, delete it!',
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         router.delete(`/stock-transfers/${id}`, {
        //             onSuccess: () => {
        //                 Swal.fire('Deleted!', 'The Stock Transfer has been deleted.', 'success');
        //             }
        //         });
        //     }
        // });

        confirmDialog(
            {}, () => {
                router.delete(`/stock-transfers/${id}`);
            }    
        );
    };

    return (
        <AppLayout>
            <Head title="Stock Transfers" />
            <div className="mx-auto max-w-7xl rounded-2xl bg-white p-8 shadow-xl">
                {/* <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-semibold text-gray-800">Stock Transfers</h1>
                    <Link
                        href="/stock-transfers/create"
                        className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-lg transition duration-200 hover:bg-blue-700"
                    >
                        + New Transfer
                    </Link>
                </div> */}

                <PageHeader title='Stock Transfers' addLinkHref='/stock-transfers/create' addLinkText='+ New Transfer' />

                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                    <table className="min-w-full bg-white text-sm shadow-2xl rounded-2xl">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left">Voucher No</th>
                                <th className="px-4 py-3 text-left">Reference</th>
                                <th className="px-4 py-3 text-left">Items</th>
                                <th className="px-4 py-3 text-left">From</th>
                                <th className="px-4 py-3 text-left">To</th>
                                <th className="px-4 py-3 text-right">Qty</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transfers.length > 0 ? (
                                transfers.map((transfer) => (
                                    <tr key={transfer.id} className="transition hover:bg-gray-50 broder-b border-gray-200">
                                        <td className="px-4 py-3 font-medium text-blue-700">{transfer.voucher_no}</td>
                                        <td className="px-4 py-3">{transfer.reference_no || '—'}</td>
                                        <td className="px-4 py-3 text-gray-700">{transfer.items?.map((i) => i.item?.item_name).join(', ') || '—'}</td>
                                        <td className="px-4 py-3">{transfer.from_godown?.name || '—'}</td>
                                        <td className="px-4 py-3">{transfer.to_godown?.name || '—'}</td>
                                        <td className="px-4 py-3 text-right">{Number(transfer.total_quantity).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right">{Number(transfer.total_amount).toFixed(2)}</td>
                                        <td className="px-4 py-3">{transfer.date}</td>
                                        {/* <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center space-x-4">
                                                <Link
                                                    href={`/stock-transfers/${transfer.id}/edit`}
                                                    className="rounded-full bg-yellow-500 p-2 text-xs text-white hover:bg-yellow-600 transition duration-200"
                                                >
                                                    <FiEdit />
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(transfer.id)}
                                                    className="rounded-full bg-red-600 p-2 text-xs text-white hover:bg-red-700 transition duration-200"
                                                >
                                                    <FiTrash />
                                                </button>

                                                <Link
                                                    href={`/stock-transfers/${transfer.id}`}
                                                    className="rounded-full bg-blue-600 p-2 text-xs text-white hover:bg-blue-700 transition duration-200"
                                                >
                                                    <FiEye />
                                                </Link>
                                            </div>
                                        </td> */}
                                        <ActionButtons
                                            editText={<FiEdit />}
                                            deleteText={<FiTrash />}
                                            editHref={`/stock-transfers/${transfer.id}/edit`} // URL for the edit action
                                            onDelete={() => handleDelete(transfer.id)} // Function to handle the delete action
                                            printHref={`/stock-transfers/${transfer.id}`}
                                            printText={<FiEye />} // Optional: Custom text for the print button
                                        />
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="py-6 text-center text-gray-500">
                                        No stock transfers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                    <span>
                        Page {stockTransfers.current_page} of {stockTransfers.last_page}
                    </span>
                    <span>Total: {stockTransfers.total}</span>
                </div>

                {/* Pagination */}
                {/* <div className="mt-4 flex gap-3">
                    {stockTransfers.links?.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || ''}
                            preserveScroll
                            preserveState
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition duration-200 ${link.active
                                    ? 'bg-blue-600 text-white'
                                    : !link.url
                                        ? 'cursor-not-allowed text-gray-400'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            disabled={!link.url}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    ))}
                </div> */}
                <Pagination links={stockTransfers.links} />
            </div>
        </AppLayout>
    );
}
