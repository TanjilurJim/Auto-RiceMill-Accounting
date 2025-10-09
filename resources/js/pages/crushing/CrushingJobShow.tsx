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
        capacity?: number | string | null; // TON in DB
        loaded?: number | null; // KG
        utilization?: number | null; // (ignored here; we recalc client-side)
        remarks?: string | null;
        posted_ref_no?: string | null;
    };
    lines: Line[];
};

export default function CrushingJobShow({ job, lines }: JobShowProps) {
    const totalQty = lines.reduce((s, l) => s + (Number(l.qty) || 0), 0);

    // ---- Derived metrics (capacity in TON, loaded in KG) ----
    const loadedKg = Math.abs(Number(job.loaded ?? 0));
    const capacityTon = job.capacity != null ? Number(job.capacity) : null;
    const utilizationPct = capacityTon && isFinite(capacityTon) && capacityTon > 0 ? (loadedKg / (capacityTon * 1000)) * 100 : null;

    return (
        <AppLayout>
            <Head title={`Job ${job.ref_no}`} />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-foreground">Crushing Job Details</h1>
                    <Link
                        href={route('crushing.jobs.index')}
                        className="inline-flex items-center gap-2 rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm ring-1 ring-slate-300 ring-inset hover:bg-background"
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
                            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-foreground hover:bg-indigo-500"
                        >
                            Enter generated items
                        </Link>
                    )}

                    {job.posted_ref_no && (
                        <Link
                            href={route('party-stock.transfer.index')}
                            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-foreground hover:bg-green-500"
                        >
                            View conversion
                        </Link>
                    )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-background p-6 shadow-sm">
                    {/* Meta */}
                    <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                        <Meta icon={<Calendar size={18} />} label="Date" value={job.date ?? '—'} />
                        <Meta icon={<Cpu size={18} />} label="Dryer" value={job.dryer} />
                        <Meta icon={<Warehouse size={18} />} label="Godown" value={job.godown} />
                        <Meta icon={<Clock3 size={18} />} label="Started" value={job.started_at ?? '—'} />
                        <Meta icon={<Clock3 size={18} />} label="Stopped" value={job.stopped_at ?? '—'} />
                        <Meta icon={<Clock3 size={18} />} label="Duration" value={formatDuration(job.started_at, job.stopped_at)} />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Stat label="Loaded" value={fmtKg(loadedKg)} />
                        <Stat label="Capacity" value={fmtTon(capacityTon)}  />
                        <Stat label="Utilization" value={utilizationPct != null ? `${utilizationPct.toFixed(0)}%` : '—'} />
                    </div>

                    {job.remarks && (
                        <div className="mt-6 rounded-md bg-background p-4 text-sm text-blue-800 ring-1 ring-blue-200">
                            <strong className="font-semibold">Remarks:</strong> <span className="ml-1">{job.remarks}</span>
                        </div>
                    )}

                    {/* Lines */}
                    <div className="mt-8 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-background">
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
                                    <tr key={i} className="hover:bg-background">
                                        <td className="border p-2">{l.source}</td>
                                        <td className="border p-2">{l.source === 'company' ? (l.item ?? '—') : (l.party_item ?? '—')}</td>
                                        <td className="border p-2">{l.source === 'company' ? (l.lot ?? '—') : '—'}</td>
                                        <td className="border p-2 text-right">{Number(l.qty).toLocaleString()}</td>
                                        <td className="border p-2 text-center">{l.unit_name ?? '—'}</td>
                                    </tr>
                                ))}
                                {lines.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-foreground">
                                            No lines found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-background font-semibold">
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
            <div className="text-foreground">{icon}</div>
            <div>
                <span className="font-semibold text-foreground">{label}:</span>
                <span className="ml-2 text-foreground">{value}</span>
            </div>
        </div>
    );
}
function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-background p-3">
            <div className="text-xs text-foreground">{label}</div>
            <div className="text-lg font-semibold text-foreground">{value}</div>
        </div>
    );
}
function fmt(v: any) {
    return (v ?? v === 0) ? String(v) : '—';
}
function fmtKg(kg: number | null) {
    if (kg == null || !isFinite(kg) || kg === 0) return '—';
    const t = kg / 1000;
    return `${kg.toFixed(3)} kg (${t.toFixed(3)} Ton)`;
}
function fmtTon(t: number | null) {
    if (t == null || !isFinite(t)) return '—';
    return `${t.toFixed(3)} Ton`;
}
function formatDuration(start?: string | null, stop?: string | null) {
  if (!start || !stop) return '—';
  const s = new Date(start).getTime();
  const e = new Date(stop).getTime();
  if (!isFinite(s) || !isFinite(e)) return '—';

  let seconds = Math.abs(Math.round((e - s) / 1000));
  const h = Math.floor(seconds / 3600); seconds -= h * 3600;
  const m = Math.floor(seconds / 60);   seconds -= m * 60;

  const parts: string[] = [];
  if (h) parts.push(`${h} hour${h === 1 ? '' : 's'}`);
  parts.push(`${m} minute${m === 1 ? '' : 's'}`);
  parts.push(`${seconds} second${seconds === 1 ? '' : 's'}`);
  return parts.join(' ');
}