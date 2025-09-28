import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface Designation {
    id: number;
    name: string;
    description: string;
    creator?: { name: string };
}

export default function DesignationIndex({ designations }: { designations: Designation[] }) {
    const t = useTranslation();

    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/designations/${id}`);
        });
    };

    const columns = [
        { header: t('hrNumberHeader'), accessor: (_: Designation, index: number) => index + 1, className: 'text-center' },
        { header: t('hrNameHeader'), accessor: 'name' },
        { header: t('hrDescriptionHeader'), accessor: 'description' },
        { header: t('hrCreatedByHeader'), accessor: (row: Designation) => row.creator?.name || t('hrNaText') },
    ];

    return (
        <AppLayout>
            <Head title={t('designationsTitle')} />
            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg bg-background">
                    <PageHeader title={t('designationsTitle')} addLinkHref="/designations/create" addLinkText={t('hrAddNewText')} />

                    <TableComponent
                        columns={columns}
                        data={designations}
                        actions={(row: Designation) => (
                            <ActionButtons
                                editHref={`/designations/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                editText={t('hrEditText')}
                                deleteText={t('hrDeleteText')}
                            />
                        )}
                        noDataMessage={t('noDesignationsMessage')}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
