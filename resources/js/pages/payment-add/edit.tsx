import ActionFooter from '@/components/ActionFooter';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

export default function Edit({ voucher_no, date: initDate, description: initDescription, send_sms, paymentRows, paymentModes, accountLedgers }: any) {
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

    useEffect(() => {
        setVoucherNo(voucher_no);
        setDate(initDate);
        setDescription(initDescription);
        setSendSms(send_sms);

        // Convert paymentRows to rows with balances
        const formattedRows = paymentRows.map((p: any) => {
            const pm = paymentModes.find((m: any) => m.id === p.payment_mode_id);
            const al = accountLedgers.find((l: any) => l.id === p.account_ledger_id);

            return {
                payment_mode_id: p.payment_mode_id,
                account_ledger_id: p.account_ledger_id,
                amount: p.amount,
                payment_balance: Number(pm?.ledger?.closing_balance ?? 0),
                ledger_balance: Number(al?.closing_balance ?? 0) + Number(p.amount),
            };
        });

        setRows(formattedRows);
    }, [voucher_no, initDate, initDescription, send_sms, paymentRows, paymentModes, accountLedgers]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const firstPayment = paymentRows?.[0];
        if (!firstPayment) {
            alert('Missing payment ID.');
            return;
        }

        router.put(`/payment-add/${firstPayment.id}`, {
            date,
            voucher_no: voucherNo,
            description,
            send_sms: sendSms,
            rows,
        });
    };

    const totalAmount = rows.reduce((acc, row) => acc + parseFloat(row.amount || 0), 0);

    return (
        <AppLayout>
            <Head title="Edit Payment" />

            <div className="bg-background h-full w-screen p-6 lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">
                    <PageHeader title="Edit Payment" addLinkHref="/payment-add" addLinkText="Back" />

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 items-center gap-4 md:grid-cols-3">
                            <div>
                                <InputCalendar value={date} label="Date" onChange={(val) => setDate(val)} />
                            </div>
                            <div>
                                <label className="mb-1 block font-medium">Voucher No</label>
                                <input type="text" value={voucherNo} readOnly className="bg-background w-full rounded border px-3 py-2" />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Payments</label>

                            <div className="mb-4 rounded border p-2">
                                <div className="mb-1 grid grid-cols-5 gap-1 text-center text-xs font-semibold text-gray-600">
                                    <div>Payment Mode</div>
                                    <div>Account Ledger</div>
                                    <div>Amount</div>
                                    <div>New Ledger Balance</div>
                                    <div>Remove</div>
                                </div>

                                {rows.map((row, index) => (
                                    <div key={index} className="mb-2 grid grid-cols-5 items-center gap-1">
                                        <div>
                                            <select
                                                className="w-full rounded border px-2 py-1 text-sm"
                                                value={row.payment_mode_id}
                                                onChange={(e) => handleChange(index, 'payment_mode_id', e.target.value)}
                                            >
                                                <option value="">Select</option>
                                                {paymentModes.map((mode: any) => (
                                                    <option key={mode.id} value={mode.id}>
                                                        {mode.mode_name}
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
                                                        {ledger.account_ledger_name}
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
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (rows.length > 1) {
                                                        setRows(rows.filter((_, i) => i !== index));
                                                    }
                                                }}
                                                disabled={rows.length === 1}
                                                className={`text-lg font-bold ${rows.length === 1 ? 'cursor-not-allowed text-gray-300' : 'text-red-600'}`}
                                                title={rows.length === 1 ? 'Cannot remove the last row' : 'Remove this row'}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded border px-3 py-2"
                            />
                        </div>

                        {/* <div className="flex items-center gap-2">
                            <input type="checkbox" checked={sendSms} onChange={(e) => setSendSms(e.target.checked)} />
                            <label className="text-sm">Send SMS</label>
                        </div> */}

                        <div className="text-right font-bold">Total: {totalAmount.toFixed(2)}</div>

                        <ActionFooter
                            className="justify-end"
                            onSubmit={handleSubmit}
                            submitText="Update Payment"
                            processing={false}
                            cancelHref="/payment-add"
                            cancelText="Cancel"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
