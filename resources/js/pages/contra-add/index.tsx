import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

export default function Index({ contras }: any) {
    const t = useTranslation();

    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/contra-add/${id}`);
        });
    };

    const columns = [
        { header: t('dateHeader'), accessor: 'date' },
        { header: t('voucherNoLabel'), accessor: 'voucher_no' },
        { header: t('fromModeHeader'), accessor: (row: any) => row.mode_from?.mode_name || 'N/A' },
        { header: t('toModeHeader'), accessor: (row: any) => row.mode_to?.mode_name || 'N/A' },
        {
            header: t('amountHeader'),
            accessor: (row: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT' }).format(row.amount),
            className: 'text-right',
        },
        { header: t('descriptionHeader'), accessor: 'description' },
    ];

    return (
        <AppLayout>
            <Head title={t('contraVouchersTitle')} />

            <div className="h-full w-screen lg:w-full">
                <div className="h-full rounded-lg bg-white p-4 md:p-12">
                    <PageHeader title={t('contraEntriesTitle')} addLinkHref="/contra-add/create" addLinkText={t('addContraText')} />

                    <TableComponent
                        columns={columns}
                        data={contras.data}
                        actions={(row: any) => (
                            <ActionButtons
                                editHref={`/contra-add/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                printHref={`/contra-add/${row.voucher_no}/print`}
                                printText={t('printText')}
                            />
                        )}
                    />

                    {/* Pagination */}
                    <Pagination links={contras.links} currentPage={contras.current_page} lastPage={contras.last_page} total={contras.total} />
                </div>
            </div>
        </AppLayout>
    );
}
