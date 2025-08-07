/*  resources/js/Pages/items/show.tsx  */
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, router } from '@inertiajs/react';
import { useMemo } from 'react';
import { fmtDate } from '@/utils/format';

/* -------------------------------------------------------------------------- */
/*  Types (mirror ItemController@show)                                        */
/* -------------------------------------------------------------------------- */
interface StockRow {
    lot_no: string;
    godown: string;
    received_at: string | null;
    qty: number;
    avg_cost: number;
    value: number;
}

interface ItemShowProps {
    item: {
        id: number;
        item_name: string;
        item_code: string;
        unit: string | null;
    };
    stocks: StockRow[];
    summary: {
        total_qty: number;
        total_value: number;
        last_in: string | null;
        unit: string | null;
    };
    godowns: { id: number; name: string }[];
    filters: {
        godown_id?: string;
    };
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */
export default function ItemShow({ item, stocks, summary, godowns, filters }: ItemShowProps) {
    /* ---------------------------------------------------------------------- */
    /*  Memoised columns for the lot-wise table                               */
    /* ---------------------------------------------------------------------- */
    const columns = useMemo(
        () => [
            { header: 'Lot #', accessor: 'lot_no' },
            { header: 'Godown', accessor: 'godown' },
            { header: 'Received',  accessor: (r: StockRow) => (r.received_at ? fmtDate(r.received_at) : '—') },
            {
                header: `Qty (${summary.unit ?? ''})`,
                accessor: (r: StockRow) => (r.qty !== undefined ? r.qty.toLocaleString() : '0'),
                className: 'text-right',
            },
            {
                header: 'Rate',
                accessor: (r: StockRow) => (r.rate ?? 0).toFixed(2),
                className: 'text-right',
            },
            {
                header: 'Value',
                accessor: (r: StockRow) => (r.value ?? 0).toFixed(2),
                className: 'text-right font-medium',
            },
        ],
        [summary.unit],
    );

    /* ---------------------------------------------------------------------- */
    /*  Handler – when user changes the Godown filter                         */
    /* ---------------------------------------------------------------------- */
    // treat "all" as no filter
    const changeGodown = (godownId: string) =>
        router.get(
            route('items.show', { item: item.id }),
            { godown_id: godownId === 'all' ? undefined : godownId },
            { preserveState: true, replace: true },
        );

    return (
        <AppLayout>
            <Head title={`Item · ${item.item_name}`} />
            <div className="h-full bg-gray-100 p-6">
                <div className="h-full rounded-lg bg-white p-6">
                    <PageHeader title={`Item: ${item.item_name}`} addLinkHref="/items" addLinkText="Back" />

                    {/* Totals + filters */}
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center">
                        {/* Snapshot card */}
                        <div className="flex-grow rounded-2xl border bg-white p-4 shadow-sm">
                            <h2 className="text-lg font-semibold">
                                {item.item_name} <span className="text-sm text-gray-500">({item.item_code})</span>
                            </h2>

                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                                <Snapshot label="Total Qty">
                                    {summary.total_qty.toLocaleString()} {summary.unit}
                                </Snapshot>

                                <Snapshot label="Valuation">{summary.total_value.toFixed(2)} TK</Snapshot>

                                <Snapshot label="Last Received">{summary.last_in ? fmtDate(summary.last_in) : '—'}</Snapshot>

                                <Snapshot label="Active Lots">{stocks.length}</Snapshot>
                            </div>
                        </div>

                        {/* Godown filter */}
                        <div className="w-full rounded-2xl border bg-white p-4 shadow-sm lg:w-64">
                            <label className="mb-1 block text-sm font-medium text-gray-700">Filter by Godown</label>
                            <Select
                                value={filters.godown_id ?? undefined} // ⬅️  undefined, not ''
                                onValueChange={changeGodown}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Godowns" />
                                </SelectTrigger>

                                <SelectContent>
                                    {/* remove the <SelectItem value=""> … */}
                                    {godowns.map((g) => (
                                        <SelectItem key={g.id} value={String(g.id)}>
                                            {g.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Lot-wise breakdown table */}
                    <div className="rounded-2xl border bg-white p-4 shadow-sm">
                        <TableComponent columns={columns} data={stocks} noDataMessage="No active lots." />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/* -------------------------------------------------------------------------- */
/*  Small helper for snapshot fields                                          */
/* -------------------------------------------------------------------------- */
function Snapshot({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className={cn('flex flex-col')}>
            <span className="text-xs text-gray-500">{label}</span>
            <span className="font-semibold">{children}</span>
        </div>
    );
}
