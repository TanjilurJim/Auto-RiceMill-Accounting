import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    status: 'active' | 'inactive';
    createdBy?: { name: string } | null;
    roles: { id: number; name: string }[];
}

export default function UserShow({ user }: { user: User }) {
    const { props } = usePage();
    const authUser = props.auth?.user;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/users' },
        { title: user.name, href: `/users/${user.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User - ${user.name}`} />
            <div className="mx-auto max-w-xl p-6">
                <h1 className="mb-4 text-2xl font-bold">User Details</h1>

                <div className="space-y-4 rounded bg-white p-4 shadow dark:bg-neutral-900">
                    <div>
                        <strong>Name:</strong> {user.name}
                    </div>
                    <div>
                        <strong>Email:</strong> {user.email}
                    </div>
                    <div>
                        <strong>Phone:</strong> {user.phone || '-'}
                    </div>
                    <div>
                        <strong>Address:</strong> {user.address || '-'}
                    </div>
                    <div>
                        <strong>Status:</strong>{' '}
                        <span
                            className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                                user.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}
                        >
                            {user.status}
                        </span>
                    </div>

                    {/* Only for Admin */}
                    {authUser?.roles?.some((r: any) => r.name === 'admin') && (
                        <div>
                            <strong>Created By:</strong> {user.created_by?.name || 'N/A'}
                        </div>
                    )}

                    <div>
                        <strong>Roles:</strong>{' '}
                        {user.roles.length > 0 ? (
                            user.roles.map((role) => (
                                <span key={role.id} className="mr-1 inline-block rounded bg-blue-500 px-2 py-0.5 text-xs text-white">
                                    {role.name}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-gray-500">No Roles</span>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Link href={`/users/${user.id}/edit`} className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600">
                            Edit
                        </Link>
                        <Link href="/users" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                            Back
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
