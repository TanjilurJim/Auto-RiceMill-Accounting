import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface Employee {
    id: number;
    name: string;
}

interface ReceivedMode {
    id: number;
    mode_name: string;
}

interface SalaryReceive {
    id: number;
    vch_no: string;
    date: string;
    employee: Employee;
    receivedMode: ReceivedMode;
    amount: string;
    description: string | null;
}

interface PaginatedSalaryReceives {
    data: SalaryReceive[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function SalaryReceiveIndex({ salaryReceives }: { salaryReceives: PaginatedSalaryReceives }) {
    const t = useTranslation();
    // Handle delete action
    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/salary-receives/${id}`);
        });
    };

    const columns = [
        { header: t('salSlLabel'), accessor: (_: any, index: number) => index + 1, className: 'text-center' },
        { header: t('recVoucherNoLabel'), accessor: 'vch_no' },
        { header: t('dateLabel'), accessor: 'date' },
        { header: t('salEmployeeLabel'), accessor: (row: any) => row.employee.name },
        { header: t('empAmountHeader'), accessor: 'amount' },
        {
            header: t('salActionsLabel'),
            accessor: (row: any) => (
                <ActionButtons
                    printHref={route('salary-receives.show', row.id)}
                    editHref={`/salary-receives/${row.id}/edit`}
                    onDelete={() => handleDelete(row.id)}
                    printText={t('salViewText')}
                    editText={t('editText')}
                    deleteText={t('deleteText')}
                />
            ),
            className: 'text-center',
        },
    ];

    return (
        <AppLayout>
            <Head title={t('recSalaryReceivesTitle')} />
            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg bg-white">
                    <PageHeader title={t('recSalaryReceivesTitle')} addLinkHref="/salary-receives/create" addLinkText={t('addNewText')} />

                    {/* Table */}
                    <TableComponent columns={columns} data={salaryReceives.data} noDataMessage={t('recNoSalaryReceivesMessage')} />

                    {/* Pagination */}
                    <Pagination
                        links={salaryReceives.links}
                        currentPage={salaryReceives.current_page}
                        lastPage={salaryReceives.last_page}
                        total={salaryReceives.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
