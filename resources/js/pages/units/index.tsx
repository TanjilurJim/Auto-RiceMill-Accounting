// resources/js/pages/units/index.tsx
import ActionButtons from '@/components/ActionButtons';
import ActionFooter from '@/components/ActionFooter';
import AddBtn from '@/components/Btn&Link/AddBtn';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
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

        confirmDialog(
            {}, () => {
                destroy(`/units/${id}`, {
                    onSuccess: () => reset(),
                });
            }
        );
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
            header: '#SL',
            accessor: (_: Unit, index?: number) => (index !== undefined ? index + 1 : '-'),
            className: 'text-center',
        },
        { header: 'Unit Name', accessor: 'name' },
        {
            header: 'Action',
            accessor: (unit: Unit) => (
                <ActionButtons
                    onEdit={() => handleEdit(unit)}
                    onDelete={() => handleDelete(unit.id)}
                />
            ),
            className: 'text-center',
        },
    ];

    return (
        <AppLayout>
            <Head title="Unit Manage" />
            <div className="bg-gray-100">
                <div className="flex flex-col-reverse justify-between gap-4 p-6 md:flex-row">
                    {/* Left: List */}
                    <div className="col-span-2 space-y-4 rounded bg-white p-4 shadow md:w-2/3">
                        <PageHeader title="Unit Manage" />
                        <TableComponent
                            columns={columns}
                            data={units.data}
                            noDataMessage="No units found."
                        />

                        {/* Pagination */}
                        <Pagination
                            links={units.links}
                            currentPage={units.current_page}
                            lastPage={units.last_page}
                            total={units.total}
                        />
                    </div>

                    {/* Right: Form */}
                    <div className="rounded bg-white p-4 shadow md:w-1/3">
                        <PageHeader title={editUnit ? 'Edit Unit' : 'Add Unit'} />
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Unit Name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded border p-2"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

                            <div className="flex justify-between">
                                {editUnit ? (
                                    <ActionFooter
                                        className='w-full justify-between'
                                        onSubmit={handleSubmit}
                                        onCancel={handleCancel}
                                        processing={processing}
                                        submitText="Update"
                                        cancelText="Cancel"
                                    />

                                ) : (
                                    <AddBtn processing={processing} children="Add Unit" />
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
