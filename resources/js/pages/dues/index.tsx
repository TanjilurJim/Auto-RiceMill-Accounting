import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

type Row = {
    id: number;
    date: string; // ISO
    voucher_no: string;
    customer: string;
    sale_items: string; // ‘Rice, Oil, Sugar’
    extra_count: number; // how many items were truncated
    outstanding: number;
};

interface Props {
    sales: {
        data: Row[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    filters: { q: string | null };
}

/* helpers ---------------------------------------------------------*/
const fmt = (n: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(n);

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}/` + `${String(d.getMonth() + 1).padStart(2, '0')}/` + `${String(d.getFullYear()).slice(-2)}`;
};
/*------------------------------------------------------------------*/

export default function DueIndex({ sales, filters }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.q ?? '');

    const handleReset = () => {
        setSearch(''); // clear local input
        router.get(
            route('dues.index'),
            {},
            {
                // hit the index with *no* query-string
                preserveState: true,
                replace: true,
            },
        );
    };

    /* debounce search ------------------------------------------------*/
    /* debounce search ------------------------------------------------*/
    useEffect(() => {
        // if value coming from the server == what’s in the input → no need to re-hit the server
        if (search === (filters.q ?? '')) return;

        const t = setTimeout(() => {
            // ⬇⬇⬇  send { q: search } only when search isn't blank
            router.get(
                route('dues.index'),
                search.trim() ? { q: search.trim() } : {}, //   <- change is here
                { preserveState: true, replace: true },
            );
        }, 400); // 0.4 s “lazy” typing

        return () => clearTimeout(t);
    }, [search, filters.q]);
    /*------------------------------------------------------------------*/

    return (
        <AppLayout>
            <Head title="Outstanding Dues" />

            <div className="bg-background p-4 md:p-12">
                <div className=" space-y-6">
                    <PageHeader title="Outstanding Dues" addLinkHref="/sales" addLinkText="Back to Sales" />

                    {/* flash msg */}
                    {flash?.success && <div className="rounded bg-background p-3 text-green-800">{flash.success}</div>}

                    {/* search bar */}
                    <div className="mb-3 flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search voucher, customer, item…"
                            className="w-full max-w-sm rounded border-b-2 border-gray-600 p-2 shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* show Reset only when a filter is applied */}
                        {(filters.q || search) && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="rounded bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    {/* table */}
                    <div className="overflow-x-auto rounded-lg border bg-background">
                        <table className="min-w-full table-auto text-sm text-foreground">
                            <thead className="sticky top-0 bg-background text-left text-xs font-semibold tracking-wide uppercase">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Voucher</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Items</th>
                                    <th className="px-4 py-3 text-right">Outstanding (৳)</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>

                            <tbody>
                                {sales.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-10 text-center text-foreground/70">
                                            🎉 No dues — all caught up.
                                        </td>
                                    </tr>
                                )}

                                {sales.data.map((s) => (
                                    <tr key={s.id} className="border-t even:bg-background-50/50 ">
                                        <td className="px-4 py-2">{formatDate(s.date)}</td>
                                        <td className="px-4 py-2">{s.voucher_no}</td>
                                        <td className="px-4 py-2">{s.customer}</td>

                                        {/* show up to 3 item names, then “+ n more” */}
                                        <td className="px-4 py-2 text-xs text-foreground/80">
                                            {s.sale_items}
                                            {s.extra_count > 0 && <span className="text-gray-400"> +{s.extra_count} more</span>}
                                        </td>

                                        <td className="px-4 py-2 text-right font-medium">{fmt(s.outstanding)}</td>
                                        <td className="px-4 py-2 text-right">
                                            <Link
                                                href={route('dues.show', s.id)}
                                                className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                                            >
                                                Receive&nbsp;Payment
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* paginator */}
                    {sales.data.length > 0 && (
                        <Pagination
                            links={sales.links}
                            currentPage={sales.current_page}
                            lastPage={sales.last_page}
                            total={sales.total}
                            className="mt-4"
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
