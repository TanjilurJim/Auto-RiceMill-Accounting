import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Permission {
    id: number;
    name: string;
    description?: string;
    created_at: string;
}

export default function EditPermission({ permission }: { permission: Permission }) {
    const t = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        name: permission.name,
        description: permission.description || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Permissions', href: '/permissions' },
        { title: `Edit "${permission.name}"`, href: `/permissions/${permission.id}/edit` },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/permissions/${permission.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('pmEditPageTitle')} - ${permission.name}`} />

            <div className="p-4 md:p-12">
                <h1 className="mb-6 text-2xl font-bold">{t('pmEditPermissionTitle')}</h1>

                <form onSubmit={submit} className="space-y-4 rounded bg-background p-4 shadow dark:bg-neutral-900">
                    <div>
                        <label htmlFor="name" className="mb-1 block font-medium">
                            {t('pmPermissionNameLabel')}
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            placeholder={t('pmNamePlaceholder')}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="description" className="mb-1 block font-medium">
                            {t('pmDescriptionLabel')}
                        </label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            placeholder={t('pmDescriptionPlaceholder')}
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Link href="/permissions" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                            {t('pmCancelButton')}
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? t('pmSavingText') : t('pmSaveChangesButton')}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
