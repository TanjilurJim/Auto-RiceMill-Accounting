import ActionFooter from '@/components/ActionFooter';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface ReceivedMode {
    id: number;
    mode_name: string;
}

interface AccountLedger {
    id: number;
    account_ledger_name: string;
    phone_number?: string;
    opening_balance: number;
    closing_balance?: number;
}

interface ReceivedAdd {
    id: number;
    date: string;
    voucher_no: string;
    received_mode_id: number;
    account_ledger_id: number;
    amount: string;
    description: string;
    send_sms: boolean;
}

interface Props {
    receivedAdd: ReceivedAdd;
    receivedModes: ReceivedMode[];
    accountLedgers: AccountLedger[];
}

export default function Edit({ receivedAdd, receivedModes, accountLedgers }: Props) {
    const [selectedLedger, setSelectedLedger] = useState<AccountLedger | null>(null);
    const [calculatedBalance, setCalculatedBalance] = useState<number | null>(null);
    const [totalReceived, setTotalReceived] = useState<number>(0);

    const { data, setData, put, processing, errors } = useForm({
        date: receivedAdd.date,
        voucher_no: receivedAdd.voucher_no,
        received_mode_id: receivedAdd.received_mode_id.toString(),
        account_ledger_id: receivedAdd.account_ledger_id.toString(),
        amount: receivedAdd.amount,
        description: receivedAdd.description || '',
        send_sms: receivedAdd.send_sms || false,
    });

    useEffect(() => {
        const ledger = accountLedgers.find((l) => l.id.toString() === data.account_ledger_id);
        if (ledger) {
            setSelectedLedger(ledger);
            const baseBalance = ledger.closing_balance ?? ledger.opening_balance;
            const numericAmount = parseFloat(data.amount || '0');
            setCalculatedBalance(baseBalance - numericAmount);
        }
    }, [data.account_ledger_id, data.amount]);

    useEffect(() => {
        const amount = parseFloat(data.amount || '0');
        setTotalReceived(amount);
    }, [data.amount]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/received-add/${receivedAdd.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Received Voucher" />
            <div className="h-full w-screen lg:w-full">
                <div className="h-full rounded-lg p-4 md:p-12">

                    <PageHeader title='Edit Received Voucher' addLinkText='Back' addLinkHref='/received-add' />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Voucher Info */}
                        <div className="rounded-lg border bg-background p-6 shadow">
                            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-700">Voucher Details</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <InputCalendar value={data.date} label="Date" onChange={(val) => setData('date', val)} />
                                    {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Voucher No</label>
                                    <input
                                        type="text"
                                        value={data.voucher_no}
                                        onChange={(e) => setData('voucher_no', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.voucher_no && <p className="mt-1 text-xs text-red-500">{errors.voucher_no}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Mode & Ledger */}
                        <div className="rounded-lg border bg-background p-6 shadow">
                            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-700">Receive From</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Received Mode</label>
                                    <select
                                        value={data.received_mode_id}
                                        onChange={(e) => setData('received_mode_id', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Select Mode</option>
                                        {receivedModes.map((mode) => (
                                            <option key={mode.id} value={mode.id}>
                                                {mode.mode_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.received_mode_id && <p className="mt-1 text-xs text-red-500">{errors.received_mode_id}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Account Ledger</label>
                                    <select
                                        value={data.account_ledger_id}
                                        onChange={(e) => setData('account_ledger_id', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm
                                 focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Select Ledger</option>
                                        {accountLedgers.map((ledger) => (
                                            <option key={ledger.id} value={ledger.id}>
                                                {ledger.account_ledger_name}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedLedger?.phone_number && <p className="mt-1 text-sm text-gray-500">📞 {selectedLedger.phone_number}</p>}
                                    <p className="mt-1 text-sm text-blue-600">
                                        Closing Balance: {selectedLedger ? (selectedLedger.closing_balance ?? selectedLedger.opening_balance) : '—'}
                                    </p>
                                </div>
                            </div>

                            {/* Amount + Live Balance */}
                            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Amount</label>
                                    <input
                                        type="number"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold shadow focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
                                    {selectedLedger && (
                                        <p className="mt-1 text-sm text-green-600">
                                            New Balance: <strong>{calculatedBalance?.toFixed(2)}</strong>
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-end justify-end text-right text-base font-medium text-gray-800">
                                    Total Received = <span className="ml-2 text-blue-600">{totalReceived.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description & SMS */}
                        <div className="space-y-4 rounded-lg border bg-background p-6 shadow">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="form-textarea border rounded-lg w-full"
                                    rows={3}
                                />
                            </div>
                            {/* <div className="flex items-center gap-2">
                                <input type="checkbox" checked={data.send_sms} onChange={(e) => setData('send_sms', e.target.checked)} />
                                <label className="text-sm text-gray-700">Send SMS</label>
                            </div> */}
                        </div>

                        {/* Buttons */}
                        <ActionFooter
                            className='justify-end'
                            onSubmit={handleSubmit}
                            cancelHref="/received-add"
                            processing={processing}
                            submitText={processing ? 'Saving...' : 'Update Received Voucher'}
                            cancelText="Cancel"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>

    );
}
