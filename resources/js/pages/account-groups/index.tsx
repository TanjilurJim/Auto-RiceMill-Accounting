import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
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
    const t = useTranslation();
    const handleDelete = (id: number) => {
        Swal.fire({
            title: t('confirmDeleteAccountGroupTitle'),
            text: t('confirmDeleteAccountGroupText'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: t('confirmButtonText'),
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/account-groups/${id}`);
                Swal.fire(t('deletedSuccess'), t('accountGroupDeletedText'), 'success');
            }
        });
    };

    // Define table columns for TableComponent
    const tableColumns = [
        {
            header: '#',
            accessor: (_: AccountGroup, index?: number) => <span className="text-center">{(index ?? 0) + 1}</span>,
        },
        {
            header: t('name'),
            accessor: (group: AccountGroup) => group.name,
        },
        {
            header: t('nature'),
            accessor: (group: AccountGroup) => group.nature?.name || 'N/A',
        },
        {
            header: t('groupUnder'),
            accessor: (group: AccountGroup) => group.groupUnder?.name || 'N/A',
        },
        {
            header: t('createdBy'),
            accessor: (group: AccountGroup) => group.creator?.name || 'N/A',
        },
    ];

    // Define actions for each row
    const renderActions = (group: AccountGroup) => (
        <div className="flex justify-items-center space-x-2">
            <Link href={`/account-groups/${group.id}/edit`} className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600">
                {t('edit')}
            </Link>
            <button onClick={() => handleDelete(group.id)} className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">
                {t('delete')}
            </button>
        </div>
    );

    return (
        <AppLayout>
            <Head title={t('accountGroups')} />

            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <PageHeader title={t('accountGroups')} addLinkHref="/account-groups/create" addLinkText={t('addNew')} />

                {/* Table Component */}
                <TableComponent columns={tableColumns} data={accountGroups} actions={renderActions} noDataMessage={t('noAccountGroups')} />
            </div>
        </AppLayout>
    );
}
