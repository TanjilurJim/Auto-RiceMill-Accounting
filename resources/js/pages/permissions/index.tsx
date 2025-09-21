import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface Permission {
    id: number;
    name: string;
    description?: string;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Permissions', href: '/permissions' },
];

export default function PermissionIndex({ permissions }: { permissions: Permission[] }) {
    // Delete confirmation using SweetAlert2
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
                router.delete(`/permissions/${id}`, {
                    onSuccess: () => {
                        Swal.fire('Deleted!', 'Permission has been deleted.', 'success');
                    },
                    onError: () => {
                        Swal.fire('Error', 'Failed to delete permission.', 'error');
                    },
                });
            }
        });
    };

    // Define table columns for TableComponent
    const tableColumns = [
        {
            header: '#',
            accessor: (_: Permission, index?: number) => <span className="text-center">{(index ?? 0) + 1}</span>,
            className: 'text-center',
        },
        {
            header: 'Name',
            accessor: (permission: Permission) => permission.name,
        },
        {
            header: 'Description',
            accessor: (permission: Permission) => permission.description || <span className="text-gray-400 italic">No description</span>,
        },
        {
            header: 'Created At',
            accessor: (permission: Permission) => new Date(permission.created_at).toLocaleDateString(),
        },
    ];

    // Define actions for each row
    const renderActions = (permission: Permission) => (
        <div className="flex justify-end gap-2">
            <Link
                href={`/permissions/${permission.id}/edit`}
                className="inline-flex items-center gap-1 rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-yellow-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
                <Pencil size={14} />
                <span className='hidden md:inline'>Edit</span>
            </Link>
            <button
                onClick={() => handleDelete(permission.id)}
                className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
            >
                <Trash2 size={14} />
                <span className='hidden md:inline'>Delete</span>
            </button>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="h-full w-screen lg:w-full p-4 md:p-12">
                <PageHeader title="Permissions" addLinkHref="/permissions/create" addLinkText="+ Create Permission" />

                <div className="rounded bg-white p-4 shadow dark:bg-neutral-900">
                    <TableComponent columns={tableColumns} data={permissions} actions={renderActions} noDataMessage="No permissions found." />
                </div>
            </div>
        </AppLayout>
    );
}
