import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface Role {
    id: number;
    name: string;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/roles' },
];

export default function RoleIndex({ roles }: { roles: Role[] }) {

    // 🛑 Handle Delete Confirmation
    const handleDelete = (roleId: number) => {
        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: "This action cannot be undone!",
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#d33',
        //     cancelButtonColor: '#3085d6',
        //     confirmButtonText: 'Yes, delete it!',
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         router.delete(`/roles/${roleId}`);
        //         Swal.fire('Deleted!', 'The role has been deleted.', 'success');
        //     }
        // });

        confirmDialog(
            {}, () => {
                router.delete(`/roles/${roleId}`);
            }
        )

    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="p-6">
                {/* <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Roles</h1>
                    <Link
                        href="/roles/create"
                        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                        + Create Role
                    </Link>
                </div> */}

                <PageHeader title="Roles" addLinkHref='/roles/create' addLinkText="+ Create Role" />

                <div className="rounded bg-white p-4 shadow dark:bg-neutral-900">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="py-2">#</th>
                                <th>Name</th>
                                <th className="text-right">Created At</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role, index) => (
                                <tr key={role.id} className="border-t border-neutral-200 dark:border-neutral-700">
                                    <td className="py-2 align-middle">{index + 1}</td>
                                    <td className="py-2 align-middle">{role.name}</td>
                                    <td className="py-2 align-middle text-right">
                                        {new Date(role.created_at).toLocaleDateString()}
                                    </td>
                                    {/* <td className="py-2 align-middle ">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/roles/${role.id}/edit`}
                                                className="inline-flex items-center gap-1 rounded-md  bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-yellow-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            >
                                                <Pencil size={14} /> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(role.id)}
                                                className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </td> */}
                                    <ActionButtons
                                        editHref={`/roles/${role.id}/edit`}
                                        onDelete={() => handleDelete(role.id)}
                                        deleteText="Delete"
                                        editText="Edit"
                                        className='justify-end'
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
