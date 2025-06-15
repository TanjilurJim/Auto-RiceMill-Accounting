import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData } from '@/types/pagination';
import { Head, router } from '@inertiajs/react';

interface AccountLedger {
    id: number;
    account_ledger_name: string;
    phone_number: string;
    opening_balance: string;
    closing_balance?: string;
    debit_credit: string;
    reference_number: string; // Add reference_number field
    account_group?: { name: string };
    group_under?: { name: string }; // Make sure group_under is included in the model
    created_by_user?: { name: string };
}

export default function AccountLedgerIndex({ accountLedgers }: { accountLedgers: PaginatedData<AccountLedger> }) {
    const handleDelete = (id: number) => {
        // Using custom confirmDialog(alert) function
        confirmDialog({}, () => {
            router.delete(`/account-ledgers/${id}`);
        });
    };

    // Define the columns for the table
    const columns = [
        {
            header: '#',
            accessor: (_: AccountLedger, index?: number) => (index !== undefined ? index + 1 : '-'),
            className: 'text-center w-1/12',
        },
        { header: 'Reference Number', accessor: 'reference_number', className: 'w-2/12' },
        { header: 'Account Name', accessor: 'account_ledger_name', className: 'w-2/12' },
        { header: 'Mobile No', accessor: 'phone_number', className: 'w-2/12' },
        {
            header: 'Group Under',
            accessor: (row: AccountLedger) => row.group_under?.name || row.account_group?.name || 'N/A',
            className: 'w-2/12',
        },
        {
            header: 'Opening Balance',
            accessor: (row: AccountLedger) => parseFloat(row.opening_balance).toLocaleString(),
            className: 'w-2/12',
        },
        {
            header: 'Closing Balance', // column title
            accessor: (row: AccountLedger) => parseFloat(row.closing_balance ?? row.opening_balance ?? '0').toLocaleString(), // nice formatting
            className: 'w-2/12 text-right',
        },
        { header: 'Debit/Credit', accessor: 'debit_credit', className: 'capitalize w-2/12' },
        { header: 'Created By', accessor: (row: AccountLedger) => row.created_by_user?.name || 'N/A', className: 'w-2/12' },
    ];

    return (
        <AppLayout>
            <Head title="Account Ledgers" />
            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-white p-6">
                    {/* Use the PageHeader component */}
                    <PageHeader title="All List of Account Ledgers" addLinkHref="/account-ledgers/create" addLinkText="+ Add New" />

                    {/* Make table more responsive */}
                    <TableComponent
                        columns={columns}
                        data={accountLedgers.data}
                        actions={(ledger) => (
                            <ActionButtons editHref={`/account-ledgers/${ledger.id}/edit`} onDelete={() => handleDelete(ledger.id)} />
                        )}
                        noDataMessage="No account ledgers found."
                    />

                    {/* Pagination links */}
                    <div className="mt-6 flex justify-end space-x-1">
                        {accountLedgers.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => link.url && router.visit(link.url)}
                                disabled={!link.url}
                                className={`rounded border px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} ${link.url ? 'hover:bg-blue-100' : 'cursor-not-allowed text-gray-400'} transition duration-150 ease-in-out`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
