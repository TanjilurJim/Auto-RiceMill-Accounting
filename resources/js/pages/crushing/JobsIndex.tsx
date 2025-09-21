import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import React from 'react';

type Job = {
    id: number;
    ref_no: string;
    date: string | null;
    status: 'running' | 'stopped';
    dryer: string;
    godown: string;
    party?: string | null;
    started_at?: string | null;
    stopped_at?: string | null;
    capacity?: number | string | null; // expected kg
    loaded?: number | null; // summed from party_stock_moves (convert-out), kg
    duration_min?: number | null;
    utilization?: number | null; // 0..1
};

type PaginatedJobs = {
    data?: Job[];
    links?: any[];
    current_page?: number;
    last_page?: number;
    total?: number;
};

type JobsPageProps = {
    jobs: PaginatedJobs | Job[];
};

export default function JobsIndex(props: JobsPageProps) {
    const jobs: Job[] = Array.isArray(props.jobs) ? props.jobs : (props.jobs.data ?? []);
    const pagination = Array.isArray(props.jobs)
        ? { links: [], currentPage: 1, lastPage: 1, total: jobs.length }
        : {
              links: props.jobs.links ?? [],
              currentPage: props.jobs.current_page ?? 1,
              lastPage: props.jobs.last_page ?? 1,
              total: props.jobs.total ?? jobs.length,
          };

    const [stoppingJobId, setStoppingJobId] = React.useState<number | null>(null);

    const stopJob = (id: number) => {
        setStoppingJobId(id);
        router.post(
            route('crushing.jobs.stop', id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setStoppingJobId(null),
                onError: () => setStoppingJobId(null),
            },
        );
    };

    const StatusBadge = ({ s }: { s: Job['status'] }) => (
        <span
            className={
                'rounded px-2 py-0.5 text-xs font-semibold ' + (s === 'running' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700')
            }
        >
            {s === 'running' ? 'Running' : 'Stopped'}
        </span>
    );

    // Table columns for TableComponent
    const tableColumns = [
        { header: '#', accessor: (_: Job, i: number) => i + 1, className: 'text-center w-12' },
        { header: 'স্ট্যাটাস', accessor: (j: Job) => <StatusBadge s={j.status} />, className: 'w-24' },
        { header: 'তারিখ', accessor: 'date', className: 'w-24' },
        { header: 'রেফারেন্স নং', accessor: 'ref_no', className: 'w-28' },
        { header: 'ড্রায়ার', accessor: 'dryer', className: 'w-32' },
        { header: 'গুদাম', accessor: 'godown', className: 'w-32' },
        { header: 'পার্টি', accessor: (j: Job) => j.party || 'self', className: 'w-32' },
        { header: 'শুরু', accessor: 'started_at', className: 'w-36' },
        { header: 'বন্ধ', accessor: 'stopped_at', className: 'w-36' },
        { header: 'সময়', accessor: (j: Job) => formatDuration(j.started_at, j.stopped_at), className: 'w-32 text-right' },
        {
            header: 'লোড (kg / t)',
            accessor: (j: Job) => {
                const kg = Math.abs(Number(j.loaded ?? 0));
                const ton = kg / 1000;
                return kg ? (
                    <>
                        {kg.toFixed(3)} kg <span className="ml-1 text-xs text-slate-500">({ton.toFixed(3)} t)</span>
                    </>
                ) : (
                    '—'
                );
            },
            className: 'w-40 text-right font-mono whitespace-nowrap',
        },
        {
            header: 'ক্যাপাসিটি (Ton)',
            accessor: (j: Job) => {
                const cap = j.capacity != null ? Number(j.capacity) : null;
                return cap != null && isFinite(cap) ? cap.toFixed(3) : '—';
            },
            className: 'w-28 text-right font-mono',
        },
        {
            header: 'ইউটিলাইজেশন',
            accessor: (j: Job) => {
                const util = j.utilization != null ? j.utilization * 100 : null;
                return util != null && isFinite(util) ? `${util.toFixed(0)}%` : '—';
            },
            className: 'w-28 text-right font-mono',
        },
    ];

    return (
        <AppLayout>
            <Head title="Crushing Jobs" />
            <div className="bg-background h-full w-screen p-6 lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">
                    {/* Header: title left, action right */}
                    <div className="mb-4 flex items-center justify-between">
                        <PageHeader title="Crushing Jobs" />
                        <Link
                            href={route('party-stock.transfer.create')}
                            className="rounded-sm bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
                        >
                            New Crushing Job
                        </Link>
                    </div>
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <TableComponent
                            columns={tableColumns}
                            data={jobs}
                            actions={(j: Job) => (
                                <div className="flex items-center justify-center gap-2">
                                    <Link
                                        href={route('crushing.jobs.show', j.id)}
                                        className="inline-flex items-center rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                                    >
                                        View
                                    </Link>
                                    {j.status === 'running' && (
                                        <button
                                            onClick={() => stopJob(j.id)}
                                            disabled={stoppingJobId === j.id}
                                            className={
                                                'inline-flex items-center rounded px-3 py-1 text-white ' +
                                                (stoppingJobId === j.id ? 'cursor-not-allowed bg-orange-400' : 'bg-orange-600 hover:bg-orange-700')
                                            }
                                        >
                                            {stoppingJobId === j.id ? 'Stopping...' : 'Stop'}
                                        </button>
                                    )}
                                </div>
                            )}
                            noDataMessage="No jobs found."
                        />
                    </div>
                    {/* Pagination */}
                    <Pagination
                        links={pagination.links}
                        currentPage={pagination.currentPage}
                        lastPage={pagination.lastPage}
                        total={pagination.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
function formatDuration(start?: string | null, stop?: string | null) {
    if (!start || !stop) return '—';
    const s = new Date(start).getTime();
    const e = new Date(stop).getTime();
    if (!isFinite(s) || !isFinite(e)) return '—';

    let seconds = Math.abs(Math.round((e - s) / 1000));
    const h = Math.floor(seconds / 3600);
    seconds -= h * 3600;
    const m = Math.floor(seconds / 60);
    seconds -= m * 60;

    const parts: string[] = [];
    if (h) parts.push(`${h} hour${h === 1 ? '' : 's'}`);
    parts.push(`${m} minute${m === 1 ? '' : 's'}`);
    parts.push(`${seconds} second${seconds === 1 ? '' : 's'}`);
    return parts.join(' ');
}
