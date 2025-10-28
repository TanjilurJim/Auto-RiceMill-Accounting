import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

export default function Index({ journals }: any) {
    const t = useTranslation();
    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/journal-add/${id}`);
        });
    };

    const columns = [
        { header: t('dateHeader'), accessor: 'date' },
        { header: t('woVoucherNoHeader'), accessor: 'voucher_no' },
        {
            header: t('journalLedgerHeader'),
            accessor: (row: any) => (
                <>
                    <div>
                        <strong>{t('debitsText')}:</strong>{' '}
                        {row.entries
                            .filter((entry: any) => entry.type === 'debit')
                            .map((entry: any) => entry.ledger?.account_ledger_name)
                            .join(', ') || '—'}
                    </div>
                    <div>
                        <strong>{t('creditsText')}:</strong>{' '}
                        {row.entries
                            .filter((entry: any) => entry.type === 'credit')
                            .map((entry: any) => entry.ledger?.account_ledger_name)
                            .join(', ') || '—'}
                    </div>
                </>
            ),
        },
        {
            header: t('totalDebitHeader'),
            accessor: (row: any) =>
                row.entries
                    .filter((entry: any) => entry.type === 'debit')
                    .reduce((sum: number, entry: any) => sum + parseFloat(entry.amount), 0)
                    .toFixed(2),
            className: 'text-right',
        },
        {
            header: t('totalCreditHeader'),
            accessor: (row: any) =>
                row.entries
                    .filter((entry: any) => entry.type === 'credit')
                    .reduce((sum: number, entry: any) => sum + parseFloat(entry.amount), 0)
                    .toFixed(2),
            className: 'text-right',
        },
        { header: t('journalNoteHeader'), accessor: (row: any) => row.entries[0]?.note || '—' },
    ];

    return (
        <AppLayout>
            <Head title={t('journalEntriesTitle')} />
            <div className="h-full w-screen lg:w-full">
                <div className="h-full rounded-lg bg-background p-4 md:p-12">
                    <PageHeader title={t('journalEntriesTitle')} />

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
                    <Pagination links={journals.links} currentPage={journals.current_page} lastPage={journals.last_page} total={journals.total} />
                </div>
            </div>
        </AppLayout>
    );
}
