import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

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
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">

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
            </div>
        </AppLayout>
    );
}
