import AccountLedgerForm from '@/components/Form/AccountLedgerForm';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

export default function CreateAccountLedger({
    groupUnders,
    accountGroups,
    isAdmin,
    reference_number,
}: {
    groupUnders: { id: number; name: string }[];
    accountGroups: { id: number; name: string; nature: { name: string } | null }[];
    isAdmin: boolean;
    reference_number: string;
}) {
    const { data, setData, post, processing, errors } = useForm({
        account_ledger_name: '',
        phone_number: '',
        email: '',
        opening_balance: '',
        ledger_type: 'inventory',
        debit_credit: 'debit',
        status: 'active',
        account_group_id: '',
        address: '',
        for_transition_mode: false,
        mark_for_user: false,
        reference_number: reference_number,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.ledger_type) setData('ledger_type', 'inventory');
        post('/account-ledgers');
    };

    return (
        <AppLayout>
            <Head title="Add Account Ledger" />
            {/* Use tokens so the background flips with .dark */}
            <div className="bg-background min-h-svh p-6">
                <div className="bg-card text-card-foreground mx-auto  rounded-xl border p-6 shadow-sm">
                    <PageHeader title="Add Account Ledger" addLinkHref="/account-ledgers" addLinkText="Back" />

                    {/* Ensure the form’s inputs use your .input class or shadcn inputs so they pick up dark vars */}
                    <AccountLedgerForm
                        data={data}
                        setData={setData}
                        handleSubmit={handleSubmit}
                        processing={processing}
                        errors={errors}
                        groupUnders={groupUnders}
                        accountGroups={accountGroups}
                        isAdmin={isAdmin}
                        submitText="Create"
                        cancelHref="/account-ledgers"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
