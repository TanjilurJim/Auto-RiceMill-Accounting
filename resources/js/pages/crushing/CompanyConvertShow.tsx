import ActionButtons from '@/components/ActionButtons';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

type ConsumedRow = {
    item: string;
    lot?: string | null;
    unit?: string | null;
    qty: number; // always positive in UI
    weight?: number | null; // may be null
    unit_rate?: number | null; // reconstructed input rate
    basis?: 'qty' | 'weight'; // how amount was computed
    amount?: number | null; // line total
};

type GeneratedRow = {
    item: string;
    lot?: string | null;
    unit?: string | null;
    qty: number;
    weight?: number | null;
    is_main?: boolean;
    per_kg_rate?: number | null; // for main
    sale_value?: number | null; // for by-products
    amount?: number | null; // line total (per-kg×kg OR sale_value)
};

interface Props {
    header: {
        date: string | null;
        ref_no: string;
        godown: string;
        remarks: string | null;
    };
    consumed: ConsumedRow[];
    generated: GeneratedRow[];
}

export default function CompanyConvertShow({ header, consumed, generated }: Props) {
    const fmtDate = (d: string | null) => {
        if (!d) return '—';
        const [y, m, dd] = d.split('-');
        return `${dd}-${m}-${y}`;
    };
    const fmt = (n: number | null | undefined, digits = 2) =>
        n === null || n === undefined || isNaN(n as any)
            ? '—'
            : Number(n).toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });

    const consumedTotal = consumed.reduce((s, r) => s + (r.amount ?? 0), 0);
    const generatedTotal = generated.reduce((s, r) => s + (r.amount ?? 0), 0);

    return (
        <AppLayout>
            <Head title={`Conversion ${header.ref_no}`} />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mb-5 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-800">Company Conversion</h1>
                    <Link href={route('company-conversions.index')} className="print:hidden rounded-md border px-3 py-2 text-sm hover:bg-slate-50">
                        ← Back to list
                    </Link>
                </div>

                {/* Header card */}
                <div className="mb-6 rounded-lg border bg-white p-4">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                        <div>
                            <div className="text-xs text-slate-500">Date</div>
                            <div className="font-medium">{fmtDate(header.date)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Ref No</div>
                            <div className="font-medium">{header.ref_no}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Godown</div>
                            <div className="font-medium">{header.godown || '—'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Remarks</div>
                            <div className="font-medium">{header.remarks || '—'}</div>
                        </div>
                    </div>
                </div>

                {/* Consumed */}
                <div className="mb-6 overflow-x-auto rounded-lg border bg-white">
                    <div className="border-b bg-slate-50 p-3 font-semibold">Consumed (Convert-out)</div>
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="p-2 text-left">Item</th>
                                <th className="p-2 text-left">Lot</th>
                                <th className="p-2 text-left">Unit</th>
                                <th className="p-2 text-right">Qty</th>
                                <th className="p-2 text-right">Weight (kg)</th>
                                <th className="p-2 text-right">Rate</th>
                                <th className="p-2 text-right">Amount (৳)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {consumed.map((r, i) => {
                                const rateLabel =
                                    r.unit_rate == null
                                        ? '—'
                                        : r.basis === 'weight'
                                          ? `${fmt(r.unit_rate)} / kg`
                                          : `${fmt(r.unit_rate)} / ${r.unit || 'unit'}`;
                                return (
                                    <tr key={i}>
                                        <td className="p-2">{r.item}</td>
                                        <td className="p-2">{r.lot || '—'}</td>
                                        <td className="p-2">{r.unit || '—'}</td>
                                        <td className="p-2 text-right">-{Math.abs(r.qty).toLocaleString()}</td>
                                        <td className="p-2 text-right">{r.weight ? `-${fmt(Math.abs(r.weight))}` : '—'}</td>
                                        <td className="p-2 text-right">{rateLabel}</td>
                                        <td className="p-2 text-right">{fmt(r.amount)}</td>
                                    </tr>
                                );
                            })}
                            {consumed.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-slate-500">
                                        No rows.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                        {/* subtotal */}
                        {consumed.length > 0 && (
                            <tfoot>
                                <tr className="bg-slate-50">
                                    <td colSpan={6} className="p-2 text-right font-medium">
                                        Subtotal
                                    </td>
                                    <td className="p-2 text-right font-semibold">{fmt(consumedTotal)}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>

                {/* Generated */}
                <div className="overflow-x-auto rounded-lg border bg-white">
                    <div className="border-b bg-slate-50 p-3 font-semibold">Generated (Convert-in)</div>
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="p-2 text-left">Item</th>
                                <th className="p-2 text-left">Lot</th>
                                <th className="p-2 text-left">Unit</th>
                                <th className="p-2 text-right">Qty</th>
                                <th className="p-2 text-right">Weight (kg)</th>
                                <th className="p-2 text-right">Rate / Value</th>
                                <th className="p-2 text-right">Amount (৳)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {generated.map((r, i) => {
                                const isMain = !!r.is_main;
                                return (
                                    <tr key={i}>
                                        <td className="p-2">
                                            <div className="flex items-center gap-2">
                                                <span>{r.item}</span>
                                                <span
                                                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                                        isMain ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                                    }`}
                                                    title={isMain ? 'Main product' : 'By-product'}
                                                >
                                                    {isMain ? 'Main' : 'By-product'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-2">{r.lot || '—'}</td>
                                        <td className="p-2">{r.unit || '—'}</td>
                                        <td className="p-2 text-right">{r.qty.toLocaleString()}</td>
                                        <td className="p-2 text-right">{r.weight ? fmt(r.weight) : '—'}</td>

                                        {/* Rate / Value column */}
                                        <td className="p-2 text-right">
                                            {isMain
                                                ? r.per_kg_rate != null
                                                    ? `${fmt(r.per_kg_rate)} / kg`
                                                    : '—'
                                                : r.sale_value != null
                                                  ? `${fmt(r.sale_value)}`
                                                  : '—'}
                                        </td>

                                        {/* Amount column */}
                                        <td className="p-2 text-right">{fmt(r.amount)}</td>
                                    </tr>
                                );
                            })}
                            {generated.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-slate-500">
                                        No rows.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                        {/* subtotal */}
                        {generated.length > 0 && (
                            <tfoot>
                                <tr className="bg-slate-50">
                                    <td colSpan={6} className="p-2 text-right font-medium">
                                        Subtotal
                                    </td>
                                    <td className="p-2 text-right font-semibold">{fmt(generatedTotal)}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
                <div className="print:hidden mt-6 flex justify-end">
                    <ActionButtons
                        size="md"
                        printText="Print"
                        onPrint={() => window.print()} // simple browser print
                    />
                </div>
            </div>
        </AppLayout>
    );
}
