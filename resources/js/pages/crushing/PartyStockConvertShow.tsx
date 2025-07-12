import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, ChevronsRight, FileText, MessageSquare, Printer, User, Warehouse } from 'lucide-react';

// Interfaces (no change)
interface Line {
    item: string;
    qty: number;
    unit: string;
}
interface Props {
    header: { date: string; ref_no: string; party: string; godown: string; remarks: string | null };
    consumed: Line[];
    generated: Line[];
}

// Reusable component for displaying table data
const LineItemTable = ({ title, items }: { title: string; items: Line[] }) => {
    const totalQty = items.reduce((sum, line) => sum + (+line.qty || 0), 0);

    return (
        <div className="rounded-lg border border-slate-200 bg-white">
            <h3 className="border-b border-slate-200 bg-slate-50 p-3 text-base font-semibold text-slate-700">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-slate-500">
                        <tr>
                            <th className="p-3 text-left font-medium">Item</th>
                            <th className="p-3 text-right font-medium">Quantity</th>
                            <th className="p-3 text-center font-medium">Unit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {items.map((line, index) => (
                            <tr key={index} className="hover:bg-slate-50">
                                <td className="p-3">{line.item}</td>
                                <td className="p-3 text-right">{line.qty.toLocaleString()}</td>
                                <td className="p-3 text-center">{line.unit}</td>
                            </tr>
                        ))}
                        {/* Show this message if there are no items */}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-4 text-center text-slate-500">
                                    No items to display.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot className="border-t-2 border-slate-300 bg-slate-100 font-bold">
                        <tr>
                            <td className="p-3 text-right">Total</td>
                            <td className="p-3 text-right">{totalQty.toLocaleString()}</td>
                            <td className="p-3"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

// Reusable component for header details
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-center gap-3 text-sm">
        <div className="flex-shrink-0 text-slate-500">{icon}</div>
        <div>
            <span className="font-semibold text-slate-800">{label}:</span>
            <span className="ml-2 text-slate-600">{value}</span>
        </div>
    </div>
);

export default function PartyStockConvertShow({ header, consumed, generated }: Props) {
    return (
        <AppLayout>
            <Head title={`Conversion ${header.ref_no}`} />

            <div className="p-4 sm:p-6 lg:p-8">
                {/* ── Header & Back Link ─────────────────── */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-slate-800">Stock Conversion Details</h1>

                    {/* Action Buttons Container */}
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('party-stock.transfer.index')}
                            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-300 ring-inset hover:bg-slate-50 print:hidden"
                        >
                            <ArrowLeft size={16} />
                            Back to List
                        </Link>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 print:hidden"
                        >
                            <Printer size={16} />
                            Print
                        </button>
                    </div>
                </div>

                {/* ── Main Voucher Card ─────────────────── */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    {/* ── Meta Information ─────────────────── */}
                    <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-slate-200 pb-6 sm:grid-cols-2">
                        <InfoItem icon={<FileText size={20} />} label="Reference No" value={header.ref_no} />
                        <InfoItem icon={<Calendar size={20} />} label="Date" value={header.date} />
                        <InfoItem icon={<User size={20} />} label="Party" value={header.party} />
                        <InfoItem icon={<Warehouse size={20} />} label="Godown" value={header.godown} />
                    </div>

                    {/* ── Remarks Section ─────────────────── */}
                    {header.remarks && (
                        <div className="mt-6">
                            <div className="flex items-start gap-3 rounded-md bg-blue-50 p-4 ring-1 ring-blue-200 ring-inset">
                                <MessageSquare size={20} className="flex-shrink-0 text-blue-600" />
                                <div>
                                    <h4 className="font-semibold text-blue-800">Remarks</h4>
                                    <p className="mt-1 text-sm text-blue-700">{header.remarks}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Conversion Tables Section ─────────────────── */}
                    <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[2fr_auto_2fr] lg:gap-6">
                        {/* Consumed Table */}
                        <LineItemTable title="Items Consumed" items={consumed} />

                        {/* Conversion Arrow (visible on large screens) */}
                        <div className="hidden place-content-center pt-16 lg:grid">
                            <ChevronsRight size={48} className="text-slate-300" />
                        </div>

                        {/* Generated Table */}
                        <LineItemTable title="Items Generated" items={generated} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
