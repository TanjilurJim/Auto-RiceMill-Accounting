import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
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
    // Define actions for each row
    const renderActions = (row: Row) => (
        <Link href={route('dues.show', row.id)} className="text-blue-600 hover:underline">
            View&nbsp;log
        </Link>
    );
    return (
        <AppLayout>
            <Head title="Settled dues" />
            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="space-y-6">
                    <PageHeader title="Settled dues" addLinkHref="/dues" addLinkText="Back to outstanding" />

                    {sales.length === 0 ? (
                        <p className="rounded bg-green-50 p-4 text-sm text-green-700">Great! No dues have been settled yet.</p>
                    ) : (
                        <TableComponent
                            columns={tableColumns}
                            data={sales}
                            actions={renderActions}
                            noDataMessage="Great! No dues have been settled yet."
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

// Define table columns for TableComponent
const tableColumns = [
    {
        header: 'Date',
        accessor: (row: Row) => row.date,
    },
    {
        header: 'Voucher',
        accessor: (row: Row) => row.voucher_no,
    },
    {
        header: 'Customer',
        accessor: (row: Row) => row.customer,
    },
    {
        header: 'Sale ৳',
        accessor: (row: Row) => fmt(row.total_sale),
        className: 'text-right',
    },
    {
        header: 'Interest ৳',
        accessor: (row: Row) => fmt(row.interest_paid),
        className: 'text-right',
    },
    {
        header: 'Paid ৳',
        accessor: (row: Row) => fmt(row.total_paid),
        className: 'text-right',
    },
    {
        header: 'Cleared on',
        accessor: (row: Row) => row.cleared_on ?? '—',
    },
];
