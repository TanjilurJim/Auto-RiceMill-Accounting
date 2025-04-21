import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputCheckbox from '@/components/Btn&Link/InputCheckbox';
import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';

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

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-4 rounded bg-white p-4 shadow md:grid-cols-2 lg:grid-cols-3 dark:bg-neutral-900"
                    >
                        {/* Account Ledger Name */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-1">
                            <label className="mb-1 block font-medium">Account Ledger Name*</label>
                            <input
                                type="text"
                                value={data.account_ledger_name}
                                onChange={(e) => setData('account_ledger_name', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.account_ledger_name && <p className="text-sm text-red-500">{errors.account_ledger_name}</p>}
                        </div>

                        {/* Account Group */}
                        <div className="col-span-1">
                            <label className="mb-1 block font-medium">Account Group*</label>
                            <select
                                value={data.account_group_input}
                                onChange={(e) => setData('account_group_input', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="">Select Account Group</option>
                                <optgroup label="Group Unders">
                                    {groupUnders.map((group) => (
                                        <option key={`gu-${group.id}`} value={`group_under-${group.id}`}>
                                            {group.name}
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="Account Groups">
                                    {accountGroups.map((group) => (
                                        <option key={`ag-${group.id}`} value={`account_group-${group.id}`}>
                                            {group.name} {group.nature?.name ? `(${group.nature.name})` : ''}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                            {errors.account_group_id && <p className="text-sm text-red-500">{errors.account_group_id}</p>}
                        </div>

                        {/* Reference Number (Admin Only) */}
                        {isAdmin && (
                            <div className="col-span-1">
                                <label className="mb-1 block font-medium">Reference Number</label>
                                <input
                                    type="text"
                                    value={data.reference_number}
                                    onChange={(e) => setData('reference_number', e.target.value)}
                                    disabled={!isAdmin}
                                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                />
                                {errors.reference_number && <p className="text-sm text-red-500">{errors.reference_number}</p>}
                            </div>
                        )}

                        {/* Phone Number */}
                        <div className="col-span-1">
                            <label className="mb-1 block font-medium">Phone Number*</label>
                            <input
                                type="text"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                        </div>

                        {/* Email */}
                        <div className="col-span-1">
                            <label className="mb-1 block font-medium">E-mail</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        {/* Opening Balance */}
                        <div className="col-span-1">
                            <label className="mb-1 block font-medium">Opening Balance*</label>
                            <input
                                type="number"
                                value={data.opening_balance}
                                onChange={(e) => setData('opening_balance', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.opening_balance && <p className="text-sm text-red-500">{errors.opening_balance}</p>}
                        </div>

                        {/* Debit/Credit */}
                        <div className="col-span-1">
                            <label className="mb-1 block font-medium">Debit/Credit*</label>
                            <select
                                value={data.debit_credit}
                                onChange={(e) => setData('debit_credit', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="debit">Debit</option>
                                <option value="credit">Credit</option>
                            </select>
                            {errors.debit_credit && <p className="text-sm text-red-500">{errors.debit_credit}</p>}
                        </div>

                        {/* Status */}
                        <div className="col-span-1">
                            <label className="mb-1 block font-medium">Status*</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                        </div>

                        {/* Address */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                            <label className="mb-1 block font-medium">Address</label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                        </div>

                        {/* Checkboxes */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col gap-2">
                            <InputCheckbox
                                label="For Transition Mode"
                                checked={data.for_transition_mode}
                                onChange={(checked) => setData('for_transition_mode', checked)}
                            />
                            <InputCheckbox
                                label="Mark for User"
                                checked={data.mark_for_user}
                                onChange={(checked) => setData('mark_for_user', checked)}
                            />
                        </div>

                        {/* Action Footer */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                            <ActionFooter
                                className="w-full justify-end"
                                onSubmit={handleSubmit}
                                cancelHref="/account-ledgers"
                                processing={processing}
                                submitText={processing ? 'Creating...' : 'Create'}
                                cancelText="Cancel"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
