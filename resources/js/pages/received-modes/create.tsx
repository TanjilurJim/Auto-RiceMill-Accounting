import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { AccountLedger } from '@/types';
import React from 'react';
import PageHeader from '@/components/PageHeader';
import ActionFooter from '@/components/ActionFooter';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        mode_name: '',
        opening_balance: '',
        closing_balance: '',
        phone_number: '',
        ledger_id: '',
    });
    const { ledgers } = usePage<PageProps<{ ledgers: AccountLedger[] }>>().props;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/received-modes');
    };

    return (
        <AppLayout>
            <Head title="Create Received Mode" />

            <div className="space-y-6 p-6">
                {/* <div className="flex items-center justify-between border-b pb-4">
                    <h1 className="text-2xl font-semibold text-gray-800">Create Received Mode</h1>
                </div> */}

                <PageHeader title='Create Received Mode' addLinkHref='/received-modes' addLinkText='Back' />

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
                            {/* Opening Balance */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Opening Balance</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.opening_balance}
                                    onChange={(e) => setData('opening_balance', e.target.value)}
                                    className="focus:ring-opacity-50 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="0.00"
                                />
                                {errors.opening_balance && <p className="mt-1 text-xs text-red-500">{errors.opening_balance}</p>}
                            </div>

                            {/* Closing Balance */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Closing Balance</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.closing_balance}
                                    onChange={(e) => setData('closing_balance', e.target.value)}
                                    className="focus:ring-opacity-50 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="0.00"
                                />
                                {errors.closing_balance && <p className="mt-1 text-xs text-red-500">{errors.closing_balance}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sticky Action Bar */}
                    {/* <div className="sticky bottom-0 left-0 z-10 flex justify-end border-t bg-white p-4 pt-4 shadow-sm">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            {processing ? 'Saving...' : 'Save Received Mode'}
                        </button>
                    </div> */}
                    <ActionFooter
                        className='justify-end'
                        onSubmit={handleSubmit} // Function to handle form submission
                        cancelHref="/received-modes" // URL for the cancel action
                        processing={processing} // Indicates whether the form is processing
                        submitText={processing ? 'Saving...' : 'Save Received Mode'} // Text for the submit button
                        cancelText="Cancel" // Text for the cancel button
                    />
                </form>
            </div>
        </AppLayout>
    );
}
