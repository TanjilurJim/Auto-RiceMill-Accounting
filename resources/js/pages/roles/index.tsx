import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
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

export default function RoleIndex({ roles }: Props) {
    const t = useTranslation();
    const tableData = roles.data;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('ro-dashboard'), href: '/dashboard' },
        { title: t('ro-roles'), href: '/roles' },
    ];

    // 🛑 Handle Delete Confirmation
    const handleDelete = (roleId: number) => {
        confirmDialog({}, () => {
            router.delete(`/roles/${roleId}`);
        });
    };

    const columns = [
        { header: t('ro-serial'), accessor: (row: Role, index?: number) => (index || 0) + 1, className: 'py-2 align-middle' },
        { header: t('ro-name'), accessor: 'name', className: 'py-2 align-middle' },
        {
            header: t('ro-created-at'),
            accessor: (row: Role) => new Date(row.created_at).toLocaleDateString(),
            className: 'py-2 align-middle',
        },
        {
            header: t('ro-actions'),
            accessor: (row: Role) => (
                <ActionButtons
                    editHref={`/roles/${row.id}/edit`}
                    onDelete={() => handleDelete(row.id)}
                    deleteText={
                        <div className="flex items-center">
                            <Trash2 size={14} className="mr-1" />
                            <span className="hidden md:inline">{t('ro-delete')}</span>
                        </div>
                    }
                    editText={
                        <div className="flex items-center">
                            <Pencil size={14} className="mr-1" />
                            <span className="hidden md:inline">{t('ro-edit')}</span>
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
            <Head title={t('ro-roles')} />
            <div className="bg-background h-full w-screen p-6 lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">
                    <PageHeader title={t('ro-roles')} addLinkHref="/roles/create" addLinkText={t('ro-create-role')} />

                    {/* Table */}
                    <TableComponent
                        columns={columns}
                        data={tableData}
                        noDataMessage={t('ro-no-roles')}
                        className="rounded bg-background p-4 shadow dark:bg-neutral-900"
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
