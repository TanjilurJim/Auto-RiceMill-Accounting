import AccountLedgerForm from '@/components/Form/AccountLedgerForm';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function EditAccountLedger({
    ledger,
    accountGroups,
    groupUnders,
    isAdmin, // Receive isAdmin prop from the backend
}: {
    ledger: any;
    accountGroups: { id: number; name: string; nature?: { name: string } }[];
    groupUnders: { id: number; name: string }[];
    isAdmin: boolean; // Admin status passed from backend
}) {
    const { data, setData, put, processing, errors } = useForm({
        account_ledger_name: ledger.account_ledger_name || '',
        phone_number: ledger.phone_number || '',
        email: ledger.email || '',
        opening_balance: ledger.opening_balance || '',
        debit_credit: ledger.debit_credit || 'debit',
        status: ledger.status || 'active',
        account_group_input: ledger.group_under_id
            ? `group_under-${ledger.group_under_id}`
            : ledger.account_group_id
                ? `account_group-${ledger.account_group_id}`
                : '',
        address: ledger.address || '',
        for_transition_mode: ledger.for_transition_mode ? true : false,
        mark_for_user: ledger.mark_for_user ? true : false,
        reference_number: ledger.reference_number || '', 
        // Include reference_number field.
        ledger_type: ledger.ledger_type || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(data); // Inspect the data being sent
        put(`/account-ledgers/${ledger.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Account Ledger" />
            <div className="h-full p-6 bg-gray-100">
                <div className="h-full p-6 rounded-lg bg-white">
                    <PageHeader title="Edit Account Ledger" addLinkHref="/account-ledgers" addLinkText="Back" />

                    <AccountLedgerForm
                        data={data}
                        setData={setData}
                        handleSubmit={handleSubmit}
                        processing={processing}
                        errors={errors}
                        groupUnders={groupUnders}
                        accountGroups={accountGroups}
                        isAdmin={isAdmin}
                        submitText="Update"
                        cancelHref="/account-ledgers"
                    />
                    
                </div>
            </div>
        </AppLayout>
    );
}
