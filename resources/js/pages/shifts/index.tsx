import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface Shift {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    description: string;
    creator?: { name: string };
}

export default function ShiftIndex({ shifts }: { shifts: Shift[] }) {

    const handleDelete = (id: number) => {

        confirmDialog(
            {}, () => {
                router.delete(`/shifts/${id}`);
            }
        )

    };

    const columns = [
        { header: '#', accessor: (_: Shift, index: number) => index + 1, className: 'text-center' },
        { header: 'Name', accessor: 'name' },
        { header: 'Start Time', accessor: 'start_time' },
        { header: 'End Time', accessor: 'end_time' },
        { header: 'Description', accessor: 'description' },
        { header: 'Created By', accessor: (row: Shift) => row.creator?.name || 'N/A' },
    ];

    return (
        <AppLayout>
            <Head title="Shifts" />
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">

                    <PageHeader title="Shifts" addLinkHref='/shifts/create' addLinkText="+ Add New" />

                    <TableComponent
                        columns={columns}
                        data={shifts}
                        actions={(row: Shift) => (
                            <ActionButtons
                                editHref={`/shifts/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                editText="Edit"
                                deleteText="Delete"
                            />
                        )}
                        noDataMessage="No shifts found."
                    />
                </div>
            </div>
        </AppLayout>
    );
}
