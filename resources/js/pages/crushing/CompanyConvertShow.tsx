import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

type MoveRow = {
    item: string;
    lot?: string | null;
    qty: number;
    unit?: string | null;
    
};

interface Props {
    header: {
        date: string | null;
        ref_no: string;
        godown: string;
        remarks: string | null;
    };
    consumed: MoveRow[];
    generated: MoveRow[];
}

export default function CompanyConvertShow({ header, consumed, generated }: Props) {
    const fmtDate = (d: string | null) => {
        if (!d) return '—';
        const [y, m, dd] = d.split('-');
        return `${dd}-${m}-${y}`;
    };

    return (
        <AppLayout>
            <Head title={`Conversion ${header.ref_no}`} />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mb-5 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-800">Company Conversion</h1>
                    <Link href={route('company-conversions.index')} className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50">
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
                                <th className="p-2 text-left"> Unit</th>
                                <th className="p-2 text-right">Qty</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {consumed.map((r, i) => (
                                <tr key={i}>
                                    <td className="p-2">{r.item}</td>
                                    <td className="p-2">{r.lot || '—'}</td>
                                    <td className="p-2">{r.unit || '—'}</td>
                                    <td className="p-2 text-right">-{Math.abs(r.qty).toLocaleString()}</td>
                                </tr>
                            ))}
                            {consumed.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-4 text-center text-slate-500">
                                        No rows.
                                    </td>
                                </tr>
                            )}
                        </tbody>
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {generated.map((r, i) => (
                                <tr key={i}>
                                    <td className="p-2">{r.item}</td>
                                    <td className="p-2">{r.lot || '—'}</td>
                                    <td className="p-2">{r.unit || '—'}</td>
                                    <td className="p-2 text-right">{r.qty.toLocaleString()}</td>
                                </tr>
                            ))}
                            {generated.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-4 text-center text-slate-500">
                                        No rows.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
