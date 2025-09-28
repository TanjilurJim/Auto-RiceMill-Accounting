/* resources/js/pages/crushing/PartyStockConvertIndex.tsx */
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Printer, Trash2 } from 'lucide-react';
import React from 'react';

type ItemRow = {
    item_name: string;
    unit_name: string;
    qty: number;
    move_type: 'convert-in' | 'convert-out';
};

type Conversion = {
    id: number;
    date: string; // e.g. "2025-08-10"
    ref_no: string;
    party_ledger_name: string;
    godown_name: string;
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

export default function PartyStockConvertIndex({ conversions, pagination }: Props) {
    const [open, setOpen] = React.useState<Record<number, boolean>>({});

    const fmtDate = (d: string | null) => {
        if (!d) return '—';
        // show dd-mm-yyyy but do NOT send this back to API anywhere
        const [y, m, dd] = d.split('-');
        return `${dd}-${m}-${y}`;
    };

    const onDelete = (id: number) => {
        if (!confirm('Delete this conversion? This will reverse all moves.')) return;
        router.delete(route('party-stock.transfer.destroy', id));
    };

    return (
        <AppLayout>
            <Head title="Conversions" />
            <div className="p-4 md:p-12">
                <div className="mb-5 flex items-center justify-between">
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">Stock Conversions</h1>
                    <Link
                        href={route('party-stock.transfer.create')}
                        className="rounded-sm bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
                    >
                        New Conversion
                    </Link>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-background">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="p-3 text-left">তারিখ</th>
                                <th className="p-3 text-left">রেফারেন্স নং</th>
                                <th className="p-3 text-left">পার্টি</th>
                                {/* <th className="p-3 text-left">গুদাম</th> */}
                                <th className="p-3 text-left">মন্তব্য</th>
                                {/* <th className="p-3 text-right">Net Qty</th>
                                <th className="p-3 text-right">Lines</th> */}
                                <th className="p-3 text-right">এ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {conversions.map((c) => {
                                const net = c.items.reduce((sum, it) => sum + (it.move_type === 'convert-in' ? it.qty : -Math.abs(it.qty)), 0);
                                return (
                                    <React.Fragment key={c.id}>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-3">{fmtDate(c.date)}</td>
                                            <td className="p-3 font-medium text-slate-800">{c.ref_no}</td>
                                            <td className="p-3">{c.party_ledger_name || '—'}</td>
                                            {/* <td className="p-3">{c.godown_name || '—'}</td> */}
                                            <td className="p-3">{c.remarks || '—'}</td>
                                            {/* <td className="p-3 text-right">{net.toLocaleString()}</td> */}
                                            {/* <td className="p-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpen((s) => ({ ...s, [c.id]: !s[c.id] }))}
                                                    className="rounded border px-2 py-1 text-xs hover:bg-slate-50"
                                                    title="Show lines"
                                                >
                                                    {c.items.length} {open[c.id] ? '▲' : '▼'}
                                                </button>
                                            </td> */}
                                            <td className="p-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('party-stock.transfer.show', c.id)}
                                                        className="inline-flex items-center rounded border px-2 py-1 text-xs hover:bg-slate-50"
                                                        title="View"
                                                    >
                                                        <Eye size={14} />
                                                    </Link>
                                                    <Link
                                                        href={route('party-stock.transfer.edit', c.id)}
                                                        className="inline-flex items-center rounded border px-2 py-1 text-xs hover:bg-slate-50"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={14} />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => onDelete(c.id)}
                                                        className="inline-flex items-center rounded border px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
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

                                        {/* Expanded item rows */}
                                        {open[c.id] && (
                                            <tr>
                                                <td colSpan={8} className="bg-slate-50 p-0">
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-xs">
                                                            <thead className="bg-background text-slate-500">
                                                                <tr>
                                                                    <th className="p-2 text-left">Type</th>
                                                                    <th className="p-2 text-left">Item</th>
                                                                    <th className="p-2 text-left">Unit</th>
                                                                    <th className="p-2 text-right">Qty</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-200">
                                                                {c.items.map((it, i) => (
                                                                    <tr key={i} className="bg-background">
                                                                        <td className="p-2">
                                                                            {it.move_type === 'convert-in' ? 'Generated (+)' : 'Consumed (−)'}
                                                                        </td>
                                                                        <td className="p-2">{it.item_name}</td>
                                                                        <td className="p-2">{it.unit_name || '—'}</td>
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
                                    <td colSpan={8} className="p-6 text-center text-slate-500">
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
                            className={`rounded border px-3 py-1 text-sm ${l.active ? 'bg-background' : 'bg-background hover:bg-foreground/10'}`}
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
