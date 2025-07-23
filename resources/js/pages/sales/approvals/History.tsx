import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

interface ApprovalRow {
    id: number;
    action: 'approved' | 'rejected';
    created_at: string;
    sale: {
        id: number;
        voucher_no: string;
        date: string;
        grand_total: string | number;
        account_ledger?: { account_ledger_name: string };
    };
}

interface Paginator {
    data: ApprovalRow[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function History({ approvals }: { approvals: Paginator }) {
    const badge = (a: 'approved' | 'rejected') => (
        <span
            className={'rounded px-2 py-0.5 text-xs font-semibold ' + (a === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}
        >
            {a}
        </span>
    );

    return (
        <AppLayout title="My Approval History">
            <h1 className="mb-4 text-xl font-semibold">My Approval History</h1>

            <table className="w-full border text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-2">Date</th>
                        <th className="p-2">Voucher</th>
                        <th className="p-2">Customer</th>
                        <th className="p-2 text-right">Total</th>
                        <th className="p-2">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {approvals.data.map((row) => (
                        <tr key={row.id} className="border-t">
                            <td className="p-2">{row.sale.date}</td>
                            <td className="p-2">
                                <Link href={`/sales/${row.sale.id}`} className="text-blue-600 hover:underline">
                                    {row.sale.voucher_no}
                                </Link>
                            </td>
                            <td className="p-2">{row.sale.account_ledger?.account_ledger_name ?? '-'}</td>
                            <td className="p-2 text-right">{Number(row.sale.grand_total).toFixed(2)}</td>
                            <td className="p-2">{badge(row.action)}</td>
                        </tr>
                    ))}

                    {approvals.data.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-4 text-center text-gray-500">
                                No approvals yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Pagination links={approvals.links} currentPage={approvals.current_page} lastPage={approvals.last_page} total={approvals.total} />
        </AppLayout>
    );
}
