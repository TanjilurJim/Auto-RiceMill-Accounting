import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
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

interface Props {
    roles: {
        data: Role[];
        links: any[];
        current_page: number;
        total: number;
        per_page: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/roles' },
];

export default function RoleIndex({ roles }: Props) {
    const tableData = roles.data;

    // 🛑 Handle Delete Confirmation
    const handleDelete = (roleId: number) => {
        confirmDialog({}, () => {
            router.delete(`/roles/${roleId}`);
        });
    };

    const columns = [
        { header: '#', accessor: (_: any, index: number) => index + 1, className: 'py-2 align-middle' },
        { header: 'Name', accessor: 'name', className: 'py-2 align-middle' },
        {
            header: 'Created At',
            accessor: (row: Role) => new Date(row.created_at).toLocaleDateString(),
            className: 'py-2 align-middle',
        },
        {
            header: 'Actions',
            accessor: (row: Role) => (
                <ActionButtons
                    editHref={`/roles/${row.id}/edit`}
                    onDelete={() => handleDelete(row.id)}
                    deleteText={
                        <div className="flex items-center">
                            <Trash2 size={14} className="mr-1" />
                            <span className='hidden md:inline'>Delete</span>
                        </div>
                    }
                    editText={
                        <div className="flex items-center">
                            <Pencil size={14} className="mr-1" />
                             <span className='hidden md:inline'>Edit</span>
                        </div>
                    }
                    className="justify-items-center"
                />
            ),
            className: 'py-2 align-middle',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="bg-background h-full w-screen p-6 lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">
                    <PageHeader title="Roles" addLinkHref="/roles/create" addLinkText="+ Create Role" />

                    {/* Table */}
                    <TableComponent
                        columns={columns}
                        data={tableData}
                        pagination={roles}
                        noDataMessage="No roles found."
                        className="rounded bg-white p-4 shadow dark:bg-neutral-900"
                    />

                    <Pagination
                        links={roles.links}
                        currentPage={roles.current_page}
                        lastPage={Math.ceil(roles.total / roles.per_page)}
                        total={roles.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
