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
            const balance = Number(selected?.closing_balance ?? selected?.opening_balance ?? 0);
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

            <div className="p-6">
                <h1 className="mb-4 text-xl font-bold">Add Payment</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="mb-1 block font-medium">Date</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded border px-3 py-2" />
                        </div>
                        <div>
                            <label className="mb-1 block font-medium">Voucher No</label>
                            <input type="text" value={voucherNo} readOnly className="w-full rounded border bg-gray-100 px-3 py-2" />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">Payments</label>

                        <div className="mb-4 rounded border bg-gray-50 p-3">
                            <div className="mb-1 grid grid-cols-6 gap-2 text-xs font-semibold text-gray-600">
                                <div>Payment Mode</div>
                                <div>Account Ledger</div>
                                <div>Amount</div>
                                <div>New Ledger Balance</div>
                                <div>Remove</div>
                            </div>

                            {rows.map((row, index) => (
                                <div key={index} className="mb-2 grid grid-cols-6 items-center gap-2">
                                    <div>
                                        <select
                                            className="w-full rounded border px-2 py-1 text-sm"
                                            value={row.payment_mode_id}
                                            onChange={(e) => handleChange(index, 'payment_mode_id', e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            {paymentModes.map((mode: any) => (
                                                <option key={mode.id} value={mode.id}>
                                                    {mode.mode_name} ({Number(mode.closing_balance ?? mode.opening_balance ?? 0).toFixed(2)})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <select
                                            className="w-full rounded border px-2 py-1 text-sm"
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

                                    <div>
                                        <input
                                            type="number"
                                            value={row.amount}
                                            onChange={(e) => handleChange(index, 'amount', e.target.value)}
                                            className="w-full rounded border px-2 py-1 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            readOnly
                                            value={row.ledger_balance.toFixed(2)}
                                            className="w-full rounded border bg-gray-100 px-2 py-1 text-right text-sm"
                                        />
                                    </div>

                                    <div className="text-center">
                                        <button type="button" onClick={() => removeRow(index)} className="text-lg font-bold text-red-600">
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button type="button" onClick={addRow} className="mb-2 text-sm text-blue-600">
                            + Add Row
                        </button>
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded border px-3 py-2" />
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={sendSms} onChange={(e) => setSendSms(e.target.checked)} />
                        <label className="text-sm">Send SMS</label>
                    </div>

                    <div className="text-right font-bold">Total: {totalAmount.toFixed(2)}</div>

                    <div className="flex gap-4">
                        <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                            Save
                        </button>
                        <button type="button" onClick={() => window.history.back()} className="rounded bg-gray-300 px-4 py-2">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
