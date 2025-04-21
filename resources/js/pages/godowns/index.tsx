import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { SearchBar } from '@/components/ui/search-bar';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import ActionButtons from '@/components/ActionButtons';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';

interface Godown {
    id: number;
    name: string;
    godown_code: string;
    address?: string;
}

interface PaginatedGodowns {
    data: Godown[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function GodownIndex({ godowns }: { godowns: PaginatedGodowns }) {
    const handleDelete = (id: number) => {

        confirmDialog(
            {}, () => {
                router.delete(`/godowns/${id}`);
            }
        )

    };

    const columns = [
        { header: '#Id.No', accessor: 'id', className: 'text-center' },
        { header: 'Godown Name', accessor: 'name' },
        { header: 'Godown Id', accessor: 'godown_code' },
        { header: 'Description', accessor: (row: Godown) => row.address || 'N/A' },
    ];

    return (
        <AppLayout>
            <Head title="All List Of Godowns" />
            <div className="p-6 bg-gray-100 w-screen lg:w-full">
                {/* Use the PageHeader component */}
                <PageHeader title='All List Of Godowns' addLinkHref='/godowns/create' addLinkText="+ Add New" />

                {/* 🔍 Search Bar */}
                <div className="mb-4">
                    <SearchBar endpoint="/godowns" placeholder="Search godowns..." />
                </div>

                {/* Table */}
                <TableComponent
                        columns={columns}
                        data={godowns.data}
                        actions={(godown) => (
                            <ActionButtons
                                editHref={`/godowns/${godown.id}/edit`}
                                onDelete={() => handleDelete(godown.id)}
                            />
                        )}
                        noDataMessage="No godowns found."
                    />

                    {/* Pagination */}
                    <Pagination
                        links={godowns.links}
                        currentPage={godowns.current_page}
                        lastPage={godowns.last_page}
                        total={godowns.total}
                    />


            </div>
        </AppLayout>
    );
}
