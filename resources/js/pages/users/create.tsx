import ActionFooter from '@/components/ActionFooter';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

interface Role {
    id: number;
    name: string;
}

export default function CreateUser({ roles }: { roles: Role[] }) {
    const { auth } = usePage().props as any;
    const isAdmin = !!auth?.isAdmin;

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as number[],

        // 👇 new (admin-only UI will send these if used)
        trial_mode: null as 'add' | 'set' | null,
        trial_days: null as number | null,
        trial_date: null as string | null,
    });

    const toggleRole = (id: number) => {
        setData('roles', data.roles.includes(id) ? data.roles.filter((rid) => rid !== id) : [...data.roles, id]);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: any = { ...data };
        if (payload.trial_mode !== 'add') payload.trial_days = null;
        if (payload.trial_mode !== 'set') payload.trial_date = null;
        post('/users', payload);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/users' },
        { title: 'Create User', href: '/users/create' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <div className="bg-background h-full w-screen p-6 lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">
                    <PageHeader title="Create User" addLinkHref="/users" addLinkText="Back" />

                    <form onSubmit={submit} className="space-y-4 rounded-lg border bg-white p-4 dark:bg-neutral-900">
                        <div>
                            <label className="mb-1 block font-medium">Name</label>
                            <input
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Email</label>
                            <input
                                type="email"
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        {/* Password (always visible & required) */}
                        <div>
                            <label className="mb-1 block font-medium">Password</label>
                            <input
                                type="password"
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Confirm Password</label>
                            <input
                                type="password"
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                        </div>

                        {/* Roles */}
                        <div>
                            <label className="mb-1 block font-medium">Assign Roles</label>
                            <div className="grid grid-cols-2 gap-2">
                                {roles.map((role) => (
                                    <label key={role.id} className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            className="accent-blue-600"
                                            checked={data.roles.includes(role.id)}
                                            onChange={() => toggleRole(role.id)}
                                            disabled={!isAdmin && role.name.toLowerCase() === 'admin'}
                                        />
                                        {role.name}
                                    </label>
                                ))}
                            </div>
                            {errors.roles && <p className="mt-1 text-sm text-red-500">{errors.roles}</p>}
                        </div>

                        {/* Trial options (Admin only) */}
                        {isAdmin && (
                            <div className="space-y-2 rounded-lg border p-3">
                                <div className="text-sm font-medium">Trial (optional)</div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        className={`rounded border px-3 py-1 text-sm ${data.trial_mode === 'add' && data.trial_days === 7 ? 'bg-blue-600 text-white' : ''}`}
                                        onClick={() => setData({ ...data, trial_mode: 'add', trial_days: 7, trial_date: null })}
                                    >
                                        +7 days
                                    </button>
                                    <button
                                        type="button"
                                        className={`rounded border px-3 py-1 text-sm ${data.trial_mode === 'add' && data.trial_days === 30 ? 'bg-blue-600 text-white' : ''}`}
                                        onClick={() => setData({ ...data, trial_mode: 'add', trial_days: 30, trial_date: null })}
                                    >
                                        +30 days
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <InputCalendar label="" value={data.trial_date ?? ''} onChange={(val) => setData({ ...data, trial_date: val })} />
                                        {/* <input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={data.trial_date ?? ''}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    trial_mode: e.target.value ? 'set' : null,
                                                    trial_date: e.target.value || null, // '' → null
                                                    trial_days: null,
                                                })
                                            }
                                            className="rounded-md border p-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                        /> */}
                                        {data.trial_date && (
                                            <button
                                                type="button"
                                                className="rounded border px-3 py-1 text-sm"
                                                onClick={() => setData({ ...data, trial_mode: null, trial_date: null, trial_days: null })} // ← null, not ''
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {errors.trial_mode && <p className="text-xs text-red-500">{errors.trial_mode}</p>}
                                {errors.trial_days && <p className="text-xs text-red-500">{errors.trial_days}</p>}
                                {errors.trial_date && <p className="text-xs text-red-500">{errors.trial_date}</p>}
                                <p className="text-xs text-gray-500">
                                    “+7/+30” adds days from today. “Date” sets a custom end (end of selected day).
                                </p>
                            </div>
                        )}

                        <ActionFooter
                            processing={processing}
                            onSubmit={submit}
                            submitText={processing ? 'Creating...' : 'Create User'}
                            cancelHref="/users"
                            className="justify-end"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
