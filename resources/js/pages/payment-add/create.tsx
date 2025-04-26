import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

export default function Create({ paymentModes, accountLedgers }: any) {
    const [rows, setRows] = useState([
        {
            payment_mode_id: '',
            account_ledger_id: '',
            amount: '',
            payment_balance: 0,
            ledger_balance: 0,
        },
    ]);
    const [voucherNo, setVoucherNo] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [sendSms, setSendSms] = useState(false);

    const totalAmount = rows.reduce((acc, row) => acc + parseFloat(row.amount || 0), 0);

    useEffect(() => {
        const today = new Date().toISOString().slice(0, 10);
        setDate(today);
        const rand = Math.floor(Math.random() * 10000);
        setVoucherNo(`PMT-${today.replace(/-/g, '')}-${rand}`);
    }, []);

    const handleChange = (index: number, field: string, value: any) => {
        const newRows = [...rows];
        newRows[index][field] = value;

        if (field === 'payment_mode_id') {
            const selected = paymentModes.find((m: any) => m.id === parseInt(value));
            const balance = Number(selected?.ledger?.closing_balance ?? 0);
            newRows[index].payment_balance = balance;
        }

        if (field === 'account_ledger_id') {
            const selected = accountLedgers.find((l: any) => l.id === parseInt(value));
            const balance = Number(selected?.closing_balance ?? selected?.opening_balance ?? 0);
            newRows[index].ledger_balance = balance;
        }

        if (field === 'amount') {
            const amount = parseFloat(value) || 0;
            const currentLedger = accountLedgers.find((l: any) => l.id === parseInt(newRows[index].account_ledger_id));
            const base = Number(currentLedger?.closing_balance ?? currentLedger?.opening_balance ?? 0);
            newRows[index].ledger_balance = base + amount;
        }

        setRows(newRows);
    };

    const addRow = () => {
        setRows([
            ...rows,
            {
                payment_mode_id: '',
                account_ledger_id: '',
                amount: '',
                payment_balance: 0,
                ledger_balance: 0,
            },
        ]);
    };

    const removeRow = (index: number) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post('/payment-add', {
            date,
            voucher_no: voucherNo,
            description,
            send_sms: sendSms,
            rows,
        });
    };

    return (
        <AppLayout>
            <Head title="Add Payment" />

            <div className="p-6 bg-gray-100">
                <PageHeader title="Add Payment" addLinkHref="/payment-add" addLinkText="Back" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Date Field */}
                        <div>
                            <label className="mb-1 block font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring focus:ring-primary focus:border-primary"
                            />
                        </div>

                        {/* Voucher No Field */}
                        <div>
                            <label className="mb-1 block font-medium text-gray-700">Voucher No</label>
                            <input
                                type="text"
                                value={voucherNo}
                                readOnly
                                className="w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block font-medium text-gray-700">Payments</label>

                        <div className="mb-4 rounded border border-gray-300 bg-white p-4 shadow-xl">
                            <div className="mb-2 hidden grid-cols-5 gap-4 text-xs font-semibold text-gray-600 text-center md:grid">
                                <div>Payment Mode</div>
                                <div>Account Ledger</div>
                                <div>Amount</div>
                                <div>New Ledger Balance</div>
                                <div>Remove</div>
                            </div>

                            {rows.map((row, index) => (
                                <div
                                    key={index}
                                    className="mb-2 grid grid-cols-1 gap-4 items-center md:grid-cols-5 md:gap-4"
                                >
                                    {/* Payment Mode */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 md:hidden">Payment Mode</label>
                                        <select
                                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring focus:ring-primary focus:border-primary"
                                            value={row.payment_mode_id}
                                            onChange={(e) => handleChange(index, 'payment_mode_id', e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            {paymentModes.map((mode: any) => (
                                                <option key={mode.id} value={mode.id}>
                                                    {mode.mode_name} ({Number(mode?.ledger?.closing_balance ?? 0).toFixed(2)})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Account Ledger */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 md:hidden">Account Ledger</label>
                                        <select
                                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring focus:ring-primary focus:border-primary"
                                            value={row.account_ledger_id}
                                            onChange={(e) => handleChange(index, 'account_ledger_id', e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            {accountLedgers.map((ledger: any) => (
                                                <option key={ledger.id} value={ledger.id}>
                                                    {ledger.account_ledger_name} (
                                                    {Number(ledger.closing_balance ?? ledger.opening_balance ?? 0).toFixed(2)})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 md:hidden">Amount</label>
                                        <input
                                            type="number"
                                            value={row.amount}
                                            onChange={(e) => handleChange(index, 'amount', e.target.value)}
                                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring focus:ring-primary focus:border-primary"
                                        />
                                    </div>

                                    {/* New Ledger Balance */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 md:hidden">New Ledger Balance</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={row.ledger_balance.toFixed(2)}
                                            className="w-full rounded border border-gray-300 bg-gray-100 px-2 py-1 text-right text-sm text-gray-500"
                                        />
                                    </div>

                                    {/* Remove Button */}
                                    <div className="text-center">
                                        <label className="block text-xs font-semibold text-gray-600 md:hidden">Remove</label>
                                        <button
                                            type="button"
                                            onClick={() => removeRow(index)}
                                            disabled={rows.length === 1}
                                            className={`text-lg font-bold ${
                                                rows.length === 1
                                                    ? 'cursor-not-allowed text-gray-300'
                                                    : 'text-red-600 hover:text-red-800'
                                            }`}
                                            title={rows.length === 1 ? 'Cannot remove the last row' : 'Remove this row'}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addRow}
                            className="text-sm text-primary hover:text-primary-hover"
                        >
                            + Add Row
                        </button>
                    </div>

                    <div>
                        <label className="mb-1 block font-medium text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:ring focus:ring-primary focus:border-primary"
                            rows={4}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={sendSms}
                            onChange={(e) => setSendSms(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring focus:ring-primary"
                        />
                        <label className="text-sm text-gray-700">Send SMS</label>
                    </div>

                    <div className="text-right font-bold text-gray-700">Total: {totalAmount.toFixed(2)}</div>

                    <ActionFooter
                        className="justify-end"
                        onSubmit={handleSubmit}
                        cancelHref="/payment-add"
                        processing={false}
                        submitText="Save Payment"
                        cancelText="Cancel"
                    />
                </form>
            </div>
        </AppLayout>
    );
}
