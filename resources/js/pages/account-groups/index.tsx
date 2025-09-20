import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface AccountGroup {
    id: number;
    name: string;
    nature?: { name: string };
    groupUnder?: { name: string };
    creator?: { name: string };
}

export default function AccountGroupIndex({ accountGroups }: { accountGroups: AccountGroup[] }) {
    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/account-groups/${id}`);
                Swal.fire('Deleted!', 'Account group has been deleted.', 'success');
            }
        });
    };

    // Define table columns for TableComponent
    const tableColumns = [
        {
            header: '#',
            accessor: (_: AccountGroup, index?: number) => <span className="text-center">{(index ?? 0) + 1}</span>,
            className: 'text-center',
        },
        {
            header: 'Name',
            accessor: (group: AccountGroup) => group.name,
        },
        {
            header: 'Nature',
            accessor: (group: AccountGroup) => group.nature?.name || 'N/A',
        },
        {
            header: 'Group Under',
            accessor: (group: AccountGroup) => group.groupUnder?.name || 'N/A',
        },
        {
            header: 'Created By',
            accessor: (group: AccountGroup) => group.creator?.name || 'N/A',
        },
    ];

    // Define actions for each row
    const renderActions = (group: AccountGroup) => (
        <div className="flex justify-items-center space-x-2">
            <Link href={`/account-groups/${group.id}/edit`} className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600">
                Edit
            </Link>
            <button onClick={() => handleDelete(group.id)} className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">
                Delete
            </button>
        </div>
    );

    return (
        <AppLayout>
            <Head title="Account Groups" />

            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <PageHeader title="Account Groups" addLinkHref="/account-groups/create" addLinkText="Add New" />

                {/* Table Component */}
                <TableComponent columns={tableColumns} data={accountGroups} actions={renderActions} noDataMessage="No account groups found." />

                {/* Pagination can be added here if needed */}
            </div>
        </AppLayout>
    );
}
