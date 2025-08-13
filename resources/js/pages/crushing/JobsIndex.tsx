import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';

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
    capacity?: number | string | null;
    loaded?: number | null;
    duration_min?: number | null;
    utilization?: number | null; // 0..1
};

type JobsPageProps = {
    jobs:
        | {
              data?: Job[];
              links?: any[];
              current_page?: number;
              last_page?: number;
              total?: number;
          }
        | Job[];
};

export default function JobsIndex(props: JobsPageProps) {
    const page = usePage();
    const jobs = Array.isArray(props.jobs) ? props.jobs : (props.jobs.data ?? []);
    const pagination = Array.isArray(props.jobs)
        ? { links: [], currentPage: 1, lastPage: 1, total: jobs.length }
        : {
              links: props.jobs.links ?? [],
              currentPage: props.jobs.current_page ?? 1,
              lastPage: props.jobs.last_page ?? 1,
              total: props.jobs.total ?? jobs.length,
          };

    const stopJob = (id: number) => {
        router.post(route('crushing.jobs.stop', id), {}, { preserveScroll: true });
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

    return (
        <AppLayout>
            <Head title="Crushing Jobs" />
            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-white p-6">
                    <PageHeader title="Crushing Jobs" addLinkHref="/party-stock/convert" addLinkText="+ New Job" />

                    <div className="p-6">
                        <div className="rounded-t bg-indigo-600 px-4 py-2 text-white">
                            <h1 className="text-lg font-semibold">Dryer Runs (Live & History)</h1>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="mb-6 w-full border text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2">#</th>
                                        <th className="border p-2">Status</th>
                                        <th className="border p-2">Date</th>
                                        <th className="border p-2">Ref</th>
                                        <th className="border p-2">Dryer</th>
                                        <th className="border p-2">Godown</th>
                                        <th className="border p-2">Party</th>
                                        <th className="border p-2">Started</th>
                                        <th className="border p-2">Stopped</th>
                                        <th className="border p-2 text-right">Duration (min)</th>
                                        <th className="border p-2 text-right">Loaded</th>
                                        <th className="border p-2 text-right">Capacity</th>
                                        <th className="border p-2 text-right">Utilization</th>
                                        <th className="border p-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((j, i) => (
                                        <tr key={j.id}>
                                            <td className="border p-2 text-center">{i + 1}</td>
                                            <td className="border p-2">
                                                <StatusBadge s={j.status} />
                                            </td>
                                            <td className="border p-2">{j.date ?? '—'}</td>
                                            <td className="border p-2">{j.ref_no}</td>
                                            <td className="border p-2">{j.dryer || '—'}</td>
                                            <td className="border p-2">{j.godown || '—'}</td>
                                            <td className="border p-2">{j.party || 'self'}</td>
                                            <td className="border p-2">{j.started_at || '—'}</td>
                                            <td className="border p-2">{j.stopped_at || '—'}</td>
                                            <td className="border p-2 text-right">{j.duration_min ?? '—'}</td>
                                            <td className="border p-2 text-right">{j.loaded ?? 0}</td>
                                            <td className="border p-2 text-right">{j.capacity ?? '—'}</td>
                                            <td className="border p-2 text-right">
                                                {j.utilization != null ? `${Math.round(j.utilization * 100)}%` : '—'}
                                            </td>
                                            <td className="border p-2">
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
                                                            className="inline-flex items-center rounded bg-orange-600 px-3 py-1 text-white hover:bg-orange-700"
                                                        >
                                                            Stop
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {jobs.length === 0 && (
                                        <tr>
                                            <td colSpan={14} className="p-4 text-center text-slate-500">
                                                No jobs found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            links={pagination.links}
                            currentPage={pagination.currentPage}
                            lastPage={pagination.lastPage}
                            total={pagination.total}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
