import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

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
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">
                    <PageHeader title={`User Details - ${user.name}`} addLinkHref='/users' addLinkText='Back' />

                    <div className="space-y-4 rounded-lg bg-white p-4 border dark:bg-neutral-900">
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
                                className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${user.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
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
                        <ActionFooter
                            cancelHref='/users'
                            printHref={`/users/${user.id}/edit`}
                            printText='Edit'
                            className='justify-end'
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
