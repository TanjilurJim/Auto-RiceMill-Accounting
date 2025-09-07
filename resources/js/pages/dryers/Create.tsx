/* resources/js/Pages/dryers/Create.tsx
   -------------------------------------------------------------- */
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import Form from './Form';

export default function Create() {
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
        <AppLayout title="New Dryer">
            <Head title="Add Dryers" />

            <div className="h-full w-screen bg-background p-6 lg:w-full">
                <div className="h-full rounded-lg text-card-foreground p-6">
                    <PageHeader title="Add Dryer" addLinkHref="/dryers" addLinkText="<- Back" />

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
