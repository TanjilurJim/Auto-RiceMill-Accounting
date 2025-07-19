import ActionButtons from '@/components/ActionButtons';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { confirmDialog } from '@/components/confirmDialog';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

/* ───── Types ───── */
interface Employee {
    id: number;
    name: string;
    email: string;
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
    const handleDelete = (id: number) => confirmDialog({}, () => router.delete(`/employees/${id}`));

    const columns = [
        { header: '#', accessor: (_: Employee, i: number) => i + 1, className: 'text-center' },
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Mobile', accessor: 'mobile' },
        { header: 'Salary', accessor: 'salary' },
        { header: 'Department', accessor: (row: Employee) => row.department?.name },
        { header: 'Designation', accessor: (row: Employee) => row.designation?.name },
        { header: 'Shift', accessor: (row: Employee) => row.shift?.name },
        { header: 'Status', accessor: 'status' },
    ];

    return (
        <AppLayout>
            <Head title="Employees" />

            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-white p-6">
                    <PageHeader title="Employees" addLinkHref="/employees/create" addLinkText="+ Add Employee" />

                    {/* Data table */}
                    <TableComponent
                        columns={columns}
                        data={employees.data}
                        actions={(row: Employee) => (
                            <ActionButtons
                                editHref={`/employees/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                editText="Edit"
                                deleteText="Delete"
                            />
                        )}
                        noDataMessage="No employees found."
                    />

                    {/* Pagination bar */}
                    <Pagination links={employees.links} currentPage={employees.current_page} lastPage={employees.last_page} total={employees.total} />
                </div>
            </div>
        </AppLayout>
    );
}
