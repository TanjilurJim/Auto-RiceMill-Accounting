import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

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
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-4xl p-6">
                    <h1 className="mb-4 text-2xl font-bold">Add Account Ledger</h1>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded bg-white p-4 shadow md:grid-cols-2 dark:bg-neutral-900">
                        <div>
                            <label className="mb-1 block font-medium">Account Ledger Name*</label>
                            <input
                                type="text"
                                value={data.account_ledger_name}
                                onChange={(e) => setData('account_ledger_name', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.account_ledger_name && <p className="text-sm text-red-500">{errors.account_ledger_name}</p>}
                        </div>

                        <div>
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

                        {/* Reference Number field for Admin */}
                        {isAdmin && (
                            <div>
                                <label className="mb-1 block font-medium">Reference Number</label>
                                <input
                                    type="text"
                                    value={data.reference_number}
                                    onChange={(e) => setData('reference_number', e.target.value)}
                                    disabled={!isAdmin} // Admin can edit, others cannot
                                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                />
                                {errors.reference_number && <p className="text-sm text-red-500">{errors.reference_number}</p>}
                            </div>
                        )}

                        <div>
                            <label className="mb-1 block font-medium">Phone Number*</label>
                            <input
                                type="text"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">E-mail</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Opening Balance*</label>
                            <input
                                type="number"
                                value={data.opening_balance}
                                onChange={(e) => setData('opening_balance', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.opening_balance && <p className="text-sm text-red-500">{errors.opening_balance}</p>}
                        </div>

                        <div>
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

                        <div>
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

                        <div>
                            <label className="mb-1 block font-medium">Address</label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                        </div>

                        <div className="col-span-2 space-y-2">
                            {/* <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.for_transition_mode}
                                    onChange={(e) => setData('for_transition_mode', e.target.checked)}
                                />
                                For Transition Mode
                            </label> */}
                            <label className="flex items-center gap-2 font-semibold text-red-600">
                                <input
                                    type="checkbox"
                                    checked={data.mark_for_user}
                                    onChange={(e) => setData('mark_for_user', e.target.checked)}
                                    className="accent-red-600"
                                />
                                Mark for Customer
                            </label>
                        </div>

                        <div className="col-span-2 mt-4 flex justify-between">
                            <Link href="/account-ledgers" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
