import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

type Row = {
    id: number;
    date: string;
    voucher_no: string;
    customer: string;
    total_sale: number;
    interest_paid: number;
    total_paid: number;
    cleared_on: string | null;
};
interface Props {
    sales: Row[];
}

const fmt = (n: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(n);

export default function Settled({ sales }: Props) {
    const t = useTranslation();

    // Define table columns for TableComponent
    const tableColumns = [
        {
            header: t('dateHeader'),
            accessor: (row: Row) => row.date,
        },
        {
            header: t('voucherHeader'),
            accessor: (row: Row) => row.voucher_no,
        },
        {
            header: t('customerHeader'),
            accessor: (row: Row) => row.customer,
        },
        {
            header: t('saleAmountHeader'),
            accessor: (row: Row) => fmt(row.total_sale),
            className: 'text-right',
        },
        {
            header: t('interestAmountHeader'),
            accessor: (row: Row) => fmt(row.interest_paid),
            className: 'text-right',
        },
        {
            header: t('paidAmountHeader'),
            accessor: (row: Row) => fmt(row.total_paid),
            className: 'text-right',
        },
        {
            header: t('clearedOnHeader'),
            accessor: (row: Row) => row.cleared_on ?? '—',
        },
    ];

    // Define actions for each row
    const renderActions = (row: Row) => (
        <Link href={route('dues.show', row.id)} className="text-blue-600 hover:underline">
            {t('viewLogText')}
        </Link>
    );
    return (
        <AppLayout>
            <Head title={t('settledDuesTitle')} />
            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="space-y-6">
                    <PageHeader title={t('settledDuesTitle')} addLinkHref="/dues" addLinkText={t('backToOutstandingText')} />

                    {sales.length === 0 ? (
                        <p className="rounded bg-green-50 p-4 text-sm text-green-700">{t('noDuesSettledMessage')}</p>
                    ) : (
                        <TableComponent columns={tableColumns} data={sales} actions={renderActions} noDataMessage={t('noDuesSettledMessage')} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
