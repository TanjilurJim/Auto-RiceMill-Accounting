import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface Shift {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    description: string;
    creator?: { name: string };
}

export default function ShiftIndex({ shifts }: { shifts: Shift[] }) {
    const t = useTranslation();

    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/shifts/${id}`);
        });
    };

    const columns = [
        { header: t('hrNumberHeader'), accessor: (_: Shift, index: number) => index + 1, className: 'text-center' },
        { header: t('hrNameHeader'), accessor: 'name' },
        { header: t('hrStartTimeHeader'), accessor: 'start_time' },
        { header: t('hrEndTimeHeader'), accessor: 'end_time' },
        { header: t('hrDescriptionHeader'), accessor: 'description' },
        { header: t('hrCreatedByHeader'), accessor: (row: Shift) => row.creator?.name || t('hrNaText') },
    ];

    return (
        <AppLayout>
            <Head title={t('shiftsTitle')} />
            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg bg-white">
                    <PageHeader title={t('shiftsTitle')} addLinkHref="/shifts/create" addLinkText={t('hrAddNewText')} />

                    <TableComponent
                        columns={columns}
                        data={shifts}
                        actions={(row: Shift) => (
                            <ActionButtons
                                editHref={`/shifts/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                editText={t('hrEditText')}
                                deleteText={t('hrDeleteText')}
                            />
                        )}
                        noDataMessage={t('noShiftsMessage')}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
