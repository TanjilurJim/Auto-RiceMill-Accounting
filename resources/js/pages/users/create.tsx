import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Role {
    id: number;
    name: string;
}

export default function CreateUser({ roles }: { roles: Role[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as number[],
    });

    const toggleRole = (id: number) => {
        setData('roles', data.roles.includes(id) ? data.roles.filter((rid) => rid !== id) : [...data.roles, id]);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users');
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/users' },
        { title: 'Create User', href: '/users/create' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <div className="flex min-h-screen justify-center bg-gray-100 dark:bg-neutral-950">
                <div className="w-full max-w-xl p-6">
                    {/* <h1 className="mb-6 text-2xl font-bold">Create User</h1> */}
                    <PageHeader title='Create User' addLinkHref='/users' addLinkText='Back' />

                    <form onSubmit={submit} className="space-y-4 rounded bg-white p-4 shadow-2xl dark:bg-neutral-900">
                        <div>
                            <label className="mb-1 block font-medium">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder="Your Name"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder="youremail@example.com"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Confirm Password</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Roles Checkboxes */}
                        <div>
                            <label className="mb-1 block font-medium">Assign Roles</label>
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
                            {errors.roles && <p className="mt-1 text-sm text-red-500">{errors.roles}</p>}
                        </div>

                        {/* <div className="flex justify-end space-x-2">
                            <Link href="/users" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create User'}
                            </button>
                        </div> */}
                        <ActionFooter 
                            processing={processing}
                            onSubmit={submit}
                            submitText={processing ? 'Creating...' : 'Create User'}
                            cancelHref='/users'
                            className='justify-end'
                        />

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
