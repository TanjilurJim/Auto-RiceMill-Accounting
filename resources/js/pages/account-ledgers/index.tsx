import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

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
            className: 'text-center w-1/12' 
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
        { header: 'Debit/Credit', accessor: 'debit_credit', className: 'capitalize w-2/12' },
        { header: 'Created By', accessor: (row: AccountLedger) => row.created_by_user?.name || 'N/A', className: 'w-2/12' },
    ];

    return (
        <AppLayout>
            <Head title="Account Ledgers" />
            <div className="p-6 w-screen lg:w-full bg-gray-100">
                {/* Use the PageHeader component */}
                <PageHeader title='All List of Account Ledgers' addLinkHref='/account-ledgers/create' addLinkText="+ Add New"/>

                {/* Make table more responsive */}
                <TableComponent
                    columns={columns}
                    data={accountLedgers}
                    actions={(ledger) => (
                        <ActionButtons
                            editHref={`/account-ledgers/${ledger.id}/edit`}
                            onDelete={() => handleDelete(ledger.id)}
                        />
                    )}
                    noDataMessage="No account ledgers found."
                />
            </div>
        </AppLayout>
    );
}
