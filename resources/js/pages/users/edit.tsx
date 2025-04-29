import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    status: 'active' | 'inactive';
}

export default function EditUser({
    user,
    roles,
    userRoles,
}: {
    user: User;
    roles: Role[];
    userRoles: number[];
}) {
    const { props } = usePage();
    const authUser = props.auth?.user; // Get the logged-in user

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        status: user.status,
        roles: userRoles,
    });

    const toggleRole = (id: number) => {
        setData('roles', data.roles.includes(id)
            ? data.roles.filter(rid => rid !== id)
            : [...data.roles, id]
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${user.id}`);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/users' },
        { title: `Edit ${user.name}`, href: `/users/${user.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User - ${user.name}`} />
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">
                    <PageHeader title="Edit User" addLinkHref='/users' addLinkText="Back" />

                    <form onSubmit={submit} className="space-y-4 bg-white dark:bg-neutral-900 border rounded-lg p-4">
                        <div>
                            <label className="block mb-1 font-medium">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full border rounded p-2 dark:bg-neutral-800 dark:border-neutral-700"
                            />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full border rounded p-2 dark:bg-neutral-800 dark:border-neutral-700"
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Phone</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className="w-full border rounded p-2 dark:bg-neutral-800 dark:border-neutral-700"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Address</label>
                            <textarea
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                className="w-full border rounded p-2 dark:bg-neutral-800 dark:border-neutral-700"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Status</label>
                            <select
                                value={data.status}
                                onChange={e => setData('status', e.target.value as 'active' | 'inactive')}
                                className="w-full border rounded p-2 dark:bg-neutral-800 dark:border-neutral-700"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Roles Checkboxes */}
                        <div>
                            <label className="block mb-1 font-medium">Assign Roles</label>

                            {/* 🛡 Restrict non-admins from editing their own roles */}
                            {authUser.id === user.id && !authUser.roles.some((r: any) => r.name === 'admin') ? (
                                <p className="text-gray-500 italic">You cannot change your own roles.</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {roles.map((role) => (
                                        <label key={role.id} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={data.roles.includes(role.id)}
                                                onChange={() => toggleRole(role.id)}
                                                className="accent-blue-600"
                                            />
                                            {role.name}
                                        </label>
                                    ))}
                                </div>
                            )}

                            {errors.roles && <p className="text-sm text-red-500 mt-1">{errors.roles}</p>}
                        </div>
                        <ActionFooter
                            processing={processing}
                            submitText={processing ? 'Saving...' : 'Save'}
                            onSubmit={submit}
                            cancelHref='/users'
                            className='justify-end'
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
