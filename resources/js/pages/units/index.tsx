// resources/js/pages/units/index.tsx
import ActionButtons from '@/components/ActionButtons';
import ActionFooter from '@/components/ActionFooter';
import AddBtn from '@/components/Btn&Link/AddBtn';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Unit {
    id: number;
    name: string;
}

interface PaginatedUnits {
    data: Unit[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function UnitIndex({ units }: { units: PaginatedUnits }) {
    const [editUnit, setEditUnit] = useState<Unit | null>(null);
    const t = useTranslation();

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        name: '',
    });

    const handleEdit = (unit: Unit) => {
        setEditUnit(unit);
        setData('name', unit.name);
    };

    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            destroy(`/units/${id}`, {
                onSuccess: () => reset(),
            });
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editUnit) {
            put(`/units/${editUnit.id}`, {
                onSuccess: () => {
                    reset();
                    setEditUnit(null);
                },
            });
        } else {
            post('/units', {
                onSuccess: () => reset(),
            });
        }
    };

    const handleCancel = () => {
        reset();
        setEditUnit(null);
    };

    const columns = [
        {
            header: '#',
            accessor: (_: Unit, index?: number) => (index !== undefined ? index + 1 : '—'),
        },
        { header: t('unitNameLabel'), accessor: 'name' },
        {
            header: t('tableActionsHeader'),
            accessor: (unit: Unit) => <ActionButtons onEdit={() => handleEdit(unit)} onDelete={() => handleDelete(unit.id)} />,
            className: 'text-center',
        },
    ];

    // const inputCls = 'w-full rounded-md border bg-background p-2 text-foreground outline-none focus:ring-2 focus:ring-ring';

    return (
        <AppLayout>
            <Head title={t('unitManage')} />

            <div className="text-foreground w-full p-4 md:p-12">
                <div className="grid grid-cols-12 gap-4">
                    {/* Left: List */}
                    <div className="col-span-12 lg:col-span-8">
                        <div className="space-y-4">
                            <PageHeader title={t('unitManage')} />
                            <div className="rounded-md border">
                                <TableComponent columns={columns} data={units.data} noDataMessage={t('noUnitsFound')} />
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="bg-background space-y-3 rounded-md border p-4">
                            <PageHeader title={editUnit ? t('editUnitTitle') : t('addUnitTitle')} />
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input
                                    type="text"
                                    placeholder={t('unitNamePlaceholder')}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded border p-2"
                                    autoComplete="off"
                                    aria-invalid={!!errors.name}
                                />
                                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}

                                <div className="flex justify-between">
                                    {editUnit ? (
                                        <ActionFooter
                                            className="w-full justify-between"
                                            onSubmit={handleSubmit}
                                            onCancel={handleCancel}
                                            processing={processing}
                                            submitText={t('updateButton')}
                                            cancelText={t('cancelButton')}
                                        />
                                    ) : (
                                        <AddBtn processing={processing}>{t('addUnitButton')}</AddBtn>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Pagination links={units.links} currentPage={units.current_page} lastPage={units.last_page} total={units.total} />
            </div>
        </AppLayout>
    );
}
