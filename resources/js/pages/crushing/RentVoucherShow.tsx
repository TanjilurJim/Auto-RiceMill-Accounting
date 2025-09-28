/*  resources/js/pages/crushing/RentVoucherShow.tsx  */
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';
import Select from 'react-select';
import { route } from 'ziggy-js';

/* ------------ Types ------------ */
interface Line {
    item: string;
    qty: number;
    mon?: number | null;
    rate: number;
    amount: number;
    unit_name?: string | null;
}
interface PaymentRow {
    id: number | null;
    date: string;
    amount: number;
    reference?: string | null;
    notes?: string | null;
    received_mode?: { mode_name: string; phone_number?: string | null } | null;
    user?: { name: string } | null;
}
interface VoucherPayload {
    id: number;
    date: string;
    vch_no: string;
    grand_total: number;
    previous_balance: number;
    balance: number; // overall ledger-ish display; keep
    received_amount: number;
    received_mode: { mode_name: string; phone_number?: string | null } | null;
    party: { account_ledger_name: string };
    remarks?: string | null;

    // NEW computed fields from backend:
    received_total: number;
    remaining_due: number;
}
interface Mode {
    id: number;
    mode_name: string;
    phone_number?: string | null;
}
interface PageProps {
    voucher: VoucherPayload;
    lines: Line[];
    payments: PaymentRow[];
    modes: Mode[];
}

/* --- helpers --- */
const num = (v: unknown) => +v! || 0;
const money = (v: unknown) => num(v).toFixed(2);

/* --- small components --- */
const InfoCard = ({
    label,
    value,
    highlight = false,
    currency = true,
}: {
    label: string;
    value: string | number;
    highlight?: boolean;
    currency?: boolean;
}) => (
    <div className={`rounded-lg border p-4 shadow-sm ${highlight ? 'border-blue-200 bg-background' : 'border-gray-200 bg-background'}`}>
        <div className="mb-1 text-sm font-medium text-foreground">{label}</div>
        <div className={`font-mono text-lg font-bold ${highlight ? 'text-red-700' : 'text-foreground'}`}>{currency ? `৳${value}` : value}</div>
    </div>
);

