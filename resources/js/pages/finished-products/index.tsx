import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FiEdit, FiEye, FiTrash } from 'react-icons/fi';
import Swal from 'sweetalert2';

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
        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: 'This finished product entry will be deleted!',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#d33',
        //     cancelButtonColor: '#3085d6',
        //     confirmButtonText: 'Yes, delete it!',
        // }).then((res) => {
        //     if (res.isConfirmed) {
        //         router.delete(`/finished-products/${id}`, {
        //             onSuccess: () => Swal.fire('Deleted!', 'Entry deleted.', 'success'),
        //         });
        //     }
        // });

        confirmDialog(
            {},() => {
                router.delete(`/finished-products/${id}`);
            }
        )


    };

    return (
        <AppLayout>
            <Head title="Finished Products" />

            <div className="mx-auto max-w-6xl px-6 py-8 bg-gray-100 shadow-xl rounded-xl space-y-6">
                {/* Header */}
                {/* <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold text-gray-800">Finished Products</h1>
                    <Link
                        href="/finished-products/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow"
                    >
                        + Add Finished Product
                    </Link>
                </div> */}

                <PageHeader title='Finished Products' addLinkHref='/finished-products/create' addLinkText='+ Add Finished Product' />

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white shadow">
                    <table className="min-w-full text-sm text-gray-800">
                        <thead className="bg-gray-200 text-left text-gray-700">
                            <tr>
                                <th className="px-4 py-3">Voucher No</th>
                                <th className="px-4 py-3">Production Date</th>
                                <th className="px-4 py-3">Working Order</th>
                                <th className="px-4 py-3">Items</th>
                                <th className="px-4 py-3 text-right">Total Qty</th>
                                <th className="px-4 py-3 text-right">Total Amount</th>
                                <th className="px-4 py-3">Note</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.length ? (
                                products.map((fp) => {
                                    const totalQty = fp.items.reduce((t, r) => t + Number(r.quantity), 0);
                                    const totalAmount = fp.items.reduce((t, r) => t + Number(r.total), 0);
                                    const itemLines = fp.items.map((r) => `${r.product.item_name} (${r.quantity}) from ${r.godown.name}`);

                                    return (
                                        <tr key={fp.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-semibold text-indigo-700">{fp.production_voucher_no}</td>
                                            <td className="px-4 py-3">{fp.production_date}</td>
                                            <td className="px-4 py-3 text-sm">
                                                {fp.working_order?.voucher_no} <br />
                                                <span className="text-xs text-gray-500">{fp.working_order?.date}</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-pre-line text-gray-800 text-xs">
                                                {itemLines.join('\n')}
                                            </td>
                                            <td className="px-4 py-3 text-right">{totalQty.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right">{totalAmount.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{fp.remarks || '—'}</td>
                                            {/* <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Link
                                                        href={`/finished-products/${fp.id}`}
                                                        className="bg-blue-600 p-2 text-white rounded-full hover:bg-blue-700"
                                                    >
                                                        <FiEye />
                                                    </Link>
                                                    <Link
                                                        href={`/finished-products/${fp.id}/edit`}
                                                        className="bg-yellow-500 p-2 text-white rounded-full hover:bg-yellow-600"
                                                    >
                                                        <FiEdit />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(fp.id)}
                                                        className="bg-red-600 p-2 text-white rounded-full hover:bg-red-700"
                                                    >
                                                        <FiTrash />
                                                    </button>
                                                </div>
                                            </td> */}
                                            <ActionButtons
                                                editHref={`/finished-products/${fp.id}/edit`}
                                                onDelete={() => handleDelete(fp.id)}
                                                printHref={`/finished-products/${fp.id}`}
                                                editText={<FiEdit />}
                                                deleteText={<FiTrash />}
                                                printText={<FiEye />}
                                            />
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                                        No finished products yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
                    <span>
                        Page {finishedProducts.current_page} of {finishedProducts.last_page}
                    </span>
                    <span>Total: {finishedProducts.total}</span>
                </div>
                <Pagination links={finishedProducts.links} />
            </div>
        </AppLayout>
    );
}
