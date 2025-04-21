import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputCheckbox from '@/components/Btn&Link/InputCheckbox';
import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import React from 'react';
import AccountLedgerForm from '@/components/Form/AccountLedgerForm';

export default function CreateAccountLedger({
    groupUnders,
    accountGroups,
    isAdmin,
    reference_number,
}: {
    groupUnders: { id: number; name: string }[];
    accountGroups: { id: number; name: string; nature: { name: string } | null }[];
    isAdmin: boolean; // Admin status passed from backend
    reference_number: string;
}) {
    const { data, setData, post, processing, errors } = useForm({
        account_ledger_name: '',
        phone_number: '',
        email: '',
        opening_balance: '',
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
        post('/account-ledgers');
    };

    return (
        <AppLayout>
            <Head title="Add Account Ledger" />
            <div className="flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-4xl p-6">
                    <PageHeader title='Add Account Ledger' addLinkHref='/account-ledgers' addLinkText='Back' />

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
