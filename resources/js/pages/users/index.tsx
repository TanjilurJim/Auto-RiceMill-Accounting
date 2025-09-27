import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
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
    created_by?: { name: string };
    roles: { id: number; name: string }[];
}

interface Pagination<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function UserIndex({ users, filter, search }: { users: Pagination<User>; filter: string; search: string }) {
    const t = useTranslation();
    const [query, setQuery] = useState(search);
    const { props } = usePage();
    const authUser = props.auth?.user;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('us-dashboard'), href: '/dashboard' },
        { title: t('us-users'), href: '/users' },
    ];

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
        { header: t('us-serial'), accessor: (row: User, index?: number) => (index || 0) + 1, className: 'py-2 align-middle' },
        { header: t('us-name'), accessor: 'name', className: 'py-2 align-middle' },
        { header: t('us-email'), accessor: 'email', className: 'py-2 align-middle' },
        // Status
        {
            header: t('us-status'),
            accessor: (row: User) => (
                <span
                    className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        row.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                >
                    {row.status === 'active' ? t('us-active') : t('us-inactive')}
                </span>
            ),
            className: 'py-2 align-middle',
        },
        ...(authUser?.roles?.some((r: { id: number; name: string }) => r.name === 'admin')
            ? [
                  {
                      header: t('us-created-by'),
                      accessor: (row: User) => row.created_by?.name || t('us-na'),
                      className: 'py-2 align-middle',
                  },
              ]
            : []),
        {
            header: t('us-roles'),
            accessor: (row: User) => (
                <div className="flex items-center gap-1">
                    {row.roles.length > 0 ? (
                        row.roles.map((role) => (
                            <span key={role.id} className="inline-block rounded bg-blue-500 px-2 py-1 text-xs text-white">
                                {role.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-gray-500">{t('us-no-roles')}</span>
                    )}
                </div>
            ),
            className: 'py-2 align-middle',
        },
        {
            header: t('us-actions'),
            accessor: (row: User) => (
                <div className="flex flex-wrap space-x-1">
                    {!row.deleted_at ? (
                        <ActionButtons
                            printHref={`/users/${row.id}`}
                            editHref={`/users/${row.id}/edit`}
                            onDelete={() => confirmDelete(row)}
                            printText={t('us-view')}
                            editText={t('us-edit')}
                            deleteText={t('us-delete')}
                        />
                    ) : (
                        <div className="flex gap-2">
                            {/* Restore must be PATCH, not GET */}
                            <button className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700" onClick={() => restoreUser(row.id)}>
                                {t('us-restore')}
                            </button>
                            <button className="rounded bg-red-800 px-3 py-1 text-white hover:bg-red-900" onClick={() => confirmDelete(row)}>
                                {t('us-force-delete')}
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
            <Head title={t('us-users')} />
            <div className="bg-background h-full w-screen p-6 lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">
                    <PageHeader title={t('us-users')} addLinkHref="users/create" addLinkText={t('us-create-user')} />

                    <div className="mb-6 flex space-x-2">
                        {['all', 'active', 'inactive', 'trashed'].map((type) => (
                            <Link
                                key={type}
                                href={`?filter=${type}`}
                                className={`rounded px-3 py-1 text-sm ${
                                    filter === type ? 'bg-blue-600 text-white' : 'border hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                }`}
                            >
                                {type === 'all'
                                    ? t('us-all')
                                    : type === 'active'
                                      ? t('us-active')
                                      : type === 'inactive'
                                        ? t('us-inactive')
                                        : t('us-trashed')}
                            </Link>
                        ))}
                    </div>

                    {/* 🔍 Live Search */}
                    <div className="mb-4 flex items-center gap-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('us-search-placeholder')}
                            className="w-64 rounded border px-3 py-1 dark:border-neutral-700 dark:bg-neutral-800"
                        />
                        {query && (
                            <button type="button" onClick={() => setQuery('')} className="text-sm text-red-600 hover:underline">
                                {t('us-clear')}
                            </button>
                        )}
                    </div>

                    {/* Table */}
                    <TableComponent columns={columns} data={users.data} noDataMessage={t('us-no-users-found')} />

                    {/* Pagination */}
                    <Pagination links={users.links} currentPage={users.current_page} lastPage={users.last_page} total={users.total} />
                </div>
            </div>
        </AppLayout>
    );
}
