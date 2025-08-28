import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         router.get('/users', { search: query, filter }, { preserveState: true, replace: true });
    //     }, 300);
    //     return () => clearTimeout(timeout);
    // }, [query, filter]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (query !== search) {
                router.get('/users', { search: query, filter }, { preserveState: true, replace: true });
            }
        }, 100);
        return () => clearTimeout(timeout);
    }, [query, filter]);

    // 🔥 SweetAlert Delete Confirmation
    const confirmDelete = (row: User) => {
        confirmDialog({}, () => {
            if (row.deleted_at) {
                // FORCE DELETE (per your routes/users group)
                router.delete(route('users.force-delete', row.id), { preserveScroll: true });
            } else {
                // SOFT DELETE
                router.delete(route('users.destroy', row.id), { preserveScroll: true });
            }
        });
    };

    const restoreUser = (id: number) => {
        router.patch(route('users.restore', id), undefined, { preserveScroll: true });
    };

    const columns = [
        { header: '#', accessor: (_: any, index: number) => index + 1, className: 'py-2 align-middle text-center' },
        { header: 'Name', accessor: 'name', className: 'py-2 align-middle text-center' },
        { header: 'Email', accessor: 'email', className: 'py-2 align- text-center' },
        {
            header: 'Status',
            accessor: (row: User) => (
                <span
                    className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        row.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                >
                    {row.status}
                </span>
            ),
            className: 'py-2 align-middle text-center',
        },
        ...(authUser?.roles?.some((r: any) => r.name === 'admin')
            ? [
                  {
                      header: 'Created By',
                      accessor: (row: User) => row.created_by_user?.name || 'N/A',
                      className: 'py-2 align-middle text-center',
                  },
              ]
            : []),
        {
            header: 'Roles',
            accessor: (row: User) => (
                <div className="flex items-center justify-center gap-1">
                    {row.roles.length > 0 ? (
                        row.roles.map((role) => (
                            <span key={role.id} className="inline-block rounded bg-blue-500 px-2 py-1 text-xs text-white">
                                {role.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-gray-500">No Roles</span>
                    )}
                </div>
            ),
            className: 'py-2 align-middle text-center ',
        },
        {
            header: 'Actions',
            accessor: (row: User) => (
                <div className="flex flex-wrap justify-center space-x-1">
                    {!row.deleted_at ? (
                        <ActionButtons
                            printHref={`/users/${row.id}`}
                            editHref={`/users/${row.id}/edit`}
                            onDelete={() => confirmDelete(row)}
                            printText="View"
                            editText="Edit"
                            deleteText="Delete"
                        />
                    ) : (
                        <div className="flex gap-2">
                            {/* Restore must be PATCH, not GET */}
                            <button className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700" onClick={() => restoreUser(row.id)}>
                                Restore
                            </button>
                            <button className="rounded bg-red-800 px-3 py-1 text-white hover:bg-red-900" onClick={() => confirmDelete(row)}>
                                Force Delete
                            </button>
                        </div>
                    )}
                </div>
            ),
            className: 'py-2 align-middle',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-white p-6">
                    <PageHeader title="Users" addLinkHref="users/create" addLinkText="+ Create User" />

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

                    {/* Table */}
                    <TableComponent
                        columns={columns}
                        data={users.data}
                        noDataMessage="No users found."
                        className="rounded bg-white p-4 shadow dark:bg-neutral-900"
                    />

                    {/* Pagination */}
                    <Pagination links={users.links} currentPage={users.current_page} lastPage={users.last_page} total={users.total} />
                </div>
            </div>
        </AppLayout>
    );
}
