/*  resources/js/pages/crushing/RentVoucherShow.tsx  */
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';

/* ------------ Type helpers (in sync with controller) ------------ */
interface Line {
    item: string;
    qty: number;
    mon?: number | null;
    rate: number;
    amount: number;
    unit_name?: string | null;
}
interface VoucherPayload {
    id: number;
    date: string;
    vch_no: string;
    grand_total: number;
    previous_balance: number;
    balance: number;
    received_amount: number;
    received_mode: { mode_name: string; phone_number?: string | null } | null;
    remarks?: string | null;
    party: { account_ledger_name: string };
}
interface PageProps {
    voucher: VoucherPayload;
    lines: Line[];
}
/* --------------------------------------------------------------- */

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
    <div className={`rounded-lg border p-4 shadow-sm ${highlight ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="mb-1 text-sm font-medium text-gray-600">{label}</div>
        <div className={`font-mono text-lg font-bold ${highlight ? 'text-blue-700' : 'text-gray-900'}`}>{currency ? `৳${value}` : value}</div>
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
    const { voucher, lines } = usePage<PageProps>().props;

    /* --------- sanity check --------- */
    const lineTotal = lines.reduce((s, l) => s + num(l.amount), 0);
    if (lineTotal !== num(voucher.grand_total)) {
        // eslint-disable-next-line no-console
        console.warn(`Mismatch: row total (${lineTotal}) vs grand_total (${voucher.grand_total})`);
    }

    /* --------- cached flags --------- */
    const hasUnit = lines.some((l) => l.unit_name);
    const hasMon = lines.some((l) => l.mon !== undefined);
    const dynamicCols = (hasUnit ? 1 : 0) + (hasMon ? 1 : 0);

    const printVoucher = () => window.print();

    return (
        <AppLayout>
            <Head title={`Rent Voucher – ${voucher.vch_no}`} />

            <div className="min-h-screen bg-gray-50 py-6 print:bg-white print:py-0">
                <div className="mx-auto max-w-5xl">
                    {/* ---------- Header card ---------- */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm print:rounded-none print:shadow-none">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-6 text-white print:border-b print:bg-white print:text-black">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="rounded-lg bg-white/20 p-3 print:bg-purple-100">
                                        {/* icon */}
                                        <svg
                                            className="h-8 w-8 text-white print:text-purple-600"
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
                                        <p className="text-purple-100 print:text-gray-600">Official payment receipt</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-purple-100 print:text-gray-600">Voucher No.</div>
                                    <div className="text-xl font-bold print:text-black">{voucher.vch_no}</div>
                                </div>
                            </div>
                        </div>

                        {/* party & meta */}
                        <div className="bg-white p-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* party */}
                                <div className="space-y-4">
                                    <h2 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        <span>Party Details</span>
                                    </h2>
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <div className="font-medium text-gray-900">{voucher.party.account_ledger_name}</div>
                                        <div className="mt-1 text-sm text-gray-500">Account Ledger</div>
                                    </div>
                                </div>

                                {/* date & status */}
                                <div className="space-y-4">
                                    <h2 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                            <span className="text-sm text-gray-600">Date:</span>
                                            <span className="font-medium">{voucher.date}</span>
                                        </div>
                                        {' '}
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Received Through:</span>
                                            <span className="font-medium">
                                                {voucher.received_mode
                                                    ? `${voucher.received_mode.mode_name}${
                                                          voucher.received_mode.phone_number ? ' (' + voucher.received_mode.phone_number + ')' : ''
                                                      }`
                                                    : '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Status:</span>
                                            <StatusBadge status={voucher.balance} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ---------- Financial summary ---------- */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm print:rounded-none print:shadow-none">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h2 className="flex items-center text-lg font-semibold text-gray-900">
                                <svg className="mr-2 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <InfoCard label="Previous Balance" value={money(voucher.previous_balance)} />
                                <InfoCard label="Bill Amount" value={money(voucher.grand_total)} />
                                <InfoCard label="Amount Received" value={money(voucher.received_amount)} />
                                <InfoCard label="New Balance" value={money(voucher.balance)} highlight />
                            </div>
                        </div>
                    </div>

                    {/* ---------- Items table ---------- */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm print:rounded-none print:shadow-none">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h2 className="flex items-center text-lg font-semibold text-gray-900">
                                <svg className="mr-2 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                </svg>
                                Item Details
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">#</th>
                                        <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Item
                                        </th>
                                        <th className="border-b px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Qty
                                        </th>
                                        {hasUnit && (
                                            <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Unit
                                            </th>
                                        )}
                                        {hasMon && (
                                            <th className="border-b px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Mon
                                            </th>
                                        )}
                                        <th className="border-b px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Rate
                                        </th>
                                        <th className="border-b px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {lines.map((l, idx) => (
                                        <tr key={idx} className="transition-colors hover:bg-gray-50">
                                            <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-900">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
                                                    {idx + 1}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">{l.item}</td>
                                            <td className="px-6 py-4 text-right font-mono text-sm whitespace-nowrap text-gray-900">{l.qty}</td>
                                            {hasUnit && <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{l.unit_name ?? '—'}</td>}
                                            {hasMon && (
                                                <td className="px-6 py-4 text-right font-mono text-sm whitespace-nowrap text-gray-900">
                                                    {l.mon ?? '—'}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 text-right font-mono text-sm whitespace-nowrap text-gray-900">
                                                ৳{money(l.rate)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-sm font-medium whitespace-nowrap text-gray-900">
                                                ৳{money(l.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td
                                            className="border-l-4 border-blue-400 px-6 py-4 text-right text-sm font-bold text-gray-900"
                                            colSpan={4 + dynamicCols}
                                        >
                                            Total Amount
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-sm font-bold text-gray-900">
                                            ৳{money(voucher.grand_total)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* ---------- Remarks ---------- */}
                    {voucher.remarks && (
                        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm print:rounded-none print:shadow-none">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h2 className="flex items-center text-lg font-semibold text-gray-900">
                                    <svg className="mr-2 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                        />
                                    </svg>
                                    Remarks
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="leading-relaxed whitespace-pre-line text-gray-700">{voucher.remarks}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ---------- Action buttons ---------- */}
                    <div className="flex items-center justify-between gap-4 print:hidden">
                        <div className="flex space-x-3">
                            <button
                                onClick={printVoucher}
                                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                    />
                                </svg>
                                Print Voucher
                            </button>

                            <button
                                disabled
                                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                Download PDF
                            </button>
                        </div>

                        <Link
                            href={route('party-stock.rent-voucher.index')}
                            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
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
