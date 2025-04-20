import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface ReturnItem {
    id: number;
    date: string;
    return_voucher_no: string;
    account_ledger: { account_ledger_name: string };
    godown: { name: string };
    return_items: { item: { item_name: string } | null; qty: number; subtotal: number }[];
    total_qty: number;
    grand_total: number;
}

interface PaginatedReturns {
    data: ReturnItem[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function PurchaseReturnIndex({ returns }: { returns: PaginatedReturns }) {
    const handleDelete = (id: number) => {
        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: 'This return will be permanently deleted!',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#d33',
        //     cancelButtonColor: '#3085d6',
        //     confirmButtonText: 'Yes, delete it!',
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         router.delete(`/purchase-returns/${id}`);
        //         Swal.fire('Deleted!', 'The return has been deleted.', 'success');
        //     }
        // });

        confirmDialog(
            {}, () => {
                router.delete(`/purchase-returns/${id}`);
            }
        );
            

    };

    return (
        <AppLayout>
            <Head title="All Purchase Returns" />
            <div className="bg-gray-100 p-4">
                {/* <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Purchase Return List</h1>
                    <Link
                        href="/purchase-returns/create"
                        className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                        + Add Return
                    </Link>
                </div> */}

                <PageHeader title='Purchase Return List' addLinkHref='/purchase-returns/create' addLinkText='+ Add Return' />

                <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
                    <table className="min-w-full border-collapse text-[13px]">
                        <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                            <tr>
                                <th className="border px-3 py-2">SL</th>
                                <th className="border px-3 py-2">Date</th>
                                <th className="border px-3 py-2">Return Vch. No</th>
                                <th className="border px-3 py-2">Ledger</th>
                                <th className="border px-3 py-2">Godown</th>
                                <th className="border px-3 py-2">Item + Qty</th>
                                <th className="border px-3 py-2">Total Qty</th>
                                <th className="border px-3 py-2">Return Value</th>
                                <th className="border px-3 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returns.data.map((ret, index) => {
                                const totalAmount = ret.return_items.reduce((sum, item) => sum + (parseFloat(item.subtotal as any) || 0), 0);

                                return (
                                    <tr key={ret.id} className="hover:bg-gray-50 border">
                                        <td className="border px-3 py-2 text-center">{index + 1}</td>
                                        <td className="border px-3 py-2">{ret.date}</td>
                                        <td className="border px-3 py-2">{ret.return_voucher_no}</td>
                                        <td className="border px-3 py-2">{ret.account_ledger.account_ledger_name}</td>
                                        <td className="border px-3 py-2">{ret.godown.name}</td>
                                        <td className="border px-3 py-2">
                                            {ret.return_items.map((item, idx) => (
                                                <div key={idx} className="mb-1">
                                                    {item.item?.item_name || 'N/A'} - {item.qty}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="border px-3 py-2 text-center">{ret.total_qty}</td>
                                        <td className="border px-3 py-2 text-right font-semibold">{totalAmount.toFixed(2)} Tk</td>
                                        {/* <td className="border px-3 py-2 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <Link
                                                    href={`/purchase-returns/${ret.id}/edit`}
                                                    className="rounded bg-purple-500 px-2 py-1 text-xs text-white hover:bg-purple-600"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(ret.id)}
                                                    className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                                
                                                <Link
                                                    href={`/purchase-returns/${ret.id}/invoice`}
                                                    className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                                                >
                                                    Print
                                                </Link>
                                            </div>
                                        </td> */}
                                        <ActionButtons
                                            editHref={`/purchase-returns/${ret.id}/edit`} // URL for the edit action
                                            onDelete={() => handleDelete(ret.id)} // Function to handle the delete action
                                            printText='Print' // Text for the print button
                                            printHref={`/purchase-returns/${ret.id}/invoice`} // URL for the print action
                                        />
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {/* <div className="mt-4 flex justify-end gap-1">
                    {returns.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || ''}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
                                } ${!link.url && 'pointer-events-none opacity-50'}`}
                        />
                    ))}
                </div> */}
                <Pagination links={returns.links} />
            </div>
        </AppLayout>
    );
}
