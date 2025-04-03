import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface AccountLedger {
    id: number;
    account_ledger_name: string;
    phone_number: string;
    opening_balance: string;
    debit_credit: string;
    reference_number: string; // Add reference_number field
    account_group?: { name: string };
    group_under?: { name: string }; // Make sure group_under is included in the model
    created_by_user?: { name: string };
}

export default function AccountLedgerIndex({ accountLedgers }: { accountLedgers: AccountLedger[] }) {
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
                router.delete(`/account-ledgers/${id}`);
                Swal.fire('Deleted!', 'The account ledger has been deleted.', 'success');
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Account Ledgers" />
            <div className="p-6 bg-gray-100">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">All List of Account Ledgers</h1>
                    <Link href="/account-ledgers/create" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                        + Add New
                    </Link>
                </div>

                {/* Make table more responsive */}
                <div className="bg-white shadow-md overflow-x-auto sm:overflow-visible sm:rounded-lg">
                    <table className="min-w-full table-auto text-sm text-left text-gray-500 dark:text-gray-400 shadow-2xl rounded-md">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3 text-center w-1/12">#</th>
                                <th className="px-4 py-3 w-2/12">Reference Number</th>
                                <th className="px-4 py-3 w-2/12">Account Name</th>
                                <th className="px-4 py-3 w-2/12">Mobile No</th>
                                <th className="px-4 py-3 w-2/12">Group Under</th>
                                <th className="px-4 py-3 w-2/12">Opening Balance</th>
                                <th className="px-4 py-3 w-2/12">Debit/Credit</th>
                                <th className="px-4 py-3 w-2/12">Created By</th>
                                <th className="px-4 py-3 text-center w-1/12">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accountLedgers.map((ledger, index) => (
                                <tr key={ledger.id} className="border-t text-gray-700 hover:bg-gray-100 dark:text-gray-200">
                                    <td className="px-4 py-2 text-center">{index + 1}</td>
                                    <td className="px-4 py-2">{ledger.reference_number}</td>
                                    <td className="px-4 py-2">{ledger.account_ledger_name}</td>
                                    <td className="px-4 py-2">{ledger.phone_number}</td>
                                    <td className="px-4 py-2">{ledger.group_under?.name || ledger.account_group?.name || 'N/A'}</td>
                                    <td className="px-4 py-2">{parseFloat(ledger.opening_balance).toLocaleString()}</td>
                                    <td className="px-4 py-2 capitalize">{ledger.debit_credit}</td>
                                    <td className="px-4 py-2">{ledger.creator?.name || 'N/A'}</td>

                                    <td className="flex justify-center space-x-2 px-4 py-2">
                                        <Link
                                            href={`/account-ledgers/${ledger.id}/edit`}
                                            className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(ledger.id)}
                                            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
