// resources/js/Pages/payment-add/create-for-purchase.tsx
import ActionFooter from '@/components/ActionFooter';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';

import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

type PaymentMode = {
    id: number;
    mode_name: string;
    ledger?: { id: number; account_ledger_name: string };
};

type SupplierLedger = {
    id: number;
    account_ledger_name: string;
    closing_balance?: number | null;
};

type PurchaseLite = {
    id: number;
    voucher_no: string;
    date: string; // ISO date
    grand_total: number;
    account_ledger_id: number;
};

export default function CreateForPurchase({
    purchase,
    remaining_due,
    supplierLedger,
    paymentModes,
}: {
    purchase: PurchaseLite;
    remaining_due: number;
    supplierLedger: SupplierLedger | null;
    paymentModes: PaymentMode[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        date: '', // we’ll set default in useEffect
        voucher_no: '',
        payment_mode_id: '',
        account_ledger_id: purchase.account_ledger_id, // locked
        amount: '',
        description: '',
        send_sms: false as boolean,
    });

    // generate default date + voucher like your other pages
    useEffect(() => {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD for <input date> / InputCalendar
        const stamp = today.toISOString().slice(0, 10).replace(/-/g, '');
        const rand = Math.floor(1000 + Math.random() * 9000);
        setData('date', dateStr);
        setData('voucher_no', `PAY-${stamp}-${rand}`);
    }, []);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('purchase.payments.store', purchase.id));
    };

    const fmt = (n: number | string) => new Intl.NumberFormat('en-BD', { minimumFractionDigits: 2 }).format(Number(n || 0));

    const clampAmount = (val: string) => {
        const num = parseFloat(val || '0');
        if (isNaN(num)) return '0';
        if (num < 0) return '0';
        if (num > remaining_due) return String(remaining_due);
        return val;
    };

    return (
        <AppLayout>
            <Head title="Settle Purchase Due" />
            <div className="w-screen bg-background p-6 lg:w-full">
                <div className="rounded-lg bg-background p-6">
                    <PageHeader title="Settle Purchase Due" addLinkHref={route('purchases.show', purchase.id)} addLinkText="Back to Purchase" />

                    {/* Summary */}
                    <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
                        <SummaryBox label="Purchase" value={`#${purchase.id} (${purchase.voucher_no})`} />
                        <SummaryBox label="Supplier" value={supplierLedger?.account_ledger_name || '—'} />
                        <SummaryBox label="Grand Total" value={`${fmt(purchase.grand_total)} Tk`} />
                        <SummaryBox label="Remaining Due" value={`${fmt(remaining_due)} Tk`} danger />
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="space-y-6 rounded-lg border bg-background p-6 shadow-md">
                        {/* Date & Voucher */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <InputCalendar label="Payment Date" required value={data.date} onChange={(val) => setData('date', val)} />
                                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
                            </div>

                            <div className="flex flex-col justify-end">
                                <label className="invisible mb-1 block text-sm font-medium md:visible">Voucher No</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    placeholder="Voucher No"
                                    value={data.voucher_no}
                                    onChange={(e) => setData('voucher_no', e.target.value)}
                                />
                                {errors.voucher_no && <p className="mt-1 text-sm text-red-500">{errors.voucher_no}</p>}
                            </div>
                        </div>

                        {/* Mode & Supplier (locked) */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Payment Mode</label>
                                <select
                                    className="w-full rounded border p-2"
                                    value={data.payment_mode_id}
                                    onChange={(e) => setData('payment_mode_id', e.target.value)}
                                >
                                    <option value="">Select Payment Mode</option>
                                    {paymentModes.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.mode_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.payment_mode_id && <p className="mt-1 text-sm text-red-500">{errors.payment_mode_id}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Supplier Ledger (Locked)</label>
                                <input
                                    className="w-full cursor-not-allowed rounded border bg-background p-2"
                                    readOnly
                                    value={`${supplierLedger?.account_ledger_name || '—'} (ID: ${purchase.account_ledger_id})`}
                                />
                                {/* Hidden to submit with form */}
                                <input type="hidden" name="account_ledger_id" value={data.account_ledger_id} />
                                {errors.account_ledger_id && <p className="mt-1 text-sm text-red-500">{errors.account_ledger_id}</p>}
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    className="w-full rounded border p-2"
                                    placeholder="0.00"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', clampAmount(e.target.value))}
                                />
                                <div className="mt-1 text-xs text-gray-500">
                                    Must be ≤ Remaining Due: <b>{fmt(remaining_due)} Tk</b>
                                </div>
                                {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    placeholder="Optional note"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Send SMS */}
                        {/* <div className="flex items-center gap-2">
                            <input id="send_sms" type="checkbox" checked={data.send_sms} onChange={(e) => setData('send_sms', e.target.checked)} />
                            <label htmlFor="send_sms" className="text-sm">
                                Send SMS
                            </label>
                        </div> */}

                        {/* Actions */}
                        <ActionFooter
                            className="w-full justify-end"
                            onSubmit={onSubmit}
                            cancelHref={route('purchases.show', purchase.id)}
                            processing={processing}
                            submitText={processing ? 'Saving...' : 'Save Payment'}
                            cancelText="Cancel"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

function SummaryBox({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
    return (
        <div className={`rounded border ${danger ? 'bg-background' : 'bg-background'} p-3`}>
            <div className="text-xs text-gray-500">{label}</div>
            <div className={`text-base font-semibold ${danger ? 'text-rose-600' : ''}`}>{value}</div>
        </div>
    );
}