const StatusBadge = ({ status }: { status: number }) => {
    const color =
        status > 0
            ? 'bg-red-100 text-red-800 border-red-200'
            : status < 0
              ? 'bg-red-100 text-red-800 border-red-200'
              : 'bg-gray-100 text-gray-800 border-gray-200';

    const dot = status > 0 ? 'bg-red-500' : status < 0 ? 'bg-red-500' : 'bg-gray-500';
    const text = status > 0 ? 'Credit Balance' : status < 0 ? 'Debit Balance' : 'Balanced';

    return (
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${color}`}>
            <span className={`mr-2 h-2 w-2 rounded-full ${dot}`} />
            {text}
        </span>
    );
};

export default function RentVoucherShow() {
    const { voucher, lines, payments, modes } = usePage<PageProps>().props;

    /* sanity */
    const lineTotal = lines.reduce((s, l) => s + num(l.amount), 0);
    if (lineTotal !== num(voucher.grand_total)) {
        // eslint-disable-next-line no-console
        console.warn(`Mismatch: row total (${lineTotal}) vs grand_total (${voucher.grand_total})`);
    }

    const hasUnit = lines.some((l) => l.unit_name);
    const hasMon = lines.some((l) => l.mon !== undefined);
    const dynamicCols = (hasUnit ? 1 : 0) + (hasMon ? 1 : 0);

    const printVoucher = () => window.print();

    /* -------- Settle Due dialog state -------- */
    const { data, setData, post, processing, errors, reset } = useForm<{
        date: string;
        received_mode_id: string;
        amount: string;
        reference?: string;
        notes?: string;
    }>({
        date: new Date().toISOString().slice(0, 10),
        received_mode_id: '',
        amount: '',
        reference: '',
        notes: '',
    });

    const modeOpts = modes.map((m) => ({
        value: String(m.id),
        label: m.mode_name + (m.phone_number ? ` (${m.phone_number})` : ''),
    }));

    const remaining = voucher.remaining_due;

    const submitSettle = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('party-stock.rent-voucher.settle', voucher.id), {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    const [open, setOpen] = React.useState(false);

    return (
        <AppLayout>
            <Head title={`Rent Voucher – ${voucher.vch_no}`} />

            <div className="bg-background min-h-screen py-6 print:bg-white print:py-0">
                <div className="mx-auto max-w-5xl">
                    {/* ---------- Header card ---------- */}
                    <div className="bg-background mb-6 overflow-hidden rounded-lg shadow-sm print:rounded-none print:shadow-none">
                        <div className="text-background bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-6 print:border-b print:bg-white print:text-black">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-background/20 rounded-lg p-3 print:bg-purple-100">
                                        {/* icon */}
                                        <svg
                                            className="text-background h-8 w-8 print:text-purple-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold print:text-black">Rent Voucher</h1>
                                        <p className="text-purple-100 print:text-foreground">Official payment receipt</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-purple-100 print:text-foreground">Voucher No.</div>
                                    <div className="text-xl font-bold print:text-black">{voucher.vch_no}</div>
                                </div>
                            </div>
                        </div>

                        {/* party & meta */}
                        <div className="bg-background p-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* party */}
                                <div className="space-y-4">
                                    <h2 className="flex items-center space-x-2 text-lg font-semibold text-foreground">
                                        <svg className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        <span>Party Details</span>
                                    </h2>
                                    <div className="rounded-lg bg-background shadow-amber-50 p-4">
                                        <div className="font-medium text-foreground">{voucher.party.account_ledger_name}</div>
                                        <div className="mt-1 text-sm text-foreground">Account Ledger</div>
                                    </div>
                                </div>

                                {/* date & status */}
                                <div className="space-y-4">
                                    <h2 className="flex items-center space-x-2 text-lg font-semibold text-foreground">
                                        <svg className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span>Voucher Info</span>
                                    </h2>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-foreground">Date:</span>
                                            <span className="font-medium">{voucher.date}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-foreground">Received Through:</span>
                                            <span className="font-medium">
                                                {voucher.received_mode
                                                    ? `${voucher.received_mode.mode_name}${voucher.received_mode.phone_number ? ' (' + voucher.received_mode.phone_number + ')' : ''}`
                                                    : '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-foreground">Status:</span>
                                            <StatusBadge status={voucher.balance} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ---------- Financial summary ---------- */}
                    <div className="bg-background mb-6 overflow-hidden rounded-lg shadow-sm print:rounded-none print:shadow-none">
                        <div className="border-b border-gray-200 bg-background px-6 py-4">
                            <h2 className="flex items-center text-lg font-semibold text-foreground">
                                <svg className="mr-2 h-5 w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                </svg>
                                Financial Summary
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                                <InfoCard label="Previous Balance" value={money(voucher.previous_balance)} />
                                <InfoCard label="Bill Amount" value={money(voucher.grand_total)} />
                                <InfoCard label="Received (Total)" value={money(voucher.received_total)} />
                                <InfoCard label="Remaining Due" value={money(voucher.remaining_due)} highlight />
                                <InfoCard label="Ledger New Balance" value={money(voucher.balance)} />
                            </div>

                            <div className="mt-4 flex gap-3 print:hidden">
                                <button
                                    onClick={printVoucher}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Print Voucher
                                </button>

                                <Dialog.Root open={open} onOpenChange={setOpen}>
                                    <Dialog.Trigger asChild>
                                        <button
                                            disabled={remaining <= 0}
                                            className="inline-flex items-center rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                        >
                                            Settle Due
                                        </button>
                                    </Dialog.Trigger>

                                    <Dialog.Portal>
                                        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                                        <Dialog.Content className="fixed top-1/2 left-1/2 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-lg">
                                            <Dialog.Title className="mb-2 text-lg font-semibold">Settle Due</Dialog.Title>
                                            <p className="mb-4 text-sm text-foreground">
                                                Remaining: <span className="font-mono">৳{money(remaining)}</span>
                                            </p>

                                            <form onSubmit={submitSettle} className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium">Date</label>
                                                        <input
                                                            type="date"
                                                            className="w-full rounded border p-2"
                                                            value={data.date}
                                                            onChange={(e) => setData('date', e.target.value)}
                                                        />
                                                        {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium">Amount</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            className="w-full rounded border p-2 text-right font-mono"
                                                            value={data.amount}
                                                            max={remaining}
                                                            onChange={(e) => setData('amount', e.target.value)}
                                                        />
                                                        {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium">Received Mode</label>
                                                    <Select
                                                        classNamePrefix="rs"
                                                        options={modeOpts}
                                                        value={modeOpts.find((o) => o.value === data.received_mode_id) || null}
                                                        onChange={(o) => setData('received_mode_id', o?.value || '')}
                                                    />
                                                    {errors.received_mode_id && <p className="text-xs text-red-500">{errors.received_mode_id}</p>}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium">Reference (optional)</label>
                                                        <input
                                                            className="w-full rounded border p-2"
                                                            value={data.reference || ''}
                                                            onChange={(e) => setData('reference', e.target.value)}
                                                        />
                                                        {errors.reference && <p className="text-xs text-red-500">{errors.reference}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium">Notes (optional)</label>
                                                        <input
                                                            className="w-full rounded border p-2"
                                                            value={data.notes || ''}
                                                            onChange={(e) => setData('notes', e.target.value)}
                                                        />
                                                        {errors.notes && <p className="text-xs text-red-500">{errors.notes}</p>}
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex justify-end gap-3">
                                                    <Dialog.Close asChild>
                                                        <button type="button" className="rounded border px-4 py-2 text-sm">
                                                            Cancel
                                                        </button>
                                                    </Dialog.Close>
                                                    <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="rounded bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        {processing ? 'Saving…' : 'Receive Payment'}
                                                    </button>
                                                </div>
                                            </form>
                                        </Dialog.Content>
                                    </Dialog.Portal>
                                </Dialog.Root>
                            </div>
                        </div>
                    </div>

                    {/* ---------- Items table ---------- */}
                    {/* (unchanged except for imports above) */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-background shadow-sm print:rounded-none print:shadow-none">
                        {/* ... your existing items table code ... */}
                        {/* keep your original "Items table" block exactly as it is */}
                    </div>

                    {/* ---------- Payment History ---------- */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-background shadow-sm print:rounded-none print:shadow-none">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h2 className="flex items-center text-lg font-semibold text-gray-900">
                                <svg className="mr-2 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h13M9 8h13" />
                                </svg>
                                Payment History
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-foreground uppercase">
                                            Date
                                        </th>
                                        <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-foreground uppercase">
                                            Mode
                                        </th>
                                        <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-foreground uppercase">
                                            Reference
                                        </th>
                                        <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-foreground uppercase">
                                            Posted By
                                        </th>
                                        <th className="border-b px-6 py-3 text-right text-xs font-medium tracking-wider text-foreground uppercase">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-background">
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td className="px-6 py-4 text-sm text-foreground" colSpan={5}>
                                                No payments yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map((p, idx) => (
                                            <tr key={`${p.id ?? 'init'}-${idx}`} className="hover:bg-background">
                                                <td className="px-6 py-3 text-sm">{p.date}</td>
                                                <td className="px-6 py-3 text-sm">
                                                    {p.received_mode ? (
                                                        <>
                                                            {p.received_mode.mode_name}
                                                            {p.received_mode.phone_number ? ` (${p.received_mode.phone_number})` : ''}
                                                        </>
                                                    ) : (
                                                        '—'
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 text-sm">{p.reference ?? '—'}</td>
                                                <td className="px-6 py-3 text-sm">{p.user?.name ?? '—'}</td>
                                                <td className="px-6 py-3 text-right font-mono text-sm font-semibold">৳{money(p.amount)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                <tfoot className="bg-background">
                                    <tr>
                                        <td className="px-6 py-3 text-right text-sm font-bold text-foreground" colSpan={4}>
                                            Total Received
                                        </td>
                                        <td className="px-6 py-3 text-right font-mono text-sm font-bold text-foreground">
                                            ৳{money(voucher.received_total)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* ---------- Remarks ---------- */}
                    {voucher.remarks && (
                        <div className="mb-6 overflow-hidden rounded-lg bg-background shadow-sm print:rounded-none print:shadow-none">
                            {/* ... keep your existing Remarks block ... */}
                        </div>
                    )}

                    {/* ---------- Footer buttons ---------- */}
                    <div className="flex items-center justify-between gap-4 print:hidden">
                        <div />
                        <Link
                            href={route('party-stock.rent-voucher.index')}
                            className="inline-flex items-center rounded-lg border border-gray-300 bg-background px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                        >
                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to List
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
