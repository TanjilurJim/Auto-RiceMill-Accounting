import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
}

export default function EditRole({ role, permissions, rolePermissions }: { role: Role; permissions: Permission[]; rolePermissions: number[] }) {
    const t = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: rolePermissions, // pre-populated
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('ro-dashboard'), href: '/dashboard' },
        { title: t('ro-roles'), href: '/roles' },
        { title: `${t('ro-edit')} ${role.name}`, href: `/roles/${role.id}/edit` },
    ];

    const togglePermission = (id: number) => {
        setData('permissions', data.permissions.includes(id) ? data.permissions.filter((pid) => pid !== id) : [...data.permissions, id]);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/roles/${role.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('ro-edit')} ${role.name}`} />
            <div className="bg-background mx-auto w-full p-4 md:h-screen md:p-12">
                {/* <h1 className="text-2xl font-bold mb-6">Edit Role</h1> */}
                <PageHeader title={t('ro-edit-role')} addLinkHref="/roles" addLinkText={t('ro-back')} />

                <form onSubmit={submit} className="space-y-4 rounded bg-background p-4 shadow dark:bg-neutral-900">
                    <div>
                        <label htmlFor="name" className="mb-1 block font-medium">
                            {t('ro-role-name')}
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            placeholder={t('ro-role-name-example')}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Permissions Checkboxes */}
                    <div>
                        <label className="mb-1 block font-medium">{t('ro-assigned-permissions')}</label>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
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
                        submitText={processing ? t('ro-saving') : t('ro-save-changes')}
                        className="justify-end"
                        cancelHref="/roles"
                    />
                </form>
            </div>
        </AppLayout>
    );
}
