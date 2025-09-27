import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface FinancialYear {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    is_closed: boolean;
}

export default function Index({ financialYears }: { financialYears: FinancialYear[] }) {
    const t = useTranslation();

    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/financial-years/${id}`);
        });
    };

    const columns = [
        { header: t('fyTitleHeader'), accessor: 'title' },
        { header: t('fyStartDateHeader'), accessor: 'start_date' },
        { header: t('fyEndDateHeader'), accessor: 'end_date' },
        {
            header: t('fyStatusHeader'),
            accessor: (row: any) =>
                row.is_closed ? (
                    <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">{t('fyClosedStatus')}</span>
                ) : (
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">{t('fyOpenStatus')}</span>
                ),
            className: 'text-center',
        },
        {
            header: t('fyActionsHeader'),
            accessor: (row: any) => <ActionButtons editHref={`/financial-years/${row.id}/edit`} onDelete={() => handleDelete(row.id)} />,
            className: 'text-center',
        },
    ];

    return (
        <AppLayout>
            <Head title={t('fyPageTitle')} />

            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">
                    <PageHeader title={t('fyPageTitle')} addLinkHref="/financial-years/create" addLinkText={t('fyAddYearButton')} />

                    {/* Table */}
                    <TableComponent columns={columns} data={financialYears} noDataMessage={t('fyNoDataMessage')} />
                </div>
            </div>
        </AppLayout>
    );
}
