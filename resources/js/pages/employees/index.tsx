import ActionButtons from '@/components/ActionButtons';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { confirmDialog } from '@/components/confirmDialog';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

/* ───── Types ───── */
interface Employee {
    id: number;
    name: string;
    email: string;
    joining_date: Date;
    mobile: string;
    salary: number;
    department: { name: string };
    designation: { name: string };
    shift: { name: string };
    status: string;
    creator?: { name: string };
}

interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

/* ───── Page Component ───── */
export default function EmployeeIndex({ employees }: { employees: Paginated<Employee> }) {
    const t = useTranslation();
    const handleDelete = (id: number) => confirmDialog({}, () => router.delete(`/employees/${id}`));

    const columns = [
        { header: '#', accessor: (_: Employee, i?: number) => (i ?? 0) + 1, className: 'text-center' },
        { header: t('empIndexNameHeader'), accessor: 'name' },
        { header: t('Joining Date'), accessor: 'joining_date' },
        { header: t('empIndexMobileHeader'), accessor: 'mobile' },
        { header: t('empIndexSalaryHeader'), accessor: 'salary' },
        { header: t('empIndexDepartmentHeader'), accessor: (row: Employee) => row.department?.name },
        { header: t('empIndexDesignationHeader'), accessor: (row: Employee) => row.designation?.name },
        { header: t('empIndexShiftHeader'), accessor: (row: Employee) => row.shift?.name },
        { header: t('empIndexStatusHeader'), accessor: 'status' },
    ];

    return (
        <AppLayout>
            <Head title={t('employeesTitle')} />

            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">
                    <PageHeader title={t('employeesTitle')} addLinkHref="/employees/create" addLinkText={t('employeesAddButton')} />

                    {/* Data table */}
                    <TableComponent
                        columns={columns}
                        data={employees.data}
                        actions={(row: Employee) => (
                            <ActionButtons
                                editHref={`/employees/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                editText={t('empIndexEditText')}
                                deleteText={t('empIndexDeleteText')}
                            />
                        )}
                        noDataMessage={t('empIndexNoDataMessage')}
                    />

                    {/* Pagination bar */}
                    <Pagination links={employees.links} currentPage={employees.current_page} lastPage={employees.last_page} total={employees.total} />
                </div>
            </div>
        </AppLayout>
    );
}
