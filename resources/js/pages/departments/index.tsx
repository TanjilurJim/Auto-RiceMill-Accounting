import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface Department {
    id: number;
    name: string;
    description: string;
    creator?: { name: string };
}

export default function DepartmentIndex({ departments }: { departments: Department[] }) {

    const handleDelete = (id: number) => {
        confirmDialog(
            {}, () => {
                router.delete(`/departments/${id}`);
            }
        );
    };

    const columns = [
        { header: '#', accessor: (_: Department, index: number) => index + 1, className: 'text-center' },
        { header: 'Name', accessor: 'name' },
        { header: 'Description', accessor: 'description' },
        { header: 'Created By', accessor: (row: Department) => row.creator?.name || 'N/A' },
    ];

    return (
        <AppLayout>
            <Head title="Departments" />
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">

                    <PageHeader title="Departments" addLinkHref='/departments/create' addLinkText="+ Add New" />

                    {/* Responsive Table */}
                    <TableComponent
                        columns={columns}
                        data={departments}
                        actions={(row: Department) => (
                            <ActionButtons
                                editHref={`/departments/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                editText="Edit"
                                deleteText="Delete"
                            />
                        )}
                        noDataMessage="No departments found."
                    />
                </div>
            </div>
        </AppLayout>
    );
}
