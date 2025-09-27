import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface Department {
    id: number;
    name: string;
    description: string;
    creator?: { name: string };
}

export default function DepartmentIndex({ departments }: { departments: Department[] }) {
    const t = useTranslation();

    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/departments/${id}`);
        });
    };

    const columns = [
        { header: t('hrNumberHeader'), accessor: (_: Department, index: number) => index + 1, className: 'text-center' },
        { header: t('hrNameHeader'), accessor: 'name' },
        { header: t('hrDescriptionHeader'), accessor: 'description' },
        { header: t('hrCreatedByHeader'), accessor: (row: Department) => row.creator?.name || t('hrNaText') },
    ];

    return (
        <AppLayout>
            <Head title={t('departmentsTitle')} />
            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg bg-white">
                    <PageHeader title={t('departmentsTitle')} addLinkHref="/departments/create" addLinkText={t('hrAddNewText')} />

                    {/* Responsive Table */}
                    <TableComponent
                        columns={columns}
                        data={departments}
                        actions={(row: Department) => (
                            <ActionButtons
                                editHref={`/departments/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                editText={t('hrEditText')}
                                deleteText={t('hrDeleteText')}
                            />
                        )}
                        noDataMessage={t('noDepartmentsMessage')}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
