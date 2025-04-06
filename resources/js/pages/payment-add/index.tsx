import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Props {
    paymentAdds: any;
    filters: {
        search?: string;
        payment_mode_id?: string;
        from_date?: string;
        to_date?: string;
    };
    paymentModes: any[];
}

export default function Index({ paymentAdds, filters, paymentModes }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [paymentModeId, setPaymentModeId] = useState(filters.payment_mode_id || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');

    // 🔁 Live search effect
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(route('payment-add.index'), {
                search,
                payment_mode_id: paymentModeId,
                from_date: fromDate,
                to_date: toDate,
            }, {
                preserveState: true,
                replace: true,
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, paymentModeId, fromDate, toDate]);

    const handleDelete = (id: number) => {
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
                router.delete(`/payment-add/${id}`);
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Payment List" />

            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">All List of Payments</h1>
                    <Link href="/payment-add/create" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        + Add New
                    </Link>
                </div>

                {/* ✅ Filters */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search voucher or ledger..."
                        className="rounded border px-3 py-2 text-sm"
                    />
                    <select
                        value={paymentModeId}
                        onChange={(e) => setPaymentModeId(e.target.value)}
                        className="rounded border px-3 py-2 text-sm"
                    >
                        <option value="">All Payment Modes</option>
                        {paymentModes.map((mode) => (
                            <option key={mode.id} value={mode.id}>
                                {mode.mode_name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="rounded border px-3 py-2 text-sm"
                    />
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="rounded border px-3 py-2 text-sm"
                    />
                </div>

                <div className="overflow-auto rounded-lg bg-white shadow">
                    <table className="min-w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Voucher No</th>
                                <th className="border p-2">Payment Mode</th>
                                <th className="border p-2">Account Ledger</th>
                                <th className="border p-2 text-right">Amount</th>
                                <th className="border p-2">Description</th>
                                <th className="border p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentAdds.data.map((item: any) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="border p-2">{item.date}</td>
                                    <td className="border p-2">{item.voucher_no}</td>
                                    <td className="border p-2">{item.paymentMode?.mode_name || 'N/A'}</td>
                                    <td className="border p-2">
                                        {item.accountLedger?.account_ledger_name || 'N/A'}
                                        {item.accountLedger?.reference_number && ` - ${item.accountLedger.reference_number}`}
                                    </td>
                                    <td className="border p-2 text-right">{Number(item.amount).toFixed(2)}</td>
                                    <td className="border p-2">{item.description}</td>
                                    <td className="border p-2 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                href={`/payment-add/${item.id}/edit`}
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
                                                href={`/payment-add/${item.voucher_no}/print`}
                                                className="rounded bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-700"
                                            >
                                                Print
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paymentAdds.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-gray-500">
                                        No entries found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* ✅ Pagination */}
                    <div className="mt-4 flex justify-end">
                        {paymentAdds.links.map((link: any, index: number) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                className={`mx-1 rounded px-3 py-1 text-sm ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : link.url
                                        ? 'bg-gray-200 hover:bg-gray-300'
                                        : 'bg-gray-100 text-gray-400'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
