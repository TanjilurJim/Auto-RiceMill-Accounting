import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface Permission {
    id: number;
    name: string;
    description?: string;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Permissions', href: '/permissions' },
];

export default function PermissionIndex({ permissions }: { permissions: Permission[] }) {

    // Delete confirmation using SweetAlert2
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
                router.delete(`/permissions/${id}`, {
                    onSuccess: () => {
                        Swal.fire("Deleted!", "Permission has been deleted.", "success");
                    },
                    onError: () => {
                        Swal.fire("Error", "Failed to delete permission.", "error");
                    }
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Permissions</h1>
                    <Link href="/permissions/create" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                        + Create Permission
                    </Link>
                </div>

                <div className="rounded bg-white p-4 shadow dark:bg-neutral-900">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="py-2">#</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Created At</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((permission, index) => (
                                <tr key={permission.id} className="border-t border-neutral-200 dark:border-neutral-700">
                                    <td className="py-2">{index + 1}</td>
                                    <td>{permission.name}</td>
                                    <td>{permission.description || <span className="text-gray-400 italic">No description</span>}</td>
                                    <td>{new Date(permission.created_at).toLocaleDateString()}</td>
                                    <td className="py-2 align-middle">
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <Link
                                                href={`/permissions/${permission.id}/edit`}
                                                className="inline-flex items-center gap-1 rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-yellow-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            >
                                                <Pencil size={14} /> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(permission.id)}
                                                className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
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
