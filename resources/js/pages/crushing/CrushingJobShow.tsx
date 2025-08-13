import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock3, Cpu, Warehouse } from 'lucide-react';

type Line = {
    source: 'company' | 'party';
    item?: string; // company item name
    lot?: string | null; // lot no
    party_item?: string; // party item name
    qty: number;
    unit_name?: string | null;
};

type JobShowProps = {
    job: {
        id: number;
        ref_no: string;
        date: string | null;
        status: 'running' | 'stopped';
        dryer: string;
        godown: string;
        party?: string | null;
        started_at?: string | null;
        stopped_at?: string | null;
        duration_min?: number | null;
        capacity?: number | string | null;
        loaded?: number | null;
        utilization?: number | null;
        remarks?: string | null;
        posted_ref_no?: string | null;
    };
    lines: Line[];
};

export default function CrushingJobShow({ job, lines }: JobShowProps) {
    const totalQty = lines.reduce((s, l) => s + (Number(l.qty) || 0), 0);

    return (
        <AppLayout>
            <Head title={`Job ${job.ref_no}`} />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-slate-800">Crushing Job Details</h1>
                    <Link
                        href={route('crushing.jobs.index')}
                        className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-300 ring-inset hover:bg-slate-50"
                    >
                        <ArrowLeft size={16} />
                        Back to Jobs
                    </Link>
                    {job.status === 'running' && (
                        <button
                            onClick={() => router.post(route('crushing.jobs.stop', job.id))}
                            className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                        >
                            Stop Job
                        </button>
                    )}
                    {job.status === 'stopped' && !job.posted_ref_no && (
                        <Link
                            href={route('party-stock.transfer.create', { job: job.id })}
                            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            Enter generated items
                        </Link>
                    )}

                    {job.posted_ref_no && (
                        <Link
                            // if you later add a "show by ref" route, point directly there.
                            href={route('party-stock.transfer.index')}
                            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
                        >
                            View conversion
                        </Link>
                    )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    {/* Meta */}
                    <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                        <Meta icon={<Calendar size={18} />} label="Date" value={job.date ?? '—'} />
                        <Meta icon={<Cpu size={18} />} label="Dryer" value={job.dryer} />
                        <Meta icon={<Warehouse size={18} />} label="Godown" value={job.godown} />
                        <Meta icon={<Clock3 size={18} />} label="Started" value={job.started_at ?? '—'} />
                        <Meta icon={<Clock3 size={18} />} label="Stopped" value={job.stopped_at ?? '—'} />
                        <Meta icon={<Clock3 size={18} />} label="Duration" value={job.duration_min != null ? `${job.duration_min} min` : '—'} />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Stat label="Loaded Qty" value={fmt(job.loaded)} />
                        <Stat label="Capacity" value={fmt(job.capacity)} />
                        <Stat label="Utilization" value={job.utilization != null ? `${Math.round(job.utilization * 100)}%` : '—'} />
                    </div>

                    {job.remarks && (
                        <div className="mt-6 rounded-md bg-blue-50 p-4 text-sm text-blue-800 ring-1 ring-blue-200">
                            <strong className="font-semibold">Remarks:</strong> <span className="ml-1">{job.remarks}</span>
                        </div>
                    )}

                    {/* Lines */}
                    <div className="mt-8 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2">Source</th>
                                    <th className="border p-2">Item</th>
                                    <th className="border p-2">Lot</th>
                                    <th className="border p-2 text-right">Qty</th>
                                    <th className="border p-2 text-center">Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lines.map((l, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="border p-2">{l.source}</td>
                                        <td className="border p-2">{l.source === 'company' ? (l.item ?? '—') : (l.party_item ?? '—')}</td>
                                        <td className="border p-2">{l.source === 'company' ? (l.lot ?? '—') : '—'}</td>
                                        <td className="border p-2 text-right">{Number(l.qty).toLocaleString()}</td>
                                        <td className="border p-2 text-center">{l.unit_name ?? '—'}</td>
                                    </tr>
                                ))}
                                {lines.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-slate-500">
                                            No lines found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-slate-100 font-semibold">
                                <tr>
                                    <td className="border p-2 text-right" colSpan={3}>
                                        Total
                                    </td>
                                    <td className="border p-2 text-right">{totalQty.toLocaleString()}</td>
                                    <td className="border p-2"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 text-sm">
            <div className="text-slate-500">{icon}</div>
            <div>
                <span className="font-semibold text-slate-800">{label}:</span>
                <span className="ml-2 text-slate-600">{value}</span>
            </div>
        </div>
    );
}
function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs text-slate-500">{label}</div>
            <div className="text-lg font-semibold text-slate-800">{value}</div>
        </div>
    );
}
function fmt(v: any) {
    return (v ?? v === 0) ? String(v) : '—';
}
