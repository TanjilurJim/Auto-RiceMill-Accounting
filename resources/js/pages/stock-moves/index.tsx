// resources/js/pages/stock-moves/index.tsx
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { fmtDate } from '@/utils/format';
import { Head } from '@inertiajs/react';

interface Move {
    id: number;
    created_at: string;
    godown: { id: number; name: string };
    item: { id: number; item_name: string };
    lot: { lot_no: string | null };
    type: 'in' | 'out' | 'adjust';
    qty: string;
    unit_cost?: string | null;
    reason?: string | null;
    creator: { name: string };
}

const columns = [
    {
        header: 'Date',
        accessor: (m: Move) => fmtDate(m.created_at.slice(0, 10)),
        className: 'px-4 py-2',
    },
    {
        header: 'Godown',
        accessor: (m: Move) => m.godown?.name,
        className: 'px-4 py-2',
    },
    {
        header: 'Item',
        accessor: (m: Move) => m.item?.item_name,
        className: 'px-4 py-2',
    },
    {
        header: 'Lot #',
        accessor: (m: Move) => m.lot?.lot_no ?? '—',
        className: 'px-4 py-2',
    },
    {
        header: 'Type',
        accessor: (m: Move) => <span className="capitalize">{m.type}</span>,
        className: 'px-4 py-2',
    },
    {
        header: 'Qty',
        accessor: (m: Move) => m.qty,
        className: 'px-4 py-2',
    },
    {
        header: 'Cost',
        accessor: (m: Move) => m.unit_cost ?? '—',
        className: 'px-4 py-2',
    },
    {
        header: 'Reason',
        accessor: (m: Move) => m.reason ?? '—',
        className: 'px-4 py-2',
    },
    {
        header: 'By',
        accessor: (m: Move) => m.creator?.name,
        className: 'px-4 py-2',
    },
];

export default function StockMoveIndex({ moves }: { moves: Paginated<Move[]> }) {
    return (
        <AppLayout>
            <Head title="Stock Movements" />

            <div className="bg-background h-full w-screen md:p-6 lg:w-full">
                {/* Card surface with border + correct text color */}
                <div className="bg-background h-full rounded-lg p-3 md:p-6">
                    <PageHeader title="Stock Movements" addLinkHref="/stock-moves/create" addLinkText="+ Add Stock" />

                    <TableComponent columns={columns} data={moves.data} noDataMessage="No stock movements found." />
                </div>
            </div>
        </AppLayout>
    );
}
