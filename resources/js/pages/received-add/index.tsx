import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Index({ receivedAdds }) {
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete this entry!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/received-add/${id}`);
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Received Vouchers" />

            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">All List of Received</h1>
                    <Link href="/received-add/create" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        + Add New
                    </Link>
                </div>

                <div className="overflow-auto rounded-lg bg-white shadow">
                    <table className="min-w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Voucher No</th>
                                <th className="border p-2">Mode</th>
                                <th className="border p-2">Ledger</th>
                                <th className="border p-2 text-right">Amount</th>
                                <th className="border p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receivedAdds.data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="border p-2">{item.date}</td>
                                    <td className="border p-2">{item.voucher_no}</td>
                                    <td className="border p-2">{item.received_mode?.mode_name}</td>
                                    <td className="border p-2">
                                        {item.account_ledger?.account_ledger_name} - {item.account_ledger?.reference_number}{' '}
                                    </td>
                                    <td className="border p-2 text-right">{Number(item.amount).toFixed(2)}</td>

                                    <td className="border p-2 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                href={`/received-add/${item.id}/edit`}
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
                                                href={`/received-add/${item.id}/print`}
                                                className="rounded bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-700"
                                            >
                                                Print
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {receivedAdds.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-gray-500">
                                        No entries found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
