/* resources/js/Pages/dryers/Edit.tsx
   -------------------------------------------------------------- */
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Link, useForm } from '@inertiajs/react';
import Form from './Form';

interface Props {
    dryer: {
        id: number;
        dryer_name: string;
        dryer_type: string | null;
        capacity: number | string;
        batch_time: number | string | null;
        manufacturer: string | null;
        model_number: string | null;
        power_kw: number | string | null;
        fuel_type: string | null;
        length_mm: number | string | null;
        width_mm: number | string | null;
        height_mm: number | string | null;
    };
}

export default function Edit({ dryer }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        ...dryer,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('dryers.update', dryer.id));
    };

    return (
        <AppLayout title={`Edit ${dryer.dryer_name}`}>
            <PageHeader
                title={`Edit – ${dryer.dryer_name}`}
                actions={
                     <Link href={route('dryers.index')} className="btn btn-sm btn-secondary">
                        ← Back to List
                    </Link>
                }
            />

            <Form
                data={data}
                setData={setData}
                onSubmit={submit}
                processing={processing}
                errors={errors}
                submitText="Update"
                cancelHref={route('dryers.index')} // Pass the cancel link
            />
        </AppLayout>
    );
}