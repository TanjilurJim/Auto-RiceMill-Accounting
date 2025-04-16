import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

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
}

export default function PurchaseIndex({ purchases }: { purchases: PaginatedPurchases }) {
    const handleDelete = (id: number) => {
        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: 'This purchase will be permanently deleted!',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#d33',
        //     cancelButtonColor: '#3085d6',
        //     confirmButtonText: 'Yes, delete it!',
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         router.delete(`/purchases/${id}`);
        //         Swal.fire('Deleted!', 'The purchase has been deleted.', 'success');
        //     }
        // });

        confirmDialog(
            {}, () => {
                router.delete(`/purchases/${id}`);
            }
        );
    };

    return (
        <AppLayout>
            <Head title="All Purchases" />
            <div className="bg-gray-100 p-4">
                {/* <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Purchase List</h1>
                    <Link href="/purchases/create" className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                        + Add New
                    </Link>
                </div> */}
                
                {/* Use the PageHeader component  */}
                <PageHeader title="Purchase List" addLinkHref="/purchases/create" />

                <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
                    <table className="min-w-full border-collapse text-[13px]">
                        <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                            <tr>
                                <th className="border px-3 py-2">SL</th>
                                <th className="border px-3 py-2">Date</th>
                                <th className="border px-3 py-2">Vch. No</th>
                                <th className="border px-3 py-2">Ledger</th>
                                <th className="border px-3 py-2">Item + Price</th>
                                <th className="border px-3 py-2">Qty (Per Item)</th>
                                <th className="border px-3 py-2">Total Qty</th>
                                <th className="border px-3 py-2">Amount (Per Item)</th>
                                <th className="border px-3 py-2">Total Amount</th>
                                <th className="border px-3 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.data.map((purchase, index) => {
                                const totalAmount = purchase.purchase_items.reduce((sum, item) => sum + (parseFloat(item.subtotal as any) || 0), 0);

                                return (
                                    <tr key={purchase.id} className="hover:bg-gray-50 border">
                                        <td className="border px-3 py-2 text-center">{index + 1}</td>
                                        <td className="border px-3 py-2">{purchase.date}</td>
                                        <td className="border px-3 py-2">{purchase.voucher_no}</td>
                                        <td className="border px-3 py-2">{purchase.account_ledger.account_ledger_name} -{purchase.account_ledger.reference_number} </td>
                                        <td className="border px-3 py-2">
                                            {purchase.purchase_items.map((item, idx) => (
                                                <div key={idx} className="mb-1">
                                                    {item.item?.item_name || 'N/A'} - {parseFloat(item.price as any).toFixed(2)} Tk
                                                </div>
                                            ))}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {purchase.purchase_items.map((item, idx) => (
                                                <div key={idx} className="mb-1">
                                                    {item.qty}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="border px-3 py-2 text-center">{purchase.total_qty}</td>
                                        <td className="border px-3 py-2">
                                            {purchase.purchase_items.map((item, idx) => (
                                                <div key={idx} className="mb-1">
                                                    {(item.qty * item.price).toFixed(2)} Tk
                                                </div>
                                            ))}
                                        </td>
                                        <td className="border px-3 py-2 text-right font-semibold">{totalAmount.toFixed(2)} Tk</td>
                                        {/* <td className="border px-3 py-2 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <Link
                                                    href={`/purchases/${purchase.id}/edit`}
                                                    className="rounded bg-purple-500 px-2 py-1 text-xs text-white hover:bg-purple-600"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(purchase.id)}
                                                    className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                                <Link
                                                    href={`/purchases/${purchase.id}/invoice`}
                                                    className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                                                >
                                                    Print
                                                </Link>
                                            </div>
                                        </td> */}
                                        <ActionButtons
                                            className='text-center'
                                            editHref={`/purchases/${purchase.id}/edit`} 
                                            onDelete={() => handleDelete(purchase.id)} 
                                            printText='Print'
                                            printHref={`/purchases/${purchase.id}/invoice`}
                                        />
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-end gap-1">
                    {purchases.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || ''}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`rounded px-3 py-1 text-sm ${
                                link.active ? 'bg-blue-600 text-white' : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
                            } ${!link.url && 'pointer-events-none opacity-50'}`}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
