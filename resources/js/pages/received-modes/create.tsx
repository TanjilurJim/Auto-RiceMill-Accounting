import AppLayout from '@/layouts/app-layout';
import { AccountLedger, PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

import React from 'react';

export default function Create() {
    // Form data initialization
    const { data, setData, post, processing, errors } = useForm({
        mode_name: '',
        amount_received: '',
        amount_paid: '',
        transaction_date: '',
        phone_number: '',
        ledger_id: '',
    });

    // Fetch available ledgers
    const { ledgers } = usePage<PageProps<{ ledgers: AccountLedger[] }>>().props;

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/received-modes');
    };

    return (
        <AppLayout>
            <Head title="Create Received Mode" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <h1 className="text-2xl font-semibold text-gray-800">Create Received Mode</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-lg border bg-white p-6 shadow">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-700">Mode Information</h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Mode Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Mode Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.mode_name}
                                    onChange={(e) => setData('mode_name', e.target.value)}
                                    className="focus:ring-opacity-50 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="e.g., Cash, bKash, Bank Transfer"
                                />
                                {errors.mode_name && <p className="mt-1 text-xs text-red-500">{errors.mode_name}</p>}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    className="focus:ring-opacity-50 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="Optional"
                                />
                                {errors.phone_number && <p className="mt-1 text-xs text-red-500">{errors.phone_number}</p>}
                            </div>

                            {/* Ledger Selection */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Ledger</label>
                                <select
                                    value={data.ledger_id}
                                    onChange={(e) => setData('ledger_id', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                >
                                    <option value="">Select Ledger</option>
                                    {ledgers.map((ledger) => (
                                        <option key={ledger.id} value={ledger.id}>
                                            {ledger.account_ledger_name} ({ledger.reference_number})
                                        </option>
                                    ))}
                                </select>
                                {errors.ledger_id && <p className="mt-1 text-xs text-red-500">{errors.ledger_id}</p>}
                            </div>

                            {/* Amount Received */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Amount Received<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.amount_received || ''} // Allow blank if null
                                    onChange={(e) => setData('amount_received', e.target.value)}
                                    className="focus:ring-opacity-50 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="Optional"
                                />
                                {errors.amount_received && <p className="mt-1 text-xs text-red-500">{errors.amount_received}</p>}
                            </div>

                            {/* Amount Paid */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Amount Paid<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.00"
                                    value={data.amount_paid}
                                    onChange={(e) => setData('amount_paid', e.target.value)}
                                    className="focus:ring-opacity-50 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="0.00"
                                />
                                {errors.amount_paid && <p className="mt-1 text-xs text-red-500">{errors.amount_paid}</p>}
                            </div>

                            {/* Transaction Date */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Transaction Date<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.transaction_date}
                                    onChange={(e) => setData('transaction_date', e.target.value)}
                                    className="focus:ring-opacity-50 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                />
                                {errors.transaction_date && <p className="mt-1 text-xs text-red-500">{errors.transaction_date}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sticky Action Bar */}
                    <div className="sticky bottom-0 left-0 z-10 flex justify-end border-t bg-white p-4 pt-4 shadow-sm">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            {processing ? 'Saving...' : 'Save Received Mode'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
