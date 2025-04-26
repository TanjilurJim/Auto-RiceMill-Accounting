import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface ReceivedAdd {
    id: number;
    date: string;
    voucher_no: string;
    received_mode?: { mode_name: string };
    account_ledger?: { account_ledger_name: string; reference_number: string };
    amount: number;
}

interface PaginatedReceivedAdds {
    data: ReceivedAdd[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function Index({ receivedAdds }: { receivedAdds: PaginatedReceivedAdds }) {
    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/received-add/${id}`);
        });
    };

    const columns = [
        { header: 'Date', accessor: 'date' },
        { header: 'Voucher No', accessor: 'voucher_no' },
        { header: 'Mode', accessor: (row: ReceivedAdd) => row.received_mode?.mode_name || 'N/A' },
        {
            header: 'Ledger',
            accessor: (row: ReceivedAdd) =>
                `${row.account_ledger?.account_ledger_name || 'N/A'} - ${row.account_ledger?.reference_number || ''}`,
        },
        { header: 'Amount', accessor: (row: ReceivedAdd) => Number(row.amount).toFixed(2), className: 'text-right' },
    ];

    return (
        <AppLayout>
            <Head title="Received Vouchers" />

            <div className="p-6 w-screen md:w-full bg-gray-100">
                <PageHeader title="All List of Received" addLinkHref="/received-add/create" addLinkText="+ Add New" />

                <TableComponent
                    columns={columns}
                    data={receivedAdds.data}
                    actions={(row: ReceivedAdd) => (
                        <ActionButtons
                            editHref={`/received-add/${row.id}/edit`}
                            onDelete={() => handleDelete(row.id)}
                            printHref={`/received-add/${row.id}/print`}
                            printText="Print"
                        />
                    )}
                />

                <Pagination
                    links={receivedAdds.links}
                    currentPage={receivedAdds.current_page}
                    lastPage={receivedAdds.last_page}
                    total={receivedAdds.total}
                />
            </div>
        </AppLayout>
    );
}