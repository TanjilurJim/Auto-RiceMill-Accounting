import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface Designation {
    id: number;
    name: string;
    description: string;
    creator?: { name: string };
}

export default function DesignationIndex({ designations }: { designations: Designation[] }) {

    const handleDelete = (id: number) => {

        confirmDialog(
            {}, () => {
                router.delete(`/designations/${id}`);
            }
        )

    };

    const columns = [
        { header: '#', accessor: (_: Designation, index: number) => index + 1, className: 'text-center' },
        { header: 'Name', accessor: 'name' },
        { header: 'Description', accessor: 'description' },
        { header: 'Created By', accessor: (row: Designation) => row.creator?.name || 'N/A' },
    ];

    return (
        <AppLayout>
            <Head title="Designations" />
            <div className="p-6 w-screen lg:w-full bg-gray-100">

                <PageHeader title='Designations' addLinkHref='/designations/create' addLinkText="+ Add New" />

                <TableComponent
                    columns={columns}
                    data={designations}
                    actions={(row: Designation) => (
                        <ActionButtons
                            editHref={`/designations/${row.id}/edit`}
                            onDelete={() => handleDelete(row.id)}
                            editText="Edit"
                            deleteText="Delete"
                        />
                    )}
                    noDataMessage="No designations found."
                />

            </div>
        </AppLayout>
    );
}
