import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function CreateDepartment() {
    const t = useTranslation();

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/departments');
    };

    return (
        <AppLayout>
            <Head title={t('createDepartmentTitle')} />

            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg bg-background">
                    <PageHeader title={t('createDepartmentTitle')} addLinkHref="/departments" addLinkText={t('hrBackText')} />

                    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-background p-6 dark:bg-neutral-900">
                        {/* Department Name */}
                        <div>
                            <label htmlFor="name" className="mb-1 block font-medium">
                                {t('departmentNameLabel')}
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder={t('enterDepartmentNamePlaceholder')}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="mb-1 block font-medium">
                                {t('hrDescriptionLabel')}
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder={t('optionalDescriptionPlaceholder')}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        {/* Actions */}
                        <ActionFooter
                            className="justify-end"
                            onSubmit={handleSubmit}
                            cancelHref="/departments"
                            processing={processing}
                            submitText={t('hrCreateText')}
                            cancelText={t('cancelText')}
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
