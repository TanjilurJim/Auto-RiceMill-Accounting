import ActionButtons from '@/components/ActionButtons';
import ActionFooter from '@/components/ActionFooter';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface Department {
    id: number;
    name: string;
    description: string;
    creator?: { name: string };
}

export default function DepartmentIndex({ departments }: { departments: Department[] }) {

    const handleDelete = (id: number) => {
        // Swal.fire({
        //     title: "Are you sure?",
        //     text: "This action cannot be undone!",
        //     icon: "warning",
        //     showCancelButton: true,
        //     confirmButtonColor: "#d33",
        //     cancelButtonColor: "#3085d6",
        //     confirmButtonText: "Yes, delete it!"
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         router.delete(`/departments/${id}`);
        //         Swal.fire("Deleted!", "Department has been deleted.", "success");
        //     }
        // });
        confirmDialog(
            {}, () => {
                router.delete(`/departments/${id}`);
            }
        );
    };

    return (
        <AppLayout>
            <Head title="Departments" />
            <div className="p-6">

                {/* Page Header */}
                {/* <div className="flex flex-wrap items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Departments</h1>
                    <Link href="/departments/create" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                        + Add New
                    </Link>
                </div> */}

                <PageHeader title="Departments" addLinkHref='/departments/create' addLinkText="+ Add New" />

                {/* Responsive Table */}
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
                            {departments.map((department, index) => (
                                <tr key={department.id} className="border-t border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800">
                                    <td className="py-2 px-4 text-center">{index + 1}</td>
                                    <td className="py-2 px-4">{department.name}</td>
                                    <td className="py-2 px-4">{department.description}</td>
                                    <td className="py-2 px-4">{department.creator?.name || 'N/A'}</td>
                                    {/* <td className="py-2 px-4 flex justify-center space-x-2">
                                        <Link
                                            href={`/departments/${department.id}/edit`}
                                            className="px-3 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(department.id)}
                                            className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td> */}
                                    <ActionButtons
                                        editHref={`/departments/${department.id}/edit`}
                                        onDelete={() => handleDelete(department.id)}
                                        editText="Edit"
                                        deleteText="Delete"
                                    />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
