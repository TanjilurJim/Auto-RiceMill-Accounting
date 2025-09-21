import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface Employee {
    id: number;
    name: string;
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
    // Handle delete action
    const handleDelete = (id: number) => {

        confirmDialog(
            {}, () => {
                router.delete(`/salary-receives/${id}`);
            }
        )

    };

    const columns = [
        { header: 'SL', accessor: (_: any, index: number) => index + 1, className: 'text-center' },
        { header: 'Voucher No', accessor: 'vch_no' },
        { header: 'Date', accessor: 'date' },
        { header: 'Employee', accessor: (row: any) => row.employee.name },
        { header: 'Amount', accessor: 'amount' },
        {
            header: 'Actions',
            accessor: (row: any) => (
                <ActionButtons
                    printHref={route('salary-receives.show', row.id)}
                    editHref={`/salary-receives/${row.id}/edit`}
                    onDelete={() => handleDelete(row.id)}
                    printText="View"
                    editText="Edit"
                    deleteText="Delete"
                />
            ),
            className: 'text-center',
        },
    ];

    return (
        <AppLayout>
            <Head title="Salary Receives" />
            <div className="p-4 md:p-12 h-full w-screen lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">

                    <PageHeader title="Salary Receives" addLinkHref='/salary-receives/create' addLinkText='+ Add New' />

                    {/* Table */}
                    <TableComponent
                        columns={columns}
                        data={salaryReceives.data}
                        noDataMessage="No salary receives found."
                    />

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
