// resources/js/pages/crushing/PartyStockDepositShow.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

type Header = {
    date: string;
    ref_no: string | null;
    party: string;
    godown: string;
    remarks?: string | null;
    total_qty: number;
    total_weight?: number | null;
    total_amount: number;
};

type Line = {
    item_name: string;
    unit_name?: string | null;
    qty: number;
    rate?: number | null;
    total?: number | null;
    weight?: number | null;
    bosta_weight?: number | null;
};

type Balance = {
    party_item_id: number;
    item_name: string;
    qty: number;
    unit_name?: string | null;
};

export default function PartyStockDepositShow({ header, items, balances = [] }: { header: Header; items: Line[]; balances?: Balance[] }) {
    const fmtNum = (n: number | null | undefined, d = 3) => (n != null && isFinite(n) ? n.toFixed(d) : '—');
    const fmtMoney = (n: number | null | undefined) => (n != null && isFinite(n) ? n.toFixed(2) : '—');

    return (
        <AppLayout>
            <Head title={`Deposit ${header.ref_no ?? ''}`} />
            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="rounded-lg">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-xl font-bold">Party Stock Deposit</h1>
                        <Link
                            href={route('party-stock.deposit.index')}
                            className="rounded bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
                        >
                            ← Back to list
                        </Link>
                    </div>

                    {/* Header meta */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <Meta label="Date" value={header.date} />
                        <Meta label="Ref No" value={header.ref_no ?? '—'} />
                        <Meta label="Party" value={header.party || '—'} />
                        <Meta label="Godown" value={header.godown || '—'} />
                        <Meta label="Total Qty" value={fmtNum(header.total_qty, 3)} />
                        <Meta label="Total Weight (kg)" value={fmtNum(header.total_weight ?? null, 3)} />
                        <Meta label="Total Amount" value={fmtMoney(header.total_amount)} />
                    </div>

                    {header.remarks && (
                        <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800 ring-1 ring-blue-200">
                            <strong className="font-semibold">Remarks:</strong> <span className="ml-1">{header.remarks}</span>
                        </div>
                    )}

                    {/* Deposit lines */}
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2 text-left">Item</th>
                                    <th className="border p-2 text-left">Unit</th>
                                    <th className="border p-2 text-right">Qty</th>
                                    <th className="border p-2 text-right">Rate (TK)</th>
                                    <th className="border p-2 text-right">Amount</th>
                                    <th className="border p-2 text-right">Total Weight (kg)</th>
                                    <th className="border p-2 text-right">Per-Bosta kg</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((l, i) => (
                                    <tr key={i} className="hover:bg-background">
                                        <td className="border p-2">{l.item_name}</td>
                                        <td className="border p-2">{l.unit_name ?? '—'}</td>
                                        <td className="border p-2 text-right tabular-nums">{fmtNum(l.qty, 3)}</td>
                                        <td className="border p-2 text-right tabular-nums">{fmtMoney(l.rate ?? null)}</td>
                                        <td className="border p-2 text-right tabular-nums">{fmtMoney(l.total ?? null)}</td>
                                        <td className="border p-2 text-right tabular-nums">{fmtNum(l.weight ?? null, 3)}</td>
                                        <td className="border p-2 text-right tabular-nums">{fmtNum(l.bosta_weight ?? null, 3)}</td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-4 text-center text-slate-500">
                                            No items.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-background">
                                <tr>
                                    <td className="border p-2 text-right font-semibold" colSpan={2}>
                                        Total
                                    </td>
                                    <td className="border p-2 text-right font-semibold tabular-nums">{fmtNum(header.total_qty, 3)}</td>
                                    <td className="border p-2" />
                                    <td className="border p-2 text-right font-semibold tabular-nums">{fmtMoney(header.total_amount)}</td>
                                    <td className="border p-2 text-right font-semibold tabular-nums">{fmtNum(header.total_weight ?? null, 3)}</td>
                                    <td className="border p-2" />
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* 🔹 NEW: Current Balance (this godown) */}
                    <div className="mt-8">
                        <h2 className="mb-2 text-lg font-semibold">Current Balance (this godown)</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2 text-left">Item</th>
                                        <th className="border p-2 text-right">Current Qty</th>
                                        <th className="border p-2 text-left">Unit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {balances.map((b, i) => (
                                        <tr key={i} className="hover:bg-bacground">
                                            <td className="border p-2">{b.item_name}</td>
                                            <td className="border p-2 text-right tabular-nums">{fmtNum(b.qty, 3)}</td>
                                            <td className="border p-2">{b.unit_name ?? '—'}</td>
                                        </tr>
                                    ))}
                                    {balances.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="p-4 text-center text-slate-500">
                                                No balance rows.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function Meta({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded border bg-slate-50 p-3">
            <div className="text-[11px] tracking-wide text-slate-500 uppercase">{label}</div>
            <div className="text-base font-semibold text-slate-800">{value}</div>
        </div>
    );
}
