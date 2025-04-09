import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface Designation {
    id: number;
    name: string;
    description: string;
    creator?: { name: string };
}

export default function DesignationIndex({ designations }: { designations: Designation[] }) {

    const handleDelete = (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/designations/${id}`);
                Swal.fire("Deleted!", "Designation has been deleted.", "success");
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Designations" />
            <div className="p-6">
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Designations</h1>
                    <Link href="/designations/create" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                        + Add New
                    </Link>
                </div>

                <div className="overflow-x-auto bg-white shadow-md rounded-lg dark:bg-neutral-900">
                    <table className="min-w-full border-collapse border border-gray-200 dark:border-neutral-700">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="py-2 px-4 border">#</th>
                                <th className="py-2 px-4 border">Name</th>
                                <th className="py-2 px-4 border">Description</th>
                                <th className="py-2 px-4 border">Created By</th>
                                <th className="py-2 px-4 border text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {designations.map((designation, index) => (
                                <tr key={designation.id} className="border-t border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800">
                                    <td className="py-2 px-4 text-center">{index + 1}</td>
                                    <td className="py-2 px-4">{designation.name}</td>
                                    <td className="py-2 px-4">{designation.description}</td>
                                    <td className="py-2 px-4">{designation.creator?.name || 'N/A'}</td>
                                    <td className="py-2 px-4 flex justify-center space-x-2">
                                        <Link 
                                            href={`/designations/${designation.id}/edit`} 
                                            className="px-3 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600"
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(designation.id)} 
                                            className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
