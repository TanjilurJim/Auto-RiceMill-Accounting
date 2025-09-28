// resources/js/pages/items/create.tsx
import ItemForm from '@/components/Form/ItemForm';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
}

interface Unit {
    id: number;
    name: string;
}

interface Godown {
    id: number;
    name: string;
}

interface AllProps {
    categories: Category[];
    units: Unit[];
    godowns: Godown[];
}

export default function ItemCreate({ categories, units, godowns }: AllProps) {
    const t = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        date: '',
        item_name: '',
        unit_id: '',
        category_id: '',
        godown_id: '',
        purchase_price: '',
        sale_price: '',
        previous_stock: '',
        total_previous_stock_value: '',
        weight: '',
        total_weight: '',
        description: '',
        lot_no: '', // ← NEW
        received_at: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/items');
    };

    return (
        <AppLayout>
            <Head title={t('createItemTitle')} />
            <div className="bg-background h-full p-6">
                <div className="bg-forground h-full rounded-lg p-6">
                    <PageHeader title={t('createItemTitle')} addLinkHref="/items" addLinkText={t('backToItems')} />

                    <ItemForm
                        data={data}
                        setData={setData}
                        handleSubmit={handleSubmit}
                        processing={processing}
                        errors={errors}
                        submitText={t('createItemSubmit')}
                        cancelHref="/items"
                        categories={categories}
                        units={units}
                        godowns={godowns}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
