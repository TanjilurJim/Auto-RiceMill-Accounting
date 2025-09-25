// resources/js/pages/stock-moves/index.tsx
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
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

export default function StockMoveIndex({ moves }: { moves: Paginated<Move[]> }) {
    const t = useTranslation();
    const columns = [
        {
            header: t('dateLabel'),
            accessor: (m: Move) => fmtDate(m.created_at.slice(0, 10)),
            className: 'px-4 py-2',
        },
        {
            header: t('godownLabel'),
            accessor: (m: Move) => m.godown?.name,
            className: 'px-4 py-2',
        },
        {
            header: t('itemLabel'),
            accessor: (m: Move) => m.item?.item_name,
            className: 'px-4 py-2',
        },
        {
            header: t('lotLabel'),
            accessor: (m: Move) => m.lot?.lot_no ?? '—',
            className: 'px-4 py-2',
        },
        {
            header: t('typeLabel'),
            accessor: (m: Move) => <span className="capitalize">{m.type}</span>,
            className: 'px-4 py-2',
        },
        {
            header: t('qtyLabel'),
            accessor: (m: Move) => m.qty,
            className: 'px-4 py-2',
        },
        {
            header: t('costLabel'),
            accessor: (m: Move) => m.unit_cost ?? '—',
            className: 'px-4 py-2',
        },
        {
            header: t('reasonLabel'),
            accessor: (m: Move) => m.reason ?? '—',
            className: 'px-4 py-2',
        },
        {
            header: t('byLabel'),
            accessor: (m: Move) => m.creator?.name,
            className: 'px-4 py-2',
        },
    ];

    return (
        <AppLayout>
            <Head title={t('stockMovementsTitle')} />
            <div className="bg-background h-full w-screen md:p-6 lg:w-full">
                <div className="bg-background h-full rounded-lg p-3 md:p-6">
                    <PageHeader title={t('stockMovementsTitle')} addLinkHref="/stock-moves/create" addLinkText={t('addStockButton')} />
                    <TableComponent columns={columns} data={moves.data} noDataMessage={t('noStockMovementsFound')} />
                </div>
            </div>
        </AppLayout>
    );
}
