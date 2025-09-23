import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface Salesman {
    id: number;
    salesman_code: string;
    name: string;
    phone_number: string;
    email?: string;
    address?: string;
    created_by_user?: { name: string };
}

export default function SalesmanIndex({ salesmen }: { salesmen: Salesman[] }) {
    const t = useTranslation();

    const handleDelete = (id: number) => {
        confirmDialog({}, () => router.delete(`/salesmen/${id}`));
    };

    const columns = [
        {
            header: '#',
            accessor: (_: any, index?: number) => (index !== undefined ? index + 1 : '-'),
            className: 'text-center',
        },
        { header: t('salesmanCode'), accessor: 'salesman_code' },
        { header: t('salesmanName'), accessor: 'name' },
        { header: t('phoneNumber'), accessor: 'phone_number' },
        { header: t('email'), accessor: (row: Salesman) => row.email || t('notAvailable') },
        { header: t('address'), accessor: (row: Salesman) => row.address || t('notAvailable') },
        { header: t('createdBy'), accessor: (row: Salesman) => row.created_by_user?.name || t('notAvailable') },
    ];

    return (
        <AppLayout>
            <Head title={t('allSalesmenTitle')} />

            {/* Page background adapts to theme */}
            <div className="bg-background h-full w-screen md:p-6 lg:w-full">
                {/* Card surface with border + correct text color */}
                <div className="bg-background h-full rounded-lg p-3 md:p-6">
                    <PageHeader title={t('allSalesmenTitle')} addLinkHref="/salesmen/create" addLinkText={t('addNew')} />

                    <TableComponent
                        columns={columns}
                        data={salesmen}
                        actions={(salesman) => (
                            <ActionButtons editHref={`/salesmen/${salesman.id}/edit`} onDelete={() => handleDelete(salesman.id)} />
                        )}
                        noDataMessage={t('noSalesmenFound')}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
