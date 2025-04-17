// resources/js/pages/items/index.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface Item {
    id: number;
    item_name: string;
    item_code: string;
    item_part: string;
    purchase_price: number;
    sale_price: number;
    previous_stock: number;
    total_previous_stock_value: number;
    description: string;
    created_by_user?: { name: string };
    category?: { name: string };
    unit?: { name: string };
    godown?: { name: string };
}

interface PaginatedItems {
    data: Item[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function ItemIndex({ items }: { items: PaginatedItems }) {
    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/items/${id}`);
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Items" />
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">All Items</h1>
                    <Link href="/items/create" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                        + Add Item
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-lg bg-white shadow">
                    <table className="min-w-full border-collapse border border-gray-200 text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2">#</th>
                                <th className="border px-4 py-2">Item Name</th>
                                <th className="border px-4 py-2">Item Code</th>
                                <th className="border px-4 py-2">Category</th>
                                <th className="border px-4 py-2">Unit</th>
                                <th className="border px-4 py-2">Purchase Price</th>
                                <th className="border px-4 py-2">Sales Price</th>
                                <th className="border px-4 py-2">Stock</th>
                                <th className="border px-4 py-2">Created By</th>
                                <th className="border px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.data.map((item, idx) => (
                                <tr key={item.id} className="border-t hover:bg-gray-100">
                                    <td className="border px-4 py-2">{idx + 1}</td>
                                    <td className="border px-4 py-2">{item.item_name}</td>
                                    <td className="border px-4 py-2">{item.item_code}</td>
                                    <td className="border px-4 py-2">{item.category?.name || 'N/A'}</td>
                                    <td className="border px-4 py-2">{item.unit?.name || 'N/A'}</td>
                                    <td className="border px-4 py-2">{item.purchase_price}</td>
                                    <td className="border px-4 py-2">{item.sale_price}</td>
                                    <td className="border px-4 py-2">{item.current_stock ?? 0}</td>
                                    <td className="border px-4 py-2">{item.creator?.name || 'N/A'}</td>

                                    <td className="flex justify-center gap-2 border px-4 py-2">
                                        <Link
                                            href={`/items/${item.id}/edit`}
                                            className="rounded bg-purple-500 px-3 py-1 text-xs text-white hover:bg-purple-600"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-end gap-1">
                        {items.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || ''}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded px-3 py-1 text-sm ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
                                } ${!link.url && 'pointer-events-none opacity-50'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
