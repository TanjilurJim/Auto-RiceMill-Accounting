import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';

interface Role {
    id: number;
    name: string;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/roles' },
];

export default function RoleIndex({ roles }: { roles: Role[] }) {

    // 🛑 Handle Delete Confirmation
    const handleDelete = (roleId: number) => {

        confirmDialog(
            {}, () => {
                router.delete(`/roles/${roleId}`);
            }
        )

    };

    const columns = [
        { header: '#', accessor: (_: any, index: number) => index + 1, className: 'py-2 align-middle text-center' },
        { header: 'Name', accessor: 'name', className: 'py-2 align-middle text-center' },
        {
            header: 'Created At',
            accessor: (row: Role) => new Date(row.created_at).toLocaleDateString(),
            className: 'py-2 align-middle text-center',
        },
        {
            header: 'Actions',
            accessor: (row: Role) => (
                <ActionButtons
                    editHref={`/roles/${row.id}/edit`}
                    onDelete={() => handleDelete(row.id)}
                    deleteText={
                        <>
                            <Trash2 size={14} className="inline-block mr-1" /> Delete
                        </>
                    }
                    editText={
                        <>
                            <Pencil size={14} className="inline-block mr-1" /> Edit
                        </>
                    }
                    className="justify-end"
                />
            ),
            className: 'py-2 align-middle text-center',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">

                    <PageHeader title="Roles" addLinkHref='/roles/create' addLinkText="+ Create Role" />

                    {/* Table */}
                    <TableComponent
                        columns={columns}
                        data={roles}
                        noDataMessage="No roles found."
                        className="rounded bg-white p-4 shadow dark:bg-neutral-900"
                    />

                </div>
            </div>
        </AppLayout>
    );
}
