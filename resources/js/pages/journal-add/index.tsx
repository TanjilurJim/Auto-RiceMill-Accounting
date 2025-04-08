import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Index({ journals }: any) {
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
                router.delete(`/journal-add/${id}`);
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Journal Entries" />
            <div className="p-6">
                <div className="flex justify-between mb-4">
                    <h1 className="text-xl font-bold">Journal Entries</h1>
                    <Link href="/journal-add/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        + Add New
                    </Link>
                </div>

                <div className="overflow-auto rounded shadow bg-white">
                    <table className="min-w-full text-sm border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Voucher No</th>
                                <th className="border p-2">Ledgers</th>
                                <th className="border p-2 text-right">Total Debit</th>
                                <th className="border p-2 text-right">Total Credit</th>
                                <th className="border p-2">Note</th>
                                <th className="border p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {journals.data.length > 0 ? (
                                journals.data.map((journal: any) => {
                                    // Group debits and credits together for the same voucher number
                                    const debits = journal.entries.filter((entry: any) => entry.type === 'debit');
                                    const credits = journal.entries.filter((entry: any) => entry.type === 'credit');

                                    // Calculate total debit and total credit for the journal
                                    const totalDebit = debits.reduce((sum: number, entry: any) => sum + parseFloat(entry.amount), 0);
                                    const totalCredit = credits.reduce((sum: number, entry: any) => sum + parseFloat(entry.amount), 0);

                                    // Prepare ledger names for display
                                    const debitLedgers = debits.map((entry: any) => entry.ledger?.account_ledger_name).join(', ') || '—';
                                    const creditLedgers = credits.map((entry: any) => entry.ledger?.account_ledger_name).join(', ') || '—';

                                    return (
                                        <tr key={journal.id} className="hover:bg-gray-50">
                                            <td className="border p-2">{journal.date}</td>
                                            <td className="border p-2">{journal.voucher_no}</td>
                                            <td className="border p-2">
                                                <div><strong>Debits:</strong> {debitLedgers}</div>
                                                <div><strong>Credits:</strong> {creditLedgers}</div>
                                            </td>
                                            <td className="border p-2 text-right">{totalDebit.toFixed(2)}</td>
                                            <td className="border p-2 text-right">{totalCredit.toFixed(2)}</td>
                                            <td className="border p-2">{debits[0]?.note || credits[0]?.note || '—'}</td>
                                            <td className="border p-2 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Link
                                                        href={`/journal-add/${journal.id}/edit`}
                                                        className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={`/journal-add/${journal.voucher_no}/print`}
                                                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                                                        target="_blank"
                                                    >
                                                        Print
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(journal.id)}
                                                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center p-4 text-gray-500">
                                        No journal entries found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-end">
                        {journals.links.map((link: any, index: number) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                className={`mx-1 px-3 py-1 text-sm rounded ${
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
