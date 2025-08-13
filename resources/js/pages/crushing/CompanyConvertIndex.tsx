import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Printer, Eye } from 'lucide-react';
import React from 'react';

type ItemRow = {
    item_name: string;
    unit_name?: string | null;
    qty: number;
    move_type: 'convert-in' | 'convert-out';
    lot?: string | null; // will render as '—' if missing
};

type Conversion = {
    id: number;
    ref_no: string;
    date: string | null; // e.g. "2025-08-10"
    godown_name: string; // <- matches backend
    remarks: string | null;
    items: ItemRow[];
};

type PaginationLink = { url: string | null; label: string; active: boolean };
type Pagination = {
    links: PaginationLink[];
    currentPage: number;
    lastPage: number;
    total: number;
};

interface Props {
    conversions: Conversion[];
    pagination: Pagination;
}

export default function CompanyConvertIndex({ conversions, pagination }: Props) {
    const [open, setOpen] = React.useState<Record<string, boolean>>({});

    const fmtDate = (d: string | null) => {
        if (!d) return '—';
        const [y, m, dd] = d.split('-');
        return `${dd}-${m}-${y}`; // UI-only
    };

    return (
        <AppLayout>
            <Head title="Company Conversions" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mb-5 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-800">Company Stock Conversions</h1>

                    <Link
                        href={route('party-stock.transfer.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
                    >
                        New Conversion
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Ref No</th>
                                <th className="p-3 text-left">Godown</th>
                                <th className="p-3 text-left">Remarks</th>
                                <th className="p-3 text-right">Net Qty</th>
                                <th className="p-3 text-right">Lines</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {conversions.map((c) => {
                                const net = c.items.reduce((sum, it) => {
                                    return sum + (it.move_type === 'convert-in' ? it.qty : -Math.abs(it.qty));
                                }, 0);
                                const lines = c.items.length;

                                return (
                                    <React.Fragment key={c.ref_no}>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-3">{fmtDate(c.date)}</td>
                                            <td className="p-3 font-medium text-slate-800">{c.ref_no}</td>
                                            <td className="p-3">{c.godown_name || '—'}</td>
                                            <td className="p-3">{c.remarks || '—'}</td>
                                            <td className="p-3 text-right">{net.toLocaleString()}</td>
                                            <td className="p-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpen((s) => ({ ...s, [c.ref_no]: !s[c.ref_no] }))}
                                                    className="rounded border px-2 py-1 text-xs hover:bg-slate-50"
                                                    title="Show lines"
                                                >
                                                    {lines} {open[c.ref_no] ? '▲' : '▼'}
                                                </button>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('company-conversions.show', c.id)} // 👈 go to show page
                                                        className="inline-flex items-center rounded border px-2 py-1 text-xs hover:bg-slate-50"
                                                        title="View"
                                                    >
                                                        <Eye size={14} />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => window.print()}
                                                        className="inline-flex items-center rounded border px-2 py-1 text-xs hover:bg-slate-50"
                                                        title="Print"
                                                        
                                                    >
                                                        <Printer size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {open[c.ref_no] && (
                                            <tr>
                                                <td colSpan={7} className="bg-slate-50 p-0">
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-xs">
                                                            <thead className="bg-white text-slate-500">
                                                                <tr>
                                                                    <th className="p-2 text-left">Type</th>
                                                                    <th className="p-2 text-left">Item</th>
                                                                    <th className="p-2 text-left">Lot</th>
                                                                    <th className="p-2 text-right">Qty</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-200">
                                                                {c.items.map((it, i) => (
                                                                    <tr key={i} className="bg-white">
                                                                        <td className="p-2">
                                                                            {it.move_type === 'convert-in' ? 'Generated (+)' : 'Consumed (−)'}
                                                                        </td>
                                                                        <td className="p-2">{it.item_name}</td>
                                                                        <td className="p-2">{it.lot || '—'}</td>
                                                                        <td className="p-2 text-right">
                                                                            {it.move_type === 'convert-out' ? '-' : ''}
                                                                            {Math.abs(it.qty).toLocaleString()}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}

                            {conversions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-6 text-center text-slate-500">
                                        No conversions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {pagination.links.map((l, i) => (
                        <Link
                            key={i}
                            href={l.url || '#'}
                            className={`rounded border px-3 py-1 text-sm ${l.active ? 'bg-slate-800 text-white' : 'bg-white hover:bg-slate-50'}`}
                            dangerouslySetInnerHTML={{ __html: l.label }}
                        />
                    ))}
                    <div className="ml-auto text-sm text-slate-500">
                        Page {pagination.currentPage} of {pagination.lastPage} • {pagination.total} total
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
