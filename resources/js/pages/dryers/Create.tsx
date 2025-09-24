/* resources/js/Pages/dryers/Create.tsx
   -------------------------------------------------------------- */
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import Form from './Form';
import { useTranslation } from '@/components/useTranslation';

export default function Create() {
    const t = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        dryer_name: '',
        dryer_type: '',
        capacity: '',
        batch_time: '',
        manufacturer: '',
        model_number: '',
        power_kw: '',
        fuel_type: '',
        length_mm: '',
        width_mm: '',
        height_mm: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dryers.store'));
    };

    return (
        <AppLayout>
            <Head title={t('addDryerHeader')} />

            <div className="bg-background h-full w-screen p-6 lg:w-full">
                <div className="text-card-foreground h-full rounded-lg p-6">
                    <PageHeader title={t('addDryerHeader')} addLinkHref="/dryers" addLinkText={t('backDryer')} />

                    <Form
                        data={data}
                        setData={setData}
                        onSubmit={submit}
                        processing={processing}
                        errors={errors}
                        submitText="Create"
                        cancelHref={route('dryers.index')} // Pass the cancel link
                    />
                </div>
            </div>
        </AppLayout>
    );
}
