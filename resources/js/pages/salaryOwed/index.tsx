import ActionButtons from '@/components/ActionButtons';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { SearchBar } from '@/components/ui/search-bar';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import React from 'react';

/* ───── Types that match the controller payload ───── */
interface Row {
    id: number;
    name: string;
    gross_sum: string;
    paid_sum: string;
    outstanding: string;
}
interface Totals {
    headcount: number;
    gross: number;
    paid: number;
    outstanding: number;
}
interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

/* ───── Helpers ───── */
const money = (n: number | string) =>
    new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 2,
    }).format(Number(n));

/* Simple filter bar (replace with your own component if you have one) */
const FilterBar = ({ defaultValues }: { defaultValues: Record<string, any> }) => {
    const [search, setSearch] = React.useState(defaultValues.search ?? '');

    const apply = () => router.get(route('salary-owed.index', { search }), {}, { preserveState: true });

    return (
        <div className="mb-6 flex gap-2">
            <input
                className="w-full max-w-xs rounded border px-3 py-2"
                placeholder="Search employee…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && apply()}
            />
            <button onClick={apply} className="rounded bg-gray-800 px-4 py-2 text-white">
                Go
            </button>
        </div>
    );
};

/* ───── Page component ───── */
export default function Index() {
    const {
        employees,
        totals,
        filters = {},
    } = usePage<
        PageProps<{
            employees: Paginated<Row>;
            totals: Totals;
            filters: Record<string, any>;
        }>
    >().props;

    /* Table columns (without Outstanding, added later) */
    const columns = [
        { header: '#', accessor: (_: Row, i: number) => i + 1, className: 'text-center' },
        { header: 'Name', accessor: 'name' },
        { header: 'Total', accessor: (r: Row) => money(r.gross_sum) },
        { header: 'Paid', accessor: (r: Row) => money(r.paid_sum) },
    ];

    return (
        <AppLayout>
            <Head title="Outstanding Salaries" />
            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                {/* KPI cards */}
                {/* <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card title="Employees"    value={totals.headcount} />
          <Card title="Total Salary" value={money(totals.gross)} />
          <Card title="Paid"         value={money(totals.paid)} />
          <Card title="Outstanding"  value={money(totals.outstanding)} highlight />
        </div> */}

                {/* Filters */}
                

                <div className="rounded-lg bg-white p-6">
                    <PageHeader title="Outstanding Salaries" addLinkHref="/dashboard" addLinkText="Dashboard" />
                    <SearchBar endpoint={route('salary-owed.index')} searchQuery={filters.search ?? ''} />

                    <div className="max-h-[70vh] overflow-x-auto">
                        <TableComponent
                            stickyHeader
                            columns={[
                                ...columns,
                                {
                                    header: 'Outstanding',
                                    accessor: (row: Row) => (
                                        <span className={Number(row.outstanding) > 0 ? 'font-semibold text-red-600' : 'text-green-600'}>
                                            {money(row.outstanding)}
                                        </span>
                                    ),
                                },
                            ]}
                            data={employees.data}
                            actions={(row: Row) => <ActionButtons viewHref={route('salary-owed.show', row.id)} viewText="Details" />}
                            noDataMessage="Nobody is owed salary 🎉"
                        />
                    </div>

                    <Pagination links={employees.links} currentPage={employees.current_page} lastPage={employees.last_page} total={employees.total} />
                </div>
            </div>
        </AppLayout>
    );
}
