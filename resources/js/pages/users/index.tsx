import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface User {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    deleted_at: string | null;
    created_by_user?: { name: string };
    roles: { id: number; name: string }[];
}

interface Pagination<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
];

export default function UserIndex({ users, filter, search }: { users: Pagination<User>; filter: string; search: string }) {
    const [query, setQuery] = useState(search);
    const { props } = usePage();
    const authUser = props.auth?.user;

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get('/users', { search: query, filter }, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(timeout);
    }, [query, filter]);

    // 🔥 SweetAlert Delete Confirmation
    const confirmDelete = (userId: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/users/${userId}`);
                Swal.fire('Deleted!', 'User has been deleted.', 'success');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <Link href="/users/create" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                        + Create User
                    </Link>
                </div>

                <div className="mb-6 flex space-x-2">
                    {['all', 'active', 'inactive', 'trashed'].map((type) => (
                        <Link
                            key={type}
                            href={`?filter=${type}`}
                            className={`rounded px-3 py-1 text-sm ${
                                filter === type ? 'bg-blue-600 text-white' : 'border hover:bg-neutral-100 dark:hover:bg-neutral-800'
                            }`}
                        >
                            {type === 'all' ? 'All' : type === 'active' ? 'Active' : type === 'inactive' ? 'Inactive' : 'Trashed'}
                        </Link>
                    ))}
                </div>

                {/* 🔍 Live Search */}
                <div className="mb-4 flex items-center gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search users..."
                        className="w-64 rounded border px-3 py-1 dark:border-neutral-700 dark:bg-neutral-800"
                    />
                    {query && (
                        <button type="button" onClick={() => setQuery('')} className="text-sm text-red-600 hover:underline">
                            Clear
                        </button>
                    )}
                </div>

                <div className="rounded bg-white p-4 shadow dark:bg-neutral-900">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="py-2">#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                {authUser?.roles?.some((r: any) => r.name === 'admin') && <th>Created By</th>}
                                <th>Roles</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((userRow, index) => (
                                <tr key={userRow.id} className="border-t border-neutral-200 dark:border-neutral-700">
                                    <td className="py-2 align-middle">{index + 1}</td>
                                    <td className="py-2 align-middle">{userRow.name}</td>
                                    <td className="py-2 align-middle">{userRow.email}</td>
                                    <td className="py-2 align-middle">
                                        <span
                                            className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                                                userRow.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                            }`}
                                        >
                                            {userRow.status}
                                        </span>
                                    </td>

                                    {authUser?.roles?.some((r: any) => r.name === 'admin') && (
                                        <td className="py-2 align-middle">{userRow.created_by ? userRow.created_by.name : 'N/A'}</td>
                                    )}

                                    <td className="py-2 align-middle">
                                        {userRow.roles.length > 0 ? (
                                            userRow.roles.map((role) => (
                                                <span key={role.id} className="mr-1 inline-block rounded bg-blue-500 px-2 py-0.5 text-xs text-white">
                                                    {role.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-500">No Roles</span>
                                        )}
                                    </td>
                                    <td className="flex flex-wrap justify-end space-x-1 py-2 text-right align-middle">
                                        {!userRow.deleted_at ? (
                                            <>
                                                <Link
                                                    href={`/users/${userRow.id}`}
                                                    className="rounded bg-gray-500 px-2 py-1 text-xs text-white hover:bg-gray-700"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/users/${userRow.id}/edit`}
                                                    className="rounded bg-yellow-500 px-2 py-1 text-xs text-white hover:bg-yellow-600"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(userRow.id)}
                                                    className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => router.patch(`/users/${userRow.id}/restore`)}
                                                    className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                                                >
                                                    Restore
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(userRow.id)}
                                                    className="rounded bg-red-800 px-2 py-1 text-xs text-white hover:bg-red-900"
                                                >
                                                    Force Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="mt-4 flex flex-wrap justify-end gap-1">
                        {users.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || ''}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded px-3 py-1 text-sm ${
                                    link.active ? 'bg-blue-600 text-white' : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
                                } ${!link.url && 'pointer-events-none opacity-50'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
