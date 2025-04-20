import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Index({ contras }: any) {
    const handleDelete = (id: number) => {
        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: 'This will permanently delete this entry!',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: 'Yes, delete it!',
        //     cancelButtonText: 'Cancel',
        //     confirmButtonColor: '#d33',
        //     cancelButtonColor: '#3085d6',
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         router.delete(`/contra-add/${id}`);
        //     }
        // });

        confirmDialog(
            {}, () => {
                router.delete(`/contra-add/${id}`);
            }
        )


    };

    return (
        <AppLayout>
            <Head title="Contra Vouchers" />

            <div className="p-6">
                {/* <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Contra Entries</h1>
                    <Link href="/contra-add/create" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        + Add New
                    </Link>
                </div> */}

                <PageHeader title='Contra Entries' addLinkHref='/contra-add/create' addLinkText='+ Add New' />

                <div className="overflow-auto rounded-lg bg-white shadow">
                    <table className="min-w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Voucher No</th>
                                <th className="border p-2">From Mode</th>
                                <th className="border p-2">To Mode</th>
                                <th className="border p-2 text-right">Amount</th>
                                <th className="border p-2">Description</th>
                                <th className="border p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contras.data.map((item: any) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="border p-2">{item.date}</td>
                                    <td className="border p-2">{item.voucher_no}</td>
                                    <td className="border p-2">{item.mode_from?.mode_name || 'N/A'}</td>
                                    <td className="border p-2">{item.mode_to?.mode_name || 'N/A'}</td>
                                    <td className="border p-2 text-right">{Number(item.amount).toFixed(2)}</td>
                                    <td className="border p-2">{item.description || '—'}</td>
                                    {/* <td className="border p-2 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                href={`/contra-add/${item.id}/edit`}
                                                className="rounded bg-purple-600 px-3 py-1 text-xs text-white hover:bg-purple-700"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                            <Link
                                                href={`/contra-add/${item.voucher_no}/print`}
                                                target="_blank"
                                                className="rounded bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-700"
                                            >
                                                Print
                                            </Link>
                                        </div>
                                    </td> */}
                                    <ActionButtons
                                        editHref={`/contra-add/${item.id}/edit`} // URL for the edit action
                                        onDelete={() => handleDelete(item.id)} // Function to handle the delete action
                                        printHref={`/contra-add/${item.voucher_no}/print`} // URL for the print action
                                        printText="Print" // Custom text for the print button
                                    />
                                </tr>
                            ))}
                            {contras.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-gray-500">
                                        No entries found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    {/* <div className="mt-4 flex justify-end">
                        {contras.links.map((link: any, index: number) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                className={`mx-1 rounded px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : link.url ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400'
                                    }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div> */}
                    <Pagination links={contras.links} />
                </div>
            </div>
        </AppLayout>
    );
}
