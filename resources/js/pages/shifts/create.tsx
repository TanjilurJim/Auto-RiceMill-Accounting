import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function CreateShift() {
    const t = useTranslation();

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        start_time: '',
        end_time: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/shifts');
    };

    return (
        <AppLayout>
            <Head title={t('createShiftTitle')} />
            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg bg-white">
                    <PageHeader title={t('createShiftTitle')} addLinkHref="/shifts" addLinkText={t('hrBackText')} />

                    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-white p-6 dark:bg-neutral-900">
                        {/* Shift Name */}
                        <div>
                            <label htmlFor="name" className="mb-1 block font-medium">
                                {t('shiftNameLabel')}
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder={t('enterShiftNamePlaceholder')}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Start Time */}
                        <div>
                            <label htmlFor="start_time" className="mb-1 block font-medium">
                                {t('startTimeLabel')}
                            </label>
                            <input
                                id="start_time"
                                type="time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.start_time && <p className="text-sm text-red-500">{errors.start_time}</p>}
                        </div>

                        {/* End Time */}
                        <div>
                            <label htmlFor="end_time" className="mb-1 block font-medium">
                                {t('endTimeLabel')}
                            </label>
                            <input
                                id="end_time"
                                type="time"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.end_time && <p className="text-sm text-red-500">{errors.end_time}</p>}
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
                        {/* <div className="flex justify-end space-x-2">
                            <Link href="/shifts" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Create'}
                            </button>
                        </div> */}
                        <ActionFooter
                            onSubmit={handleSubmit}
                            cancelHref="/shifts"
                            processing={processing}
                            submitText={t('hrCreateText')}
                            cancelText={t('cancelText')}
                            className="justify-end"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
