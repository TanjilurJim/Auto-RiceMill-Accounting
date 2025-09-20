import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface ReceivedMode {
    id: number;
    mode_name: string;
    opening_balance: string;
    closing_balance: string;
    phone_number: string;
}

interface PaginatedReceivedModes {
    data: ReceivedMode[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function Index({
    receivedModes,
    currentPage,
    perPage,
}: {
    receivedModes: PaginatedReceivedModes;
    currentPage: number;
    perPage: number;
}) {
    // Ensure that receivedModes is always defined and fallback to empty data if undefined
    const safeReceivedModes = receivedModes || { data: [], links: [] };

    const handleDelete = (id: number) => {
        confirmDialog(
            {}, () => {
                router.delete(`/received-modes/${id}`);
            }
        )

    };

    // Safe access to the data array before trying to map over it
    const modes = safeReceivedModes.data || [];

    const columns = [
        { header: 'SL', accessor: (_: ReceivedMode, index?: number) => <span>{(index ?? 0) + 1}</span>, className: '' },
        { header: 'Mode Name', accessor: 'mode_name' },
        // { header: 'Opening Balance', accessor: 'opening_balance' },
        // { header: 'Closing Balance', accessor: 'closing_balance' },
        { header: 'Phone Number', accessor: 'phone_number' },
    ];

    return (
        <AppLayout>
            <Head title="Received Modes" />
            <div className="h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-4 md:p-12">

                    <PageHeader title="Received Modes" addLinkHref="/received-modes/create" addLinkText="+ Add New" />

                    <TableComponent
                        columns={columns}
                        data={safeReceivedModes.data}
                        actions={(row: ReceivedMode) => (
                            <ActionButtons
                                editHref={`/received-modes/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                            />
                        )}
                    />

                    {/* Pagination */}
                    <Pagination
                        links={safeReceivedModes.links}
                        currentPage={safeReceivedModes.current_page}
                        lastPage={safeReceivedModes.last_page}
                        total={safeReceivedModes.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
