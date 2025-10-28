/* resources/js/Pages/dues/show.tsx */
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { PrinterIcon } from '@heroicons/react/24/outline';
import { Head, useForm, usePage } from '@inertiajs/react';

import React from 'react';
/* ------------------------------------------------------------------ */
/* Type helpers sent from the controller                             */
/* ------------------------------------------------------------------ */
type Payment = {
    id: number;
    date: string; // yyyy-mm-dd
    amount: number;
    interest_amount: number;
    received_mode: string | null; // "Cash", "bKash", etc.
    note: string | null;
};

type ReceivedMode = {
    id: number;
    mode_name: string;
};

type Props = {
    sale: {
        id: number;
        date: string;
        voucher_no: string;
        customer: string;

        total_sale: number;
        principal_due: number;
        daily_interest: number;
        balance_with_interest: number;
        accrued_interest: number;
        outstanding: number;
    };
    items: { name: string; qty: number; unit: string }[];
    payments: Payment[];
    receivedModes: ReceivedMode[];
};

/* ------------------------------------------------------------------ */
/* Helper functions for formatting                                   */
/* ------------------------------------------------------------------ */
// Currency formatter (e.g., 1,200.00 ৳)
const fmtCurrency = (n: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(n) + ' ৳';

const formatDate = (iso: string) => {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // 0-based
    const yr = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${yr}`;
};

/* ------------------------------------------------------------------ */
/* Print Handler                                                     */
/* ------------------------------------------------------------------ */
const handlePrint = () => {
    window.print();
};

/* ------------------------------------------------------------------ */
/* Reusable stateless components                                     */
/* ------------------------------------------------------------------ */

/** Displays a single row in the invoice item list. */
const ItemRow = ({ i }: { i: Props['items'][number] }) => (
    <li className="flex items-center justify-between border-b border-gray-100 py-3 text-sm transition-colors duration-200 last:border-none hover:bg-background">
        <span className="font-medium text-foreground">{i.name}</span>
        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-black">
            {i.qty} {i.unit}
        </span>
    </li>
);

/** Displays a single statistic in the summary snapshot. */
function Stat({
    label,
    value,
    color = 'text-foreground',
    bgColor = 'bg-gray-50',
    icon,
}: {
    label: string;
    value: string;
    color?: string;
    bgColor?: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className={`flex flex-col ${bgColor} rounded-xl border border-gray-100 p-4 shadow-sm transition-all duration-200 hover:shadow-md`}>
            <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">{label}</span>
                {icon && <span className="text-gray-400">{icon}</span>}
            </div>
            <span className={`text-xl font-bold ${color}`}>{value}</span>
        </div>
    );
}

/** Renders the overview of financial figures related to the due. */
function FinancialSnapshot({ s }: { s: Props['sale'] }) {
    return (
        <div className="grid gap-4 rounded-2xl border border-gray-200 bg-background p-6 shadow-sm md:grid-cols-2 lg:grid-cols-3">
            <Stat label="Original Sale Amount" value={fmtCurrency(s.total_sale)} bgColor="bg-blue-50" color="text-blue-700" icon={<span>💰</span>} />
            <Stat label="Principal Due" value={fmtCurrency(s.principal_due)} bgColor="bg-purple-50" color="text-purple-700" icon={<span>📊</span>} />
            <Stat label="Daily Interest" value={fmtCurrency(s.daily_interest)} color="text-amber-700" bgColor="bg-amber-50" icon={<span>📈</span>} />
            <Stat
                label="Interest Till Now"
                value={fmtCurrency(s.accrued_interest)}
                color="text-amber-700"
                bgColor="bg-amber-50"
                icon={<span>⏰</span>}
            />
            <Stat
                label="Balance with Interest"
                value={fmtCurrency(s.balance_with_interest)}
                color="text-red-700"
                bgColor="bg-red-50"
                icon={<span>⚠️</span>}
            />
            <Stat label="Current Outstanding" value={fmtCurrency(s.outstanding)} color="text-red-700" bgColor="bg-red-50" icon={<span>🔴</span>} />
        </div>
    );
}

/** Renders a table of previously made payments. */
function PaymentTimeline({ payments }: { payments: Payment[] }) {
    if (payments.length === 0) {
        return (
            <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 text-center">
                <div className="mb-3 text-4xl">💳</div>
                <p className="text-sm font-medium text-blue-800">No payments have been made yet</p>
                <p className="mt-1 text-xs text-blue-600">The first payment will appear here after processing</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-foreground uppercase">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-foreground uppercase">Mode</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-foreground uppercase">Principal Paid</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-foreground uppercase">Daily Interest</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-foreground uppercase">Note</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-background">
                        {payments.map((p, index) => (
                            <tr
                                key={p.id}
                                className={`transition-colors duration-150 hover:bg-background ${index % 2 === 0 ? 'bg-background' : 'bg-gray-50/50'}`}
                            >
                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-foreground">{formatDate(p.date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                            p.received_mode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                                        }`}
                                    >
                                        {p.received_mode ?? 'Not specified'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-sm font-semibold whitespace-nowrap text-foreground">
                                    {fmtCurrency(p.amount)}
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-sm whitespace-nowrap">
                                    {p.interest_amount > 0 ? (
                                        <span className="font-semibold text-amber-600">{fmtCurrency(p.interest_amount)}</span>
                                    ) : (
                                        <span className="text-gray-400">—</span>
                                    )}
                                </td>
                                <td className="max-w-xs truncate px-6 py-4 text-sm text-foreground">{p.note ?? '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Main Page Component                                               */
/* ------------------------------------------------------------------ */
export default function DueShow({ sale, items, payments, receivedModes }: Props) {
    const { flash } = usePage().props as any;

    const { data, setData, post, processing, errors, reset } = useForm({
        date: new Date().toISOString().slice(0, 10),
        amount: '',
        received_mode_id: '',
        note: '',
        waive_interest: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dues.pay', sale.id), {
            onSuccess: () => reset('amount', 'note', 'waive_interest'), // clear fields on success
        });
    };

    return (
        <AppLayout>
            <Head title={`Payment for Invoice ${sale.voucher_no}`} />

            {/* Print Styles */}
            <style jsx>{`
            {
            .break-inside-avoid {
  break-inside: avoid;
  page-break-inside: avoid;}
                @media print {
    .print-only {
      font-size: 10px;
      line-height: 1.3;
    }
    th, td {
      padding: 2px 4px !important;
    }
    h2, h3 {
      font-size: 12px;
    }
    table {
      margin-bottom: 6px;
    }
  }

`}</style>

            <div className="min-h-screen bg-background p-4 md:p-6">
                <div className="mx-auto max-w-5xl space-y-8">
                    {/* Header with Print Button */}
                    <div className="no-print flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <PageHeader title="Payment Management" addLinkHref="/dues" addLinkText="← Back to All Dues" />

                        {/* Simple Print Button */}
                        <button
                            type="button"
                            onClick={handlePrint} // The same print handler function
                            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-background focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        >
                            <PrinterIcon className="h-5 w-5" aria-hidden="true" />
                            <span>Print Receipt</span>
                        </button>
                    </div>

                    {/* Success Message */}
                    {flash?.success && (
                        <div className="no-print rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-green-600">✅</span>
                                <span className="text-sm font-medium text-green-800">{flash.success}</span>
                            </div>
                        </div>
                    )}

                    {/* Invoice Header */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-background shadow-sm">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <h1 className="text-xl font-bold text-white">Invoice #{sale.voucher_no}</h1>
                            <p className="text-sm text-blue-100">
                                Customer: {sale.customer} • Date: {formatDate(sale.date)}
                            </p>
                        </div>
                    </div>

                    {/* Invoice Items */}
                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-background shadow-sm">
                        <div className="border-b border-gray-200 bg-background px-6 py-4">
                            <h3 className="text-lg font-semibold text-foreground">Invoice Items</h3>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-1">
                                {items.map((i) => (
                                    <ItemRow key={i.name} i={i} />
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Financial Summary */}
                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-foreground">Financial Overview</h2>
                        <div className="break-inside-avoid">
                            <FinancialSnapshot s={sale} />
                        </div>
                    </section>

                    {/* New Payment Form */}
                    <section className="no-print overflow-hidden rounded-2xl border border-gray-200 bg-background shadow-sm">
                        <div className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-black">
                                <span>💳</span>
                                Add New Payment
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {/* Date */}
                                <div className="space-y-2">
                                    <label htmlFor="date" className="block text-sm font-semibold text-foreground">
                                        Payment Date
                                    </label>
                                    <input
                                        id="date"
                                        type="date"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-blue-500"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                    />
                                </div>

                                {/* Amount */}
                                <div className="space-y-2">
                                    <label htmlFor="amount" className="block text-sm font-semibold text-foreground">
                                        Amount (৳)
                                    </label>
                                    <input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        placeholder="Enter amount"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-blue-500"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                    />
                                    {errors.amount && <p className="text-sm font-medium text-red-600">{errors.amount}</p>}
                                </div>

                                {/* Payment Mode */}
                                <div className="space-y-2">
                                    <label htmlFor="mode" className="block text-sm font-semibold text-foreground">
                                        Payment Method
                                    </label>
                                    <select
                                        id="mode"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-blue-500"
                                        value={data.received_mode_id}
                                        onChange={(e) => setData('received_mode_id', e.target.value)}
                                    >
                                        <option value="">Select method</option>
                                        {receivedModes.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.mode_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.received_mode_id && <p className="text-sm font-medium text-red-600">{errors.received_mode_id}</p>}
                                </div>

                                {/* Note */}
                                <div className="space-y-2">
                                    <label htmlFor="note" className="block text-sm font-semibold text-foreground">
                                        Note (Optional)
                                    </label>
                                    <input
                                        id="note"
                                        type="text"
                                        placeholder="Add a note..."
                                        className="block w-full rounded-lg border-gray-300 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-blue-500"
                                        value={data.note}
                                        onChange={(e) => setData('note', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Waive Interest Checkbox */}
                            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="waive_interest"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={data.waive_interest}
                                        onChange={(e) => setData('waive_interest', e.target.checked)}
                                    />
                                    <label htmlFor="waive_interest" className="text-sm font-medium text-amber-800">
                                        <span className="mr-2">⚠️</span>
                                        Waive all outstanding interest for this payment
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <span>💰</span>
                                            Add Payment
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Payment History */}
                    <section className="space-y-4">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                            <span>📋</span>
                            Payment History
                        </h2>
                        <PaymentTimeline payments={payments} />
                    </section>
                </div>
            </div>

            {/* ───────────────────────── PRINT RECEIPT ───────────────────────── */}
            <div className="print-only hidden">
                {/* company header or logo can go here */}
                <h2 className="mb-1 text-center text-lg font-bold">Invoice #{sale.voucher_no}</h2>
                <p className="mb-4 text-center text-xs">
                    Customer: {sale.customer} &nbsp;|&nbsp; Date: {formatDate(sale.date)}
                </p>

                {/* Items -------------------------------------------------------- */}
                <table className="mb-4 w-full border-t border-b border-gray-400 text-xs">
                    <thead>
                        <tr className="border-b border-gray-400">
                            <th className="py-1 text-left">Item</th>
                            <th className="py-1 text-right">Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((i) => (
                            <tr key={i.name}>
                                <td className="py-1">{i.name}</td>
                                <td className="py-1 text-right">
                                    {i.qty} {i.unit}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals ------------------------------------------------------- */}
                <table className="mb-4 w-full text-xs">
                    <tbody>
                        <tr>
                            <td>Subtotal</td>
                            <td className="text-right">{fmtCurrency(sale.total_sale)}</td>
                        </tr>
                        <tr>
                            <td>Interest Accrued</td>
                            <td className="text-right">{fmtCurrency(sale.accrued_interest)}</td>
                        </tr>
                        <tr className="border-t border-gray-400 font-bold">
                            <td>Total Due</td>
                            <td className="text-right">{fmtCurrency(sale.outstanding)}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Payment timeline (optional) --------------------------------- */}
                {payments.length > 0 && (
                    <>
                        <h3 className="mb-1 text-xs font-semibold">Payments Received</h3>
                        <table className="text-2xs w-full">
                            <thead>
                                <tr>
                                    <th className="text-left">Date</th>
                                    <th className="text-right">Cash</th>
                                    <th className="text-right">Int.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p) => (
                                    <tr key={p.id}>
                                        <td>{formatDate(p.date)}</td>
                                        <td className="text-right">{fmtCurrency(p.amount)}</td>
                                        <td className="text-right">{p.interest_amount ? fmtCurrency(p.interest_amount) : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                <p className="mt-6 text-center text-xs">Thank you for your business!</p>
            </div>
        </AppLayout>
    );
}
