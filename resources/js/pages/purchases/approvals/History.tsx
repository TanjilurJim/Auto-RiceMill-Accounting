import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

/* ---------- types --------------------------------------------------------- */
interface ApprovalRow {
    id: number;
    action: 'approved' | 'rejected';
    note?: string | null;
    created_at: string;

    purchase: {
        id: number;
        voucher_no: string;
        date: string;
        grand_total: string | number;
        account_ledger?: { account_ledger_name: string }; // supplier name
    };
}

interface Paginator {
    data: ApprovalRow[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

/* ---------- helpers ------------------------------------------------------- */
const badge = (a: 'approved' | 'rejected') => (
    <span className={'rounded px-2 py-0.5 text-xs font-semibold ' + (a === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
        {a.charAt(0).toUpperCase() + a.slice(1)}
    </span>
);

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB'); // dd/mm/yyyy

const fmtTk = (n: string | number) => `${new Intl.NumberFormat('en-BD', { minimumFractionDigits: 2 }).format(Number(n))} Tk`;

/* ---------- component ----------------------------------------------------- */
export default function History({ approvals }: { approvals: Paginator }) {
    return (
        <AppLayout>
            <Head title="Approval Log" />

            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg ">
                    <PageHeader title="Approval Log"></PageHeader>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                        <table className="w-full text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs tracking-wider text-gray-600 uppercase dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-400">
                                <tr>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Voucher</th>
                                    <th className="p-3">Supplier</th>
                                    <th className="p-3 text-right">Total</th>
                                    <th className="p-3">Result</th>
                                    <th className="p-3">Note</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                                {approvals.data.length ? (
                                    approvals.data.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                                            <td className="p-3 whitespace-nowrap">{fmtDate(row.purchase.date)}</td>

                                            <td className="p-3 whitespace-nowrap">
                                                <Link
                                                    href={`/purchases/${row.purchase.id}`}
                                                    className="font-medium text-sky-600 hover:underline dark:text-sky-500"
                                                >
                                                    {row.purchase.voucher_no}
                                                </Link>
                                            </td>

                                            <td className="p-3">{row.purchase.account_ledger?.account_ledger_name ?? '—'}</td>
                                            <td className="p-3 text-right whitespace-nowrap">{fmtTk(row.purchase.grand_total)}</td>
                                            <td className="p-3">{badge(row.action)}</td>
                                            <td className="max-w-xs p-3 whitespace-pre-line text-gray-700 italic dark:text-gray-300">
                                                {row.note || '—'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-6 text-center text-gray-500 dark:text-gray-400">
                                            No approvals yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination links={approvals.links} currentPage={approvals.current_page} lastPage={approvals.last_page} total={approvals.total} />
                </div>
            </div>
        </AppLayout>
    );
}
