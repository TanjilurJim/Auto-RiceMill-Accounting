// resources/js/pages/units/index.tsx
import ActionButtons from '@/components/ActionButtons';
import ActionFooter from '@/components/ActionFooter';
import AddBtn from '@/components/Btn&Link/AddBtn';
import { confirmDialog } from '@/components/confirmDialog';
import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';

interface Unit {
    id: number;
    name: string;
}

interface PaginatedUnits {
    data: Unit[];
    links: { url: string | null; label: string; active: boolean }[];
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
        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: "You won't be able to revert this!",
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#d33',
        //     cancelButtonColor: '#3085d6',
        //     confirmButtonText: 'Yes, delete it!',
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         destroy(`/units/${id}`, {
        //             onSuccess: () => reset(),
        //         });
        //     }
        // });

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

    return (
        <AppLayout>
            <Head title="Unit Manage" />
            <div className="bg-gray-100">
                {/* <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3"> */}
                <div className="flex flex-col-reverse justify-between gap-4 p-6 md:flex-row">
                    {/* Left: List */}
                    <div className="col-span-2 space-y-4 rounded bg-white p-4 shadow lg:w-2/3">
                        <h2 className="text-lg font-bold">All Unit Manage</h2>
                        <table className="min-w-full border-collapse border border-gray-200 text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-4 py-2">#SL</th>
                                    <th className="border px-4 py-2">Unit Name</th>
                                    <th className="border px-4 py-2 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {units.data.map((unit, idx) => (
                                    <tr key={unit.id} className="border-t hover:bg-gray-100">
                                        <td className="border px-4 py-2">{idx + 1}</td>
                                        <td className="border px-4 py-2">{unit.name}</td>
                                        {/* <td className="flex justify-center gap-1 border px-4 py-2">
                                            <button
                                                onClick={() => handleEdit(unit)}
                                                className="rounded bg-purple-500 px-2 py-1 text-xs text-white hover:bg-purple-600"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(unit.id)}
                                                className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td> */}
                                        <ActionButtons
                                            onEdit={() => handleEdit(unit)} // Function to handle the edit action
                                            onDelete={() => handleDelete(unit.id)} // Function to handle the delete action
                                        />
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {/* <div className="mt-4 flex flex-wrap justify-end gap-1">
                            {units.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || ''}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
                                        } ${!link.url && 'pointer-events-none opacity-50'}`}
                                />
                            ))}
                        </div> */}
                        <Pagination links={units.links} />
                    </div>

                    {/* Right: Form */}
                    <div className="rounded bg-white p-4 shadow lg:w-1/3">
                        <h2 className="mb-4 text-lg font-bold">{editUnit ? 'Edit Unit' : 'Add Unit'}</h2>
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
                                    // <>
                                    //     <button
                                    //         type="submit"
                                    //         disabled={processing}
                                    //         className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                                    //     >
                                    //         Update
                                    //     </button>

                                    //     <button type="button" onClick={handleCancel} className="rounded border px-4 py-2 hover:bg-neutral-100">
                                    //         Cancel
                                    //     </button>
                                    // </>

                                    <ActionFooter
                                        className='w-full justify-between'
                                        onSubmit={handleSubmit} // Function to handle form submission
                                        onCancel={handleCancel} // Function to handle cancel action
                                        processing={processing} // Indicates whether the form is processing
                                        submitText="Update" // Text for the submit button
                                        cancelText="Cancel" // Text for the cancel button
                                    />

                                ) : (
                                    // <button
                                    //     type="submit"
                                    //     disabled={processing}
                                    //     className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                    // >
                                    //     Add Unit
                                    // </button>
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
