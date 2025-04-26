import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

interface ReceivedMode {
    id: number;
    mode_name: string;
    ledger_id: number;
}

interface AccountLedger {
    id: number;
    account_ledger_name: string;
    phone_number?: string;
    opening_balance: number;
    closing_balance?: number;
}

interface Props {
    receivedModes: ReceivedMode[];
    accountLedgers: AccountLedger[];
}

export default function Create({ receivedModes, accountLedgers }: Props) {
    const today = dayjs().format('YYYY-MM-DD');
    const [selectedLedger, setSelectedLedger] = useState<AccountLedger | null>(null);
    const [calculatedBalance, setCalculatedBalance] = useState<number | null>(null);
    const [selectedModeLedger, setSelectedModeLedger] = useState<AccountLedger | null>(null);
    const [modeLedgerNewBalance, setModeLedgerNewBalance] = useState<number | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        date: today,
        voucher_no: `RV-${Math.floor(100000 + Math.random() * 900000)}`,
        received_mode_id: '',
        account_ledger_id: '',
        amount: '',
        description: '',
        send_sms: false,
    });

    useEffect(() => {
        const ledger = accountLedgers.find((l) => l.id.toString() === data.account_ledger_id);
        if (ledger) {
            setSelectedLedger(ledger);
            const baseBalance = ledger.closing_balance ?? ledger.opening_balance;
            const amount = parseFloat(data.amount || '0');
            setCalculatedBalance(!isNaN(amount) ? baseBalance - amount : null); // Recalculate balance after amount changes
        }
    }, [data.account_ledger_id, data.amount]); // Trigger when either account_ledger_id or amount changes

    useEffect(() => {
        const selectedMode = receivedModes.find((mode) => mode.id.toString() === data.received_mode_id);
        const modeLedger = accountLedgers.find((l) => l.id === selectedMode?.ledger_id);

        console.log('Selected Mode Ledger:', modeLedger);

        setSelectedModeLedger(modeLedger ?? null);

        if (modeLedger) {
            // Convert opening_balance and closing_balance to numbers
            const baseBalance = parseFloat(modeLedger.closing_balance ?? modeLedger.opening_balance ?? '0');

            const amount = parseFloat(data.amount || '0');
            const newBalance = !isNaN(amount) ? baseBalance + amount : null;
            setModeLedgerNewBalance(newBalance);

            console.log('Updated Mode Ledger New Balance:', newBalance);
        } else {
            setModeLedgerNewBalance(null);
        }
    }, [data.received_mode_id, data.amount]); // Trigger when either received_mode_id or amount changes

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/received-add');
    };

    return (
        <AppLayout>
            <Head title="Add Received Voucher" />

            <div className="space-y-6 p-6 bg-gray-100">
                {/* <h1 className="border-b pb-3 text-xl font-semibold text-gray-800">Add Received Voucher</h1> */}
                <PageHeader title="Add Received Voucher" addLinkHref="/received-add" addLinkText="Back" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Voucher Details */}
                    <div className="rounded-lg border bg-white p-6 shadow">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-700">Voucher Details</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Date<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="w-full rounded border px-4 py-2 text-sm"
                                />
                                {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Voucher No<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.voucher_no}
                                    onChange={(e) => setData('voucher_no', e.target.value)}
                                    className="w-full rounded border px-4 py-2 text-sm"
                                />
                                {errors.voucher_no && <p className="text-xs text-red-500">{errors.voucher_no}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Mode & Ledger Block */}
                    {/* Mode & Ledger Block */}
                    <div className="rounded-lg border bg-white p-6 shadow">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-700">Receive From</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Received Mode */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Received Mode<span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.received_mode_id}
                                    onChange={(e) => setData('received_mode_id', e.target.value)}
                                    className="w-full rounded border px-4 py-2 text-sm"
                                >
                                    <option value="">Select Mode</option>
                                    {receivedModes.map((mode) => (
                                        <option key={mode.id} value={mode.id}>
                                            {mode.mode_name}
                                        </option>
                                    ))}
                                </select>
                                {selectedModeLedger && (
                                    <div className="mt-1 space-y-1 text-sm">
                                        <p className="text-indigo-600">
                                            Mode Ledger Closing Balance:{' '}
                                            {parseFloat(
                                                selectedModeLedger.closing_balance?.toString() ??
                                                    selectedModeLedger.opening_balance?.toString() ??
                                                    '0',
                                            ).toFixed(2)}
                                        </p>
                                        {typeof modeLedgerNewBalance === 'number' && (
                                            <p className="text-green-600">
                                                Mode Ledger New Balance After Receive: <strong>{modeLedgerNewBalance.toFixed(2)}</strong>
                                            </p>
                                        )}
                                    </div>
                                )}

                                {errors.received_mode_id && <p className="text-xs text-red-500">{errors.received_mode_id}</p>}
                            </div>

                            {/* From Account Ledger */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Account Ledger<span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.account_ledger_id}
                                    onChange={(e) => setData('account_ledger_id', e.target.value)}
                                    className="w-full rounded border px-4 py-2 text-sm"
                                >
                                    <option value="">Select Ledger</option>
                                    {accountLedgers.map((ledger) => (
                                        <option key={ledger.id} value={ledger.id}>
                                            {ledger.account_ledger_name}
                                        </option>
                                    ))}
                                </select>
                                {selectedLedger?.phone_number && <p className="text-sm text-gray-500">📞 {selectedLedger.phone_number}</p>}
                                <p className="text-sm text-blue-600">
                                    Closing Balance:{' '}
                                    {selectedLedger ? parseFloat(selectedLedger.closing_balance ?? selectedLedger.opening_balance).toFixed(2) : '—'}
                                </p>
                                {typeof calculatedBalance === 'number' && (
                                    <p className="text-sm text-green-600">
                                        New Balance After Payment: <strong>{calculatedBalance.toFixed(2)}</strong>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Amount & Note */}
                    <div className="space-y-4 rounded-lg border bg-white p-6 shadow">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Amount<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                pattern="\d+(\.\d{1,2})?"
                                inputMode="decimal"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className="w-full rounded border px-4 py-2 text-sm font-semibold"
                                placeholder="0.00"
                            />
                            {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded border px-4 py-2 text-sm"
                                rows={3}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" checked={data.send_sms} onChange={(e) => setData('send_sms', e.target.checked)} />
                            <label className="text-sm text-gray-700">Send SMS</label>
                        </div>
                    </div>

                    {/* Buttons */}
                    {/* <div className="flex justify-end gap-3 border-t pt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700"
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" className="rounded bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700">
                            Save & Print
                        </button>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="rounded bg-gray-100 px-6 py-2 font-medium text-gray-700 hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                    </div> */}
                    <ActionFooter
                        className="justify-end"
                        onSubmit={handleSubmit} // Function to handle form submission
                        cancelHref="/received-add" // URL for the cancel action
                        processing={processing} // Indicates whether the form is processing
                        submitText={processing ? 'Saving...' : 'Save Received Voucher'} // Text for the submit button
                        cancelText="Cancel" // Text for the cancel button
                    />
                </form>
            </div>
        </AppLayout>
    );
}
