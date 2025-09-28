import ActionFooter from '@/components/ActionFooter';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

type PaymentMode = {
    id: number;
    mode_name: string;
    ledger?: { id: number; account_ledger_name: string; closing_balance?: number | null };
};

type AccountLedger = {
    id: number;
    account_ledger_name: string;
    opening_balance?: number | null;
    closing_balance?: number | null;
};

type DuesPayload = {
    total_due: number;
    open_purchases: Array<{
        id: number;
        voucher_no: string;
        date: string;
        grand_total: number;
        initial_paid: number;
        extra_paid: number;
        remaining: number;
    }>;
};

export default function Create({ paymentModes, accountLedgers }: { paymentModes: PaymentMode[]; accountLedgers: AccountLedger[] }) {
    const t = useTranslation();

    const [rows, setRows] = useState<
        Array<{
            payment_mode_id: string | number;
            account_ledger_id: string | number;
            amount: string;
            payment_balance: number;
            ledger_balance: number;
        }>
    >([{ payment_mode_id: '', account_ledger_id: '', amount: '', payment_balance: 0, ledger_balance: 0 }]);

    // Mirror array to hold dues info per row
    const [duesByRow, setDuesByRow] = useState<DuesPayload[]>([{ total_due: 0, open_purchases: [] }]);

    const [voucherNo, setVoucherNo] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [sendSms, setSendSms] = useState(false);

    const totalAmount = rows.reduce((acc, row) => acc + (parseFloat(String(row.amount)) || 0), 0);

    useEffect(() => {
        const today = new Date().toISOString().slice(0, 10);
        setDate(today);
        const rand = Math.floor(Math.random() * 10000);
        setVoucherNo(`PMT-${today.replace(/-/g, '')}-${rand}`);
    }, []);

    const fmt = (n: number | string) => new Intl.NumberFormat('en-BD', { minimumFractionDigits: 2 }).format(Number(n || 0));

    const fetchDuesForRow = async (rowIndex: number, ledgerId: string | number) => {
        if (!ledgerId) {
            const copy = [...duesByRow];
            copy[rowIndex] = { total_due: 0, open_purchases: [] };
            setDuesByRow(copy);
            return;
        }
        try {
            const { data } = await axios.get<DuesPayload>(`/api/suppliers/${ledgerId}/dues`);
            const copy = [...duesByRow];
            copy[rowIndex] = data;
            setDuesByRow(copy);
        } catch {
            const copy = [...duesByRow];
            copy[rowIndex] = { total_due: 0, open_purchases: [] };
            setDuesByRow(copy);
        }
    };

    const handleChange = (index: number, field: string, value: any) => {
        const newRows = [...rows];
        newRows[index][field as keyof (typeof newRows)[number]] = value as never;

        if (field === 'payment_mode_id') {
            const selected = paymentModes.find((m) => m.id === parseInt(value));
            const balance = Number(selected?.ledger?.closing_balance ?? 0);
            newRows[index].payment_balance = balance;
        }

        if (field === 'account_ledger_id') {
            const selected = accountLedgers.find((l) => l.id === parseInt(value));
            const balance = Number(selected?.closing_balance ?? selected?.opening_balance ?? 0);
            newRows[index].ledger_balance = balance;
            // fetch dues snapshot for this ledger
            fetchDuesForRow(index, value);
        }

        if (field === 'amount') {
            const amount = parseFloat(value) || 0;
            const currentLedger = accountLedgers.find((l) => l.id === parseInt(String(newRows[index].account_ledger_id)));
            const base = Number(currentLedger?.closing_balance ?? currentLedger?.opening_balance ?? 0);
            newRows[index].ledger_balance = base + amount;
        }

        setRows(newRows);
    };

    const addRow = () => {
        setRows((prev) => [...prev, { payment_mode_id: '', account_ledger_id: '', amount: '', payment_balance: 0, ledger_balance: 0 }]);
        setDuesByRow((prev) => [...prev, { total_due: 0, open_purchases: [] }]);
    };

    const removeRow = (index: number) => {
        setRows(rows.filter((_, i) => i !== index));
        setDuesByRow(duesByRow.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/payment-add', { date, voucher_no: voucherNo, description, send_sms: sendSms, rows });
    };

    return (
        <AppLayout>
            <Head title={t('addPaymentTitle')} />

            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg">
                    <PageHeader title={t('addPaymentTitle')} addLinkHref="/payment-add" addLinkText={t('backText')} />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Date Field */}
                            <div className="items-end py-2">
                                {/* <label className="mb-1 block font-medium text-gray-700">Date</label> */}
                                <InputCalendar
                                    label={t('dateLabel')}
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="focus:ring-primary focus:border-primary w-full rounded border border-gray-300 px-3 py-2 focus:ring"
                                />
                            </div>

                            {/* Voucher No Field */}
                            <div>
                                <label className="mb-1 block font-medium text-gray-700">{t('voucherNoLabel')}</label>
                                <input
                                    type="text"
                                    value={voucherNo}
                                    readOnly
                                    className="w-full rounded border border-gray-300 bg-background px-3 py-2 text-gray-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block font-medium text-gray-700">{t('paymentsLabel')}</label>

                            <div className="mb-4 rounded border border-gray-300 bg-background p-4">
                                <div className="mb-2 hidden grid-cols-5 gap-4 text-center text-xs font-semibold text-gray-600 md:grid">
                                    <div>{t('paymentModeLabel')}</div>
                                    <div>{t('accountLedgerLabel')}</div>
                                    <div>{t('amountHeader')}</div>
                                    <div>{t('newLedgerBalanceLabel')}</div>
                                    <div>Remove</div>
                                </div>

                                {rows.map((row, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-5 md:gap-4">
                                            {/* Payment Mode */}
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 md:hidden">{t('paymentModeLabel')}</label>
                                                <select
                                                    className="focus:ring-primary focus:border-primary w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring"
                                                    value={row.payment_mode_id}
                                                    onChange={(e) => handleChange(index, 'payment_mode_id', e.target.value)}
                                                >
                                                    <option value="">Select</option>
                                                    {paymentModes.map((mode) => (
                                                        <option key={mode.id} value={mode.id}>
                                                            {mode.mode_name} ({fmt(mode?.ledger?.closing_balance ?? 0)})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Account Ledger */}
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 md:hidden">Account Ledger</label>
                                                <select
                                                    className="focus:ring-primary focus:border-primary w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring"
                                                    value={row.account_ledger_id}
                                                    onChange={(e) => handleChange(index, 'account_ledger_id', e.target.value)}
                                                >
                                                    <option value="">Select</option>
                                                    {accountLedgers.map((ledger) => (
                                                        <option key={ledger.id} value={ledger.id}>
                                                            {ledger.account_ledger_name} ({fmt(ledger.closing_balance ?? ledger.opening_balance ?? 0)}
                                                            )
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
                                                    className="focus:ring-primary focus:border-primary w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring"
                                                />
                                            </div>

                                            {/* New Ledger Balance */}
                                            <div>
                                                <label className="block text-xs font-semibold text-foreground md:hidden">New Ledger Balance</label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={Number(row.ledger_balance).toFixed(2)}
                                                    className="w-full rounded border border-gray-300 bg-background px-2 py-1 text-right text-sm text-foreground"
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
                                                        rows.length === 1 ? 'cursor-not-allowed text-gray-300' : 'text-red-600 hover:text-red-800'
                                                    }`}
                                                    title={rows.length === 1 ? 'Cannot remove the last row' : 'Remove this row'}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>

                                        {/* Dues snapshot panel (read-only) */}
                                        <div className="mt-2 rounded border border-dashed p-3 text-xs text-gray-600 md:col-span-5">
                                            {row.account_ledger_id ? (
                                                duesByRow[index]?.total_due > 0 ? (
                                                    <div>
                                                        <div className="mb-1">
                                                            <b>Outstanding with this ledger:</b> {fmt(duesByRow[index].total_due)}
                                                        </div>
                                                        <div className="overflow-x-auto">
                                                            <table className="min-w-full text-left text-[11px]">
                                                                <thead>
                                                                    <tr className="text-foreground">
                                                                        <th className="py-1 pr-2">Purchase</th>
                                                                        <th className="py-1 pr-2">Date</th>
                                                                        <th className="py-1 pr-2 text-right">Remaining</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {duesByRow[index].open_purchases.map((p) => (
                                                                        <tr key={p.id} className="border-t">
                                                                            <td className="py-1 pr-2">
                                                                                #{p.id} ({p.voucher_no})
                                                                            </td>
                                                                            <td className="py-1 pr-2">{p.date}</td>
                                                                            <td className="py-1 pr-2 text-right">{fmt(p.remaining)}</td>
                                                                        </tr>
                                                                    ))}
                                                                    {!duesByRow[index].open_purchases.length && (
                                                                        <tr>
                                                                            <td className="py-1 text-gray-400" colSpan={3}>
                                                                                No open purchases found.
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div className="mt-1 text-[11px] text-foreground">
                                                            Tip: to settle a specific purchase’s due, open that Purchase and click <b>Settle Due</b>.
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-green-600">No outstanding dues for this ledger.</span>
                                                )
                                            ) : (
                                                <span className="text-gray-400">Select a supplier to see dues.</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button type="button" onClick={addRow} className="text-primary hover:text-primary-hover text-sm">
                                {t('addRowText')}
                            </button>
                        </div>

                        <div>
                            <label className="mb-1 block font-medium text-gray-700">{t('descriptionHeader')}</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="focus:ring-primary focus:border-primary w-full rounded border border-gray-300 px-3 py-2 focus:ring"
                                rows={4}
                            />
                        </div>

                        {/* If you re-enable SMS later, just uncomment the block you already had. */}

                        <div className="text-right font-bold text-gray-700">
                            {t('totalText')}: {fmt(totalAmount)}
                        </div>

                        <ActionFooter
                            className="justify-end"
                            onSubmit={handleSubmit}
                            cancelHref="/payment-add"
                            processing={false}
                            submitText={t('savePaymentText')}
                            cancelText={t('cancelText')}
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
