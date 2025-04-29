import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import React from 'react';

interface ReceivedModeProps {
    receivedMode: {
        id: number;
        mode_name: string;
        opening_balance: string;
        closing_balance: string;
        phone_number: string;
        ledger_id: string;
    };
    ledgers: {
        id: number;
        account_ledger_name: string;
        reference_number: string;
    }[];
}

export default function Edit({ receivedMode }: ReceivedModeProps) {
    const { data, setData, put, processing, errors } = useForm({
        mode_name: receivedMode.mode_name || '',
        opening_balance: receivedMode.opening_balance || '',
        closing_balance: receivedMode.closing_balance || '',
        phone_number: receivedMode.phone_number || '',
        ledger_id: receivedMode.ledger_id || '',
    });
    const { ledgers } = usePage().props;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/received-modes/${receivedMode.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Received Mode" />

            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">

                    <PageHeader title='Edit Received Mode' addLinkText='Back' addLinkHref='/received-modes' />

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
                                    />
                                    {errors.phone_number && <p className="mt-1 text-xs text-red-500">{errors.phone_number}</p>}
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
                                    />
                                    {errors.closing_balance && <p className="mt-1 text-xs text-red-500">{errors.closing_balance}</p>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Ledger</label>
                            <select
                                value={data.ledger_id}
                                onChange={(e) => setData('ledger_id', e.target.value)}
                                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
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

                        {/* Sticky Action Bar */}
                        <ActionFooter
                            onSubmit={handleSubmit}
                            cancelHref="/received-modes"
                            processing={processing}
                            submitText="Update Received Mode"
                        />
                    </form>
                </div>
            </div>


        </AppLayout>
    );
}
