import ActionButtons from '@/components/ActionButtons';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Voucher {
    id: number;
    date: string;
    vch_no: string;
    party: { account_ledger_name: string };
    grand_total: string;
    balance: string;
}

interface Props {
    vouchers: Voucher[];
    pagination: {
        links: any[];
        currentPage: number;
        lastPage: number;
        total: number;
    };
}

export default function RentVoucherIndex({ vouchers, pagination }: Props) {
    // Define table columns for TableComponent
    const tableColumns = [
        { header: '#', accessor: (_: Voucher, i: number) => (pagination.currentPage - 1) * 15 + i + 1, className: 'text-center' },
        { header: 'Date', accessor: 'date' },
        { header: 'Vch No', accessor: 'vch_no' },
        { header: 'Party', accessor: (v: Voucher) => v.party.account_ledger_name },
        { header: 'Grand Total', accessor: 'grand_total', className: 'text-right' },
        { header: 'Balance', accessor: 'balance', className: 'text-right' },
    ];

    return (
        <AppLayout>
            <Head title="Rent Vouchers" />
            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-xl md:text-2xl font-bold">Rent Vouchers</h1>
                        <Link
                            href={route('party-stock.rent-voucher.create')}
                            className="inline-flex items-center rounded-sm bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                        >
                            + New
                        </Link>
                    </div>
                    <TableComponent
                        columns={tableColumns}
                        data={vouchers}
                        actions={(v: Voucher) => (
                            <ActionButtons
                                viewHref={route('party-stock.rent-voucher.show', v.id)}
                                editHref={route('party-stock.rent-voucher.edit', v.id)}
                                viewText="View"
                                editText="Edit"
                            />
                        )}
                        noDataMessage="No vouchers found."
                    />
                    <Pagination
                        links={pagination.links}
                        currentPage={pagination.currentPage}
                        lastPage={pagination.lastPage}
                        total={pagination.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
