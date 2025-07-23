import Pagination from '@/components/Pagination';
import { Link, router } from '@inertiajs/react';

interface SaleRow {
    id: number;
    date: string;
    voucher_no: string;
    grand_total: string | number;
    account_ledger?: { account_ledger_name: string };
}

interface SalePaginator {
    data: SaleRow[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    sales: SalePaginator; // ✅
    approveRoute: (id: number) => string;
    rejectRoute: (id: number) => string;
}

export default function SalesInboxTable({ sales, approveRoute, rejectRoute }: Props) {
    const approve = (id: number) => router.post(approveRoute(id));
    const reject = (id: number) => router.post(rejectRoute(id));

    return (
        <>
            <table className="w-full border text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-2">Date</th>
                        <th className="p-2">Voucher</th>
                        <th className="p-2">Customer</th>
                        <th className="p-2 text-right">Total</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {sales.data.map((row) => (
                        <tr key={row.id} className="border-t">
                            <td className="p-2">{row.date}</td>
                            <td className="p-2">
                                <Link href={`/sales/${row.id}`} className="text-blue-600 hover:underline">
                                    {row.voucher_no}
                                </Link>
                            </td>
                            <td className="p-2">{row.account_ledger?.account_ledger_name ?? '-'}</td>
                            <td className="p-2 text-right">{Number(row.grand_total).toFixed(2)}</td>
                            <td className="space-x-1 p-2">
                                <Link href={`/sales/${row.id}`} className="rounded bg-sky-600 px-3 py-1 text-white">
                                    View
                                </Link>
                                <button onClick={() => approve(row.id)} className="rounded bg-green-600 px-3 py-1 text-white">
                                    Approve
                                </button>
                                <button onClick={() => reject(row.id)} className="rounded bg-red-600 px-3 py-1 text-white">
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination links={sales.links} currentPage={sales.current_page} lastPage={sales.last_page} total={sales.total} />
        </>
    );
}
