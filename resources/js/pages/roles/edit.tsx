import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import PageHeader from '@/components/PageHeader';
import ActionFooter from '@/components/ActionFooter';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
}

export default function EditRole({
    role,
    permissions,
    rolePermissions,
}: {
    role: Role;
    permissions: Permission[];
    rolePermissions: number[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: rolePermissions, // pre-populated
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Roles', href: '/roles' },
        { title: `Edit ${role.name}`, href: `/roles/${role.id}/edit` },
    ];

    const togglePermission = (id: number) => {
        setData('permissions', data.permissions.includes(id)
            ? data.permissions.filter(pid => pid !== id)
            : [...data.permissions, id]
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/roles/${role.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${role.name}`} />
            <div className="p-6 w-full md:h-screen mx-auto bg-gray-100">
                {/* <h1 className="text-2xl font-bold mb-6">Edit Role</h1> */}
                <PageHeader title="Edit Role" addLinkHref='/roles' addLinkText="Back" />

                <form onSubmit={submit} className="space-y-4 bg-white dark:bg-neutral-900 shadow rounded p-4">
                    <div>
                        <label htmlFor="name" className="block mb-1 font-medium">Role Name</label>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full border rounded p-2 dark:bg-neutral-800 dark:border-neutral-700"
                            placeholder="e.g., admin"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Permissions Checkboxes */}
                    <div>
                        <label className="block mb-1 font-medium">Assigned Permissions</label>
                        <div className="grid grid-cols-2 gap-2">
                            {permissions.map((perm) => (
                                <label key={perm.id} className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={data.permissions.includes(perm.id)}
                                        onChange={() => togglePermission(perm.id)}
                                        className="accent-blue-600"
                                    />
                                    {perm.name}
                                </label>
                            ))}
                        </div>
                        {errors.permissions && (
                            <p className="text-sm text-red-500 mt-1">{errors.permissions}</p>
                        )}
                    </div>

                    {/* <div className="flex justify-end space-x-2">
                        <Link
                            href="/roles"
                            className="px-4 py-2 border rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div> */}
                    <ActionFooter 
                        processing={processing}
                        onSubmit={submit}
                        submitText={processing ? 'Saving...' : 'Save Changes'}
                        className='justify-end'
                        cancelHref="/roles"
                    />
                </form>
            </div>
        </AppLayout>
    );
}
