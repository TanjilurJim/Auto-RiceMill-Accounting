import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

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

export default function EmployeeIndex({ employees }: { employees: Employee[] }) {
    const handleDelete = (id: number) => {

        confirmDialog(
            {}, () => {
                router.delete(`/employees/${id}`);
            }
        );

    };

    const columns = [
        { header: '#', accessor: (_: Employee, index: number) => index + 1, className: 'text-center' },
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Mobile', accessor: 'mobile' },
        { header: 'Salary', accessor: 'salary' },
        { header: 'Department', accessor: (row: Employee) => row.department.name },
        { header: 'Designation', accessor: (row: Employee) => row.designation.name },
        { header: 'Shift', accessor: (row: Employee) => row.shift.name },
        { header: 'Status', accessor: 'status' },
    ];

    return (
        <AppLayout>
            <Head title="Employees" />
            <div className="p-6 w-screen lg:w-full bg-gray-100">
                {/* Header */}
                <PageHeader title="Employees" addLinkHref='/employees/create' addLinkText="+ Add Employee" />

                {/* Table */}
                <TableComponent
                    columns={columns}
                    data={employees}
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
            </div>
        </AppLayout>
    );
}
