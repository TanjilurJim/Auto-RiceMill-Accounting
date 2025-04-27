import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface Permission {
    id: number;
    name: string;
}

export default function CreateRole({ permissions }: { permissions: Permission[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as number[],
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Roles', href: '/roles' },
        { title: 'Create', href: '/roles/create' },
    ];

    const togglePermission = (id: number) => {
        setData('permissions', data.permissions.includes(id) ? data.permissions.filter((pid) => pid !== id) : [...data.permissions, id]);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/roles');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <div className="flex w-full md:h-screen justify-center bg-gray-100 dark:bg-neutral-950">
                <div className="w-full p-6">
                    <PageHeader title="Create Role" addLinkHref='/roles' addLinkText="Back" />

                    <form onSubmit={submit} className="space-y-4 rounded bg-white p-4 shadow dark:bg-neutral-900">
                        {/* Role Name */}
                        <div>
                            <label htmlFor="name" className="mb-1 block font-medium">
                                Role Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder="e.g., admin, editor"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Permissions Checkboxes */}
                        <div>
                            <label className="mb-1 block font-medium">Assign Permissions</label>
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
                            {errors.permissions && <p className="mt-1 text-sm text-red-500">{errors.permissions}</p>}
                        </div>

                        {/* Buttons */}
                        {/* <div className="flex justify-end space-x-2">
                            <Link href="/roles" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create'}
                            </button>
                        </div> */}
                        <ActionFooter
                            processing={processing}
                            onSubmit={submit}
                            submitText={processing ? 'Creating...' : 'Create'}
                            cancelHref="/roles"
                            className="justify-end"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
