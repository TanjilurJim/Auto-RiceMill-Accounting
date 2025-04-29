import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

export default function Index({ journals }: any) {
    const handleDelete = (id: number) => {
        confirmDialog(
            {}, () => {
                router.delete(`/journal-add/${id}`);
            }
        );
    };

    const columns = [
        { header: 'Date', accessor: 'date' },
        { header: 'Voucher No', accessor: 'voucher_no' },
        {
            header: 'Ledgers', accessor: (row: any) => (
                <>
                    <div><strong>Debits:</strong> {row.entries.filter((entry: any) => entry.type === 'debit').map((entry: any) => entry.ledger?.account_ledger_name).join(', ') || '—'}</div>
                    <div><strong>Credits:</strong> {row.entries.filter((entry: any) => entry.type === 'credit').map((entry: any) => entry.ledger?.account_ledger_name).join(', ') || '—'}</div>
                </>
            )
        },
        { header: 'Total Debit', accessor: (row: any) => row.entries.filter((entry: any) => entry.type === 'debit').reduce((sum: number, entry: any) => sum + parseFloat(entry.amount), 0).toFixed(2), className: 'text-right' },
        { header: 'Total Credit', accessor: (row: any) => row.entries.filter((entry: any) => entry.type === 'credit').reduce((sum: number, entry: any) => sum + parseFloat(entry.amount), 0).toFixed(2), className: 'text-right' },
        { header: 'Note', accessor: (row: any) => row.entries[0]?.note || '—' },
    ];

    return (
        <AppLayout>
            <Head title="Journal Entries" />
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">

                    <PageHeader title='Journal Entries' addLinkHref='/journal-add/create' addLinkText="+ Add New" />

                    <TableComponent
                        columns={columns}
                        data={journals.data}
                        actions={(row: any) => (
                            <ActionButtons
                                editHref={`/journal-add/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                printHref={`/journal-add/${row.voucher_no}/print`}
                                printText="Print"
                            />
                        )}
                        noDataMessage="No journal entries found."
                    />

                    {/* Pagination */}
                    <Pagination
                        links={journals.links}
                        currentPage={journals.current_page}
                        lastPage={journals.last_page}
                        total={journals.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
